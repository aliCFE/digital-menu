import { useLanguage } from '../../context/LanguageContext';
import styles from './CheckoutForm.module.css';

const TYPES = ['dine-in', 'pickup', 'delivery'];

export default function CheckoutForm({ form, setForm }) {
  const { t } = useLanguage();

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className={styles.form}>
      <label className={styles.field}>
        <span>{t('checkout.name')}</span>
        <input
          type="text"
          value={form.customerName}
          placeholder={t('checkout.namePlaceholder')}
          onChange={(e) => update('customerName', e.target.value)}
        />
      </label>

      <label className={styles.field}>
        <span>{t('checkout.phone')}</span>
        <input
          type="tel"
          dir="ltr"
          value={form.phone}
          placeholder={t('checkout.phonePlaceholder')}
          onChange={(e) => update('phone', e.target.value)}
        />
      </label>

      <div className={styles.field}>
        <span>{t('checkout.orderType')}</span>
        <div className={styles.typeRow}>
          {TYPES.map((type) => (
            <button
              key={type}
              type="button"
              className={`${styles.typeBtn} ${form.type === type ? styles.typeBtnActive : ''}`}
              onClick={() => update('type', type)}
            >
              {t(`checkout.${type === 'dine-in' ? 'dineIn' : type}`)}
            </button>
          ))}
        </div>
      </div>

      <label className={styles.field}>
        <span>{t('checkout.notes')} <small>({t('common.optional')})</small></span>
        <textarea
          rows={2}
          value={form.notes}
          placeholder={t('checkout.notesPlaceholder')}
          onChange={(e) => update('notes', e.target.value)}
        />
      </label>
    </div>
  );
}
