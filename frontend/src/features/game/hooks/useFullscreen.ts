import { useEffect, useState, type RefObject } from 'react';

interface FullscreenControls {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

/**
 * Estado de pantalla completa del elemento dado:
 * - `isFullscreen` sigue a `document.fullscreenElement`.
 * - `toggleFullscreen` entra/sale del fullscreen del elemento.
 *
 * El listener vive en `document` porque el cambio puede venir
 * de fuera (p. ej. la tecla F11 o Escape del navegador).
 */
export function useFullscreen(
  containerRef: RefObject<HTMLElement | null>
): FullscreenControls {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, [containerRef]);

  const toggleFullscreen = () => {
    if (document.fullscreenElement === containerRef.current) {
      void document.exitFullscreen();
    } else {
      void containerRef.current?.requestFullscreen();
    }
  };

  return { isFullscreen, toggleFullscreen };
}
