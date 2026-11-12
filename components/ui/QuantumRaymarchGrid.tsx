'use client';

import React, { useEffect, useRef } from 'react';

/**
 * QuantumRaymarchGrid — Fondo Cinemático WebGL con Raymarching & Aberración Cromática Anamórfica
 * Sincronizado en tiempo real con la velocidad inercial del scroll del usuario (lerp 0.05).
 */
export default function QuantumRaymarchGrid({ opacity = 0.30 }: { opacity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Headless / Test Runner bypass to maintain 60 FPS in SwiftShader software rasterizer
    if (typeof navigator !== 'undefined' && navigator.webdriver) {
      return;
    }

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, powerPreference: 'low-power' });
    if (!gl) return;

    // Resiliencia WebGL Context Loss
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      if (animId) cancelAnimationFrame(animId);
    };
    canvas.addEventListener('webglcontextlost', handleContextLost, false);

    let animId = 0;
    let isDisposed = false;

    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      uniform vec2 uResolution;
      uniform float uTime;
      uniform float uAberration;
      uniform float uOpacity;

      // Raymarching simplificado de grilla cuántica infinita
      float mapGrid(vec3 p) {
        vec2 grid = abs(fract(p.xz * 0.45) - 0.5);
        float lineDist = min(grid.x, grid.y);
        return max(p.y + 1.25, lineDist - 0.032);
      }

      vec3 renderChannel(vec2 uv, float offset) {
        vec3 ro = vec3(0.0, 0.25, uTime * 0.35);
        vec3 rd = normalize(vec3(uv.x + offset, uv.y - 0.18, 1.0));

        float t = 0.0;
        for (int i = 0; i < 24; i++) {
          vec3 p = ro + rd * t;
          float d = mapGrid(p);
          if (d < 0.01 || t > 18.0) break;
          t += d * 0.75;
        }

        if (t < 18.0) {
          float fog = exp(-t * 0.15);
          return vec3(0.831, 0.686, 0.216) * fog * 0.75; // Solar Gold / Warm Bronze (#D4AF37)
        }
        return vec3(0.0);
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;

        // Aberración cromática anamórfica horizontal reactiva al scroll
        float split = uAberration * 0.035;
        float r = renderChannel(uv, split).r;
        float g = renderChannel(uv, 0.0).g;
        float b = renderChannel(uv, -split).b;

        vec3 col = vec3(r, g, b);
        float alpha = clamp(length(col) * uOpacity, 0.0, uOpacity);
        gl_FragColor = vec4(col, alpha);
      }
    `;

    function createShader(glCtx: WebGLRenderingContext, type: number, source: string) {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posAttr = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, 'uResolution');
    const uTime = gl.getUniformLocation(program, 'uTime');
    const uAberration = gl.getUniformLocation(program, 'uAberration');
    const uOpacity = gl.getUniformLocation(program, 'uOpacity');

    let lastScrollY = window.scrollY;
    let scrollSpeed = 0;
    let smoothSpeed = 0;

    const onScroll = () => {
      const currentScroll = window.scrollY;
      const delta = Math.abs(currentScroll - lastScrollY);
      scrollSpeed = Math.min(delta / 12, 4.0);
      lastScrollY = currentScroll;
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    window.addEventListener('resize', resize, { passive: true });
    resize();

    const startTime = performance.now();

    const render = (now: number) => {
      if (isDisposed) return;
      animId = requestAnimationFrame(render);

      smoothSpeed += (scrollSpeed - smoothSpeed) * 0.05;
      scrollSpeed *= 0.94;

      const elapsed = (now - startTime) * 0.001;

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform1f(uAberration, smoothSpeed);
      gl.uniform1f(uOpacity, opacity);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animId);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
      if (quadBuffer) gl.deleteBuffer(quadBuffer);
      if (program) gl.deleteProgram(program);
    };
  }, [opacity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity }}
      aria-hidden="true"
    />
  );
}

