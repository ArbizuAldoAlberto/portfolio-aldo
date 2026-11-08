'use client';
import { ReactLenis, useLenis } from 'lenis/react';
import { ReactNode, useEffect } from 'react';

function ScrollRestorer() {
  const lenis = useLenis();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const savedY = sessionStorage.getItem('webanti_scroll_y');
    const isRestoring = sessionStorage.getItem('webanti_restoring_scroll');

    if (isRestoring && savedY !== null) {
      const targetY = parseFloat(savedY);
      let frames = 0;
      const maxFrames = 25;

      const restore = () => {
        frames++;
        if (lenis) {
          lenis.scrollTo(targetY, { immediate: true });
        } else {
          window.scrollTo({ top: targetY, behavior: 'instant' });
        }
        window.dispatchEvent(new Event('scroll'));

        if (frames < maxFrames) {
          requestAnimationFrame(restore);
        } else {
          sessionStorage.removeItem('webanti_restoring_scroll');
        }
      };

      requestAnimationFrame(restore);
    }
  }, [lenis]);

  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      <ScrollRestorer />
      {children}
    </ReactLenis>
  );
}