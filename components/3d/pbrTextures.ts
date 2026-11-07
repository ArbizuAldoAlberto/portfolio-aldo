import * as THREE from 'three';

/**
 * Generador procedural de texturas PBR táctiles para WebGL / Three.js
 * Cero dependencias externas, cero assets pesados, 100% sintetizado en GPU / CPU DataTexture.
 */

/**
 * Textura de Micro-Granulado Rugoso para Chasis Industrial IP67 (Polycarbonate/ABS)
 */
export function createMicroPebbleNormalTexture(size = 256): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    const nx = 128 + Math.floor((Math.random() - 0.5) * 32);
    const ny = 128 + Math.floor((Math.random() - 0.5) * 32);
    data[i * 4] = nx;
    data[i * 4 + 1] = ny;
    data[i * 4 + 2] = 255;
    data[i * 4 + 3] = 255;
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Textura de Anisotropía Cepillada & Micro-Arañazos para Titanio Grado 5 y Aluminio Aeroespacial
 */
export function createAnisotropicRoughnessTexture(size = 256): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      // Líneas de cepillado horizontal continuo con micro-ruido de grano
      const brushNoise = Math.sin(y * 1.8) * 0.15 + (Math.random() - 0.5) * 0.25;
      const scratch = Math.random() > 0.985 ? 0.35 : 0.0;
      const roughnessVal = Math.min(255, Math.max(0, Math.floor((0.22 + brushNoise + scratch) * 255)));

      data[idx] = roughnessVal;     // R: Roughness
      data[idx + 1] = roughnessVal; // G
      data[idx + 2] = roughnessVal; // B
      data[idx + 3] = 255;          // A
    }
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 2);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Textura Procedural Voronoi de Flor de Zinc (Spangle) para Acero Galvanizado Industrial
 */
export function createZincSpangleTexture(size = 256): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  const numSeeds = 32;
  const seedsX: number[] = [];
  const seedsY: number[] = [];
  const seedsLuma: number[] = [];

  for (let i = 0; i < numSeeds; i++) {
    seedsX.push(Math.random() * size);
    seedsY.push(Math.random() * size);
    seedsLuma.push(160 + Math.floor(Math.random() * 85));
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let minDist = 999999;
      let closestSeed = 0;

      for (let s = 0; s < numSeeds; s++) {
        const dx = x - seedsX[s];
        const dy = y - seedsY[s];
        const d = dx * dx + dy * dy;
        if (d < minDist) {
          minDist = d;
          closestSeed = s;
        }
      }

      const idx = (y * size + x) * 4;
      const crystalLuma = seedsLuma[closestSeed];
      const edge = Math.sqrt(minDist) < 1.5 ? 40 : crystalLuma;

      data[idx] = edge;
      data[idx + 1] = edge;
      data[idx + 2] = edge;
      data[idx + 3] = 255;
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.needsUpdate = true;
  return texture;
}

