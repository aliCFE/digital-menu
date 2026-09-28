import Modal from './Modal';
import styles from './ConfirmDialog.module.css';
import { useLanguage } from '../../context/LanguageContext';

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, danger = true, loading = false }) {
  const { t } = useLanguage();
  return (
    <Modal open={open} onClose={onClose} title={title} width={420}>
      <p className={styles.message}>{message}</p>
      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={loading}>
          {t('common.cancel')}
        </button>
        <button
          type="button"
          className={danger ? styles.dangerBtn : styles.confirmBtn}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? t('common.loading') : t('common.confirm')}
        </button>
      </div>
    </Modal>
  );
}
