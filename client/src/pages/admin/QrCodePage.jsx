import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import * as restaurantService from '../../services/restaurantService';
import PageHeader from '../../components/admin/PageHeader';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { CopyIcon } from '../../components/common/Icons';
import styles from './QrCodePage.module.css';

export default function QrCodePage() {
  const { t } = useLanguage();
  const toast = useToast();
  const [restaurant, setRestaurant] = useState(null);
  const [pngUrl, setPngUrl] = useState('');
  const [svgMarkup, setSvgMarkup] = useState('');
  const [loading, setLoading] = useState(true);

  const menuUrl = restaurant ? `${window.location.origin}/r/${restaurant.slug}` : '';

  useEffect(() => {
    restaurantService.getMyRestaurant().then(setRestaurant).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!menuUrl) return;
    QRCode.toDataURL(menuUrl, { width: 480, margin: 1, color: { dark: '#18201d', light: '#ffffff' } }).then(setPngUrl);
    QRCode.toString(menuUrl, { type: 'svg', margin: 1, color: { dark: '#18201d', light: '#ffffff' } }).then(setSvgMarkup);
  }, [menuUrl]);

  function downloadPng() {
    const a = document.createElement('a');
    a.href = pngUrl;
    a.download = `${restaurant.slug}-menu-qr.png`;
    a.click();
  }

  function downloadSvg() {
    const blob = new Blob([svgMarkup], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${restaurant.slug}-menu-qr.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function copyLink() {
    navigator.clipboard.writeText(menuUrl);
    toast.success(t('common.copied'));
  }

  if (loading || !restaurant) {
    return <div className={styles.loading}><Spinner size={24} /></div>;
  }

  return (
    <div>
      <PageHeader title={t('admin.qr.title')} subtitle={t('admin.qr.subtitle')} />

      <div className={styles.panel}>
        <div className={styles.qrBox}>
          {pngUrl && <img src={pngUrl} alt="QR code" className={styles.qrImage} />}
        </div>

        <div className={styles.linkRow}>
          <span className={styles.label}>{t('admin.qr.menuUrl')}</span>
          <div className={styles.linkBox}>
            <span dir="ltr">{menuUrl}</span>
            <button type="button" onClick={copyLink} aria-label="copy"><CopyIcon size={15} /></button>
          </div>
        </div>

        <div className={styles.actions}>
          <Button onClick={downloadPng}>{t('admin.qr.downloadPng')}</Button>
          <Button variant="secondary" onClick={downloadSvg}>{t('admin.qr.downloadSvg')}</Button>
        </div>
      </div>
    </div>
  );
}
