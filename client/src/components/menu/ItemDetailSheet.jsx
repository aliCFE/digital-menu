import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { XIcon, PlusIcon, MinusIcon } from '../common/Icons';
import styles from './ItemDetailSheet.module.css';

export default function ItemDetailSheet({ item, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const { t } = useLanguage();
  const { addItem } = useCart();
  const toast = useToast();

  useEffect(() => {
    setQuantity(1);
    document.body.style.overflow = item ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [item]);

  if (!item) return null;

  const { name, description } = item;

  function handleAdd() {
    addItem(item, quantity);
    toast.success(t('menu.itemAdded'));
    onClose();
  }

  return createPortal(
    <div className={styles.backdrop} onMouseDown={onClose}>
      <div className={styles.sheet} onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className={styles.imageWrap}>
          <span className={styles.dragHandle} />
          <button type="button" className={styles.closeIconBtn} onClick={onClose} aria-label={t('common.close')}>
            <XIcon size={18} />
          </button>
          <img src={item.image} alt={name} className={styles.image} />
        </div>

        <div className={styles.content}>
          <div className={styles.titleRow}>
            <h3 className={styles.name}>{name}</h3>
            <div className={styles.priceBlock}>
              <span className={styles.price}>{formatCurrency(item.price)}</span>
              {item.oldPrice ? <span className={styles.oldPrice}>{formatCurrency(item.oldPrice)}</span> : null}
            </div>
          </div>

          {description && <p className={styles.description}>{description}</p>}

          <span className={`${styles.availability} ${item.available ? styles.available : styles.unavailable}`}>
            <span className={styles.dot} />
            {item.available ? t('common.available') : t('common.soldOut')}
          </span>
        </div>

        {item.available && (
          <div className={styles.footer}>
            <div className={styles.stepper}>
              <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="decrease">
                <MinusIcon size={16} />
              </button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity((q) => q + 1)} aria-label="increase">
                <PlusIcon size={16} />
              </button>
            </div>
            <button type="button" className={styles.addBtn} onClick={handleAdd}>
              <span>{t('menu.addToCart')}</span>
              <span className={styles.addBtnPrice}>{formatCurrency(item.price * quantity)}</span>
            </button>
          </div>
        )}
        <button type="button" className={styles.closeTextBtn} onClick={onClose}>
          <XIcon size={15} /> {t('common.close')}
        </button>
      </div>
    </div>,
    document.body
  );
}
