import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { PlusIcon } from '../common/Icons';
import styles from './ItemCard.module.css';

export default function ItemCard({ item, onOpen }) {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const toast = useToast();

  const name = item.name;

  function handleQuickAdd(e) {
    e.stopPropagation();
    if (!item.available) return;
    addItem(item, 1);
    toast.success(t('menu.itemAdded'));
  }

  return (
    <div className={styles.card} onClick={() => onOpen(item)} role="button" tabIndex={0}>
      <div className={styles.imageWrap}>
        <img src={item.image} alt={name} className={styles.image} loading="lazy" />
        {!item.available && (
          <div className={styles.soldOutOverlay}>
            <span>{t('common.soldOut')}</span>
          </div>
        )}
        <div className={styles.badges}>
          {item.discount > 0 && <span className={`${styles.badge} ${styles.badgeDiscount}`}>-{item.discount}%</span>}
          {item.isNew && <span className={`${styles.badge} ${styles.badgeNew}`}>{t('menu.new')}</span>}
        </div>
        {item.available && (
          <button type="button" className={styles.addBtn} onClick={handleQuickAdd} aria-label={t('menu.addToCart')}>
            <PlusIcon size={17} />
          </button>
        )}
      </div>
      <div className={styles.info}>
        <h4 className={`${styles.name} line-clamp-2`}>{name}</h4>
        <div className={styles.priceRow}>
          <span className={styles.price}>{formatCurrency(item.price)}</span>
          {item.oldPrice ? <span className={styles.oldPrice}>{formatCurrency(item.oldPrice)}</span> : null}
        </div>
      </div>
    </div>
  );
}
