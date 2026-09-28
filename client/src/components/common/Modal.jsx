import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

export default function Modal({ open, onClose, title, children, width = 520 }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className={styles.backdrop} onMouseDown={onClose}>
      <div
        className={styles.panel}
        style={{ maxWidth: width }}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {title && (
          <div className={styles.header}>
            <h3 className={styles.title}>{title}</h3>
            <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
              ×
            </button>
          </div>
        )}
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body
  );
}
