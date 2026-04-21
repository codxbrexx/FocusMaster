import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export const useCounterAnimation = (targetValue: number, duration: number = 2) => {
  const [displayValue, setDisplayValue] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef({ value: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && animatedRef.current.value === 0) {
          // Check if user prefers reduced motion
          const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
          ).matches;

          if (prefersReducedMotion) {
            setDisplayValue(targetValue);
          } else {
            gsap.to(animatedRef.current, {
              value: targetValue,
              duration: duration,
              ease: 'power1.out',
              onUpdate: () => {
                setDisplayValue(Math.floor(animatedRef.current.value));
              },
            });
          }
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
      gsap.killTweensOf(animatedRef.current);
    };
  }, [targetValue, duration]);

  return { displayValue, elementRef };
};
