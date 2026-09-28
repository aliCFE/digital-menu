import { useEffect, useRef, useState } from 'react';
import styles from './HeroCarousel.module.css';

export default function HeroCarousel({ slides, onSlideClick }) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const touchStartX = useRef(0);

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timerRef.current);
  }, [slides.length, index]);

  if (!slides.length) return null;
  const active = slides[index];

  function restartTimer() {
    clearInterval(timerRef.current);
  }

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e) {
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) < 40) return;
    restartTimer();
    setIndex((prev) => {
      const dir = delta > 0 ? -1 : 1;
      return (prev + dir + slides.length) % slides.length;
    });
  }

  return (
    <div className={styles.wrap}>
      <div
        className={styles.slide}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => onSlideClick?.(active)}
      >
        <img src={active.image} alt={active.caption || ''} className={styles.image} />
        <div className={styles.gradient} />
        {active.caption && <p className={styles.caption}>{active.caption}</p>}
      </div>

      {slides.length > 1 && (
        <div className={styles.dots}>
          {slides.map((s, i) => (
            <button
              key={s.id || i}
              type="button"
              className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
              onClick={() => { restartTimer(); setIndex(i); }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
