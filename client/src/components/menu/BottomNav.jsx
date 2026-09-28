import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { HomeIcon, CartIcon } from '../common/Icons';
import styles from './BottomNav.module.css';

export default function BottomNav() {
  const { t } = useLanguage();
  const { totalCount, openCart } = useCart();

  return (
    <div className={styles.wrap}>
      <div className={styles.pill}>
        <button
          type="button"
          className={`${styles.segment} ${styles.segmentActive}`}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <HomeIcon size={19} />
          <span>{t('menu.menuTab')}</span>
        </button>
        <button type="button" className={styles.segment} onClick={openCart}>
          <span className={styles.cartIconWrap}>
            <CartIcon size={19} />
            {totalCount > 0 && <span className={styles.badge}>{totalCount}</span>}
          </span>
          <span>{t('menu.cartTab')}</span>
        </button>
      </div>
    </div>
  );
}
