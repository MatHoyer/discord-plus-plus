'use client';
import { useEffect, useRef } from 'react';

export const useEventListener = <K extends keyof WindowEventMap>(
  event: K,
  handler: (event: WindowEventMap[K]) => void,
  deps: React.DependencyList = [],
  element?: HTMLElement | Window | null
) => {
  const savedHandler = useRef<(event: WindowEventMap[K]) => void>();
  const targetElement =
    element || (typeof window !== 'undefined' ? window : null);

  useEffect(() => {
    if (!targetElement) {
      return;
    }

    savedHandler.current = handler;
  }, [targetElement, handler]);

  useEffect(() => {
    if (!(targetElement && targetElement.addEventListener)) {
      return;
    }

    const eventListener = (event: Event) => {
      if (savedHandler.current) {
        savedHandler.current(event as WindowEventMap[K]);
      }
    };

    targetElement.addEventListener(event, eventListener);

    return () => {
      targetElement.removeEventListener(event, eventListener);
    };
  }, [event, targetElement, deps]);
};
