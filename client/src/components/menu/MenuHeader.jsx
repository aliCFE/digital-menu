import { useLanguage } from '../../context/LanguageContext';
import { SearchIcon, PhoneIcon, WhatsAppIcon, FacebookIcon } from '../common/Icons';
import styles from './MenuHeader.module.css';

export default function MenuHeader({ restaurant, onSearchClick }) {
  const { t } = useLanguage();
  const name = restaurant.name;

  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <div className={styles.identity}>
          <img src={restaurant.logo} alt={name} className={styles.logo} />
          <div className={styles.identityText}>
            <h1 className={styles.name}>{name}</h1>
          </div>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.iconBtn} onClick={onSearchClick} aria-label={t('common.search')}>
            <SearchIcon size={19} />
          </button>
        </div>
      </div>

      <div className={styles.contactRow}>
        {restaurant.phone && (
          <a href={`tel:${restaurant.phone}`} className={styles.phonePill}>
            <PhoneIcon size={14} />
            <span dir="ltr">{restaurant.phone}</span>
          </a>
        )}
        <div className={styles.socialIcons}>
          {restaurant.whatsapp && (
            <a href={`https://wa.me/${restaurant.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className={`${styles.socialLink} ${styles.whatsapp}`} aria-label="WhatsApp">
              <WhatsAppIcon size={17} />
            </a>
          )}
          {restaurant.social?.facebook && (
            <a href={restaurant.social.facebook} target="_blank" rel="noreferrer" className={`${styles.socialLink} ${styles.facebook}`} aria-label="Facebook">
              <FacebookIcon size={15} />
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
