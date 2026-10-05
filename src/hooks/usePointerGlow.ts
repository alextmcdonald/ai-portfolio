import { useEffect, useRef } from 'react';

export function usePointerGlow<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty('--glow-x', `${x}px`);
      el.style.setProperty('--glow-y', `${y}px`);
    };

    el.addEventListener('pointermove', handlePointerMove);
    return () => {
      el.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return ref;
}
