import { useEffect, useRef, useState } from 'react';

export function useScrollSpy(sectionIds, { rootMargin = '-140px 0px -65% 0px' } = {}) {
  const [activeId, setActiveId] = useState(sectionIds[0]);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!sectionIds.length) return undefined;

    observerRef.current?.disconnect();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin, threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    observerRef.current = observer;
    return () => observer.disconnect();
  }, [sectionIds, rootMargin]);

  return activeId;
}
