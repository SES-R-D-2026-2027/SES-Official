"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from 'react';

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

function subscribeReducedMotion(callback: () => void) {
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  options: ScrollRevealOptions = {}
): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  useEffect(() => {
    if (prefersReducedMotion) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (options.once !== false) {
            observer.unobserve(entry.target);
          }
        } else if (options.once === false) {
          setIsVisible(false);
        }
      },
      {
        threshold: options.threshold ?? 0.15,
        rootMargin: options.rootMargin ?? '0px 0px -40px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin, options.once, prefersReducedMotion]);

  return [ref, prefersReducedMotion || isVisible];
}

export default useScrollReveal;
