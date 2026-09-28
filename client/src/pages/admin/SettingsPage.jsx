import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import * as restaurantService from '../../services/restaurantService';
import PageHeader from '../../components/admin/PageHeader';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import ImageUpload from '../../components/common/ImageUpload';
import { Field, FieldRow, inputClass, textareaClass } from '../../components/admin/Field';
import { TrashIcon, PlusIcon } from '../../components/common/Icons';
import styles from './SettingsPage.module.css';

export default function SettingsPage() {
  const { t } = useLanguage();
  const toast = useToast();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    restaurantService.getMyRestaurant().then(setRestaurant).finally(() => setLoading(false));
  }, []);

  function update(field, value) {
    setRestaurant((prev) => ({ ...prev, [field]: value }));
  }
  function updateSocial(field, value) {
    setRestaurant((prev) => ({ ...prev, social: { ...prev.social, [field]: value } }));
  }
  function updateCover(index, url) {
    setRestaurant((prev) => {
      const cover = [...(prev.cover || [])];
      cover[index] = url;
      return { ...prev, cover };
    });
  }
  function addCover() {
    setRestaurant((prev) => ({ ...prev, cover: [...(prev.cover || []), ''] }));
  }
  function removeCover(index) {
    setRestaurant((prev) => ({ ...prev, cover: prev.cover.filter((_, i) => i !== index) }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const { name, description, logo, cover, phone, whatsapp, address, social, googleMapsUrl, slug, telegramBotToken, telegramChatId } = restaurant;
      const updated = await restaurantService.updateMyRestaurant({
        name, description, logo,
        cover: (cover || []).filter(Boolean), phone, whatsapp, address, social, googleMapsUrl, slug,
        telegramBotToken, telegramChatId,
      });
      setRestaurant(updated);
      toast.success(t('admin.settings.saved'));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading || !restaurant) {
    return <div className={styles.loading}><Spinner size={24} /></div>;
  }

  return (
    <div>
      <PageHeader
        title={t('admin.settings.title')}
        action={<Button onClick={handleSave} loading={saving}>{t('common.save')}</Button>}
      />

      <div className={styles.panel}>
        <h3 className={styles.sectionTitle}>{t('admin.settings.general')}</h3>

        <div className={styles.logoRow}>
          <ImageUpload label={t('admin.settings.logo')} value={restaurant.logo} onChange={(url) => update('logo', url)} aspect="1 / 1" />
          <p className={styles.hint}>{t('admin.settings.logoHint')}</p>
        </div>

        <Field label={t('admin.settings.name')}>
          <input className={inputClass} value={restaurant.name || ''} onChange={(e) => update('name', e.target.value)} />
        </Field>

        <Field label={t('admin.settings.description')}>
          <textarea className={textareaClass} rows={3} value={restaurant.description || ''} onChange={(e) => update('description', e.target.value)} />
        </Field>

        <Field label={t('admin.settings.menuLink')} hint={`${window.location.origin}/r/${restaurant.slug}`}>
          <div className={styles.slugRow}>
            <span>/r/</span>
            <input className={inputClass} value={restaurant.slug || ''} onChange={(e) => update('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} />
          </div>
        </Field>
      </div>

      <div className={styles.panel}>
        <h3 className={styles.sectionTitle}>{t('admin.settings.cover')}</h3>
        <div className={styles.coverGrid}>
          {(restaurant.cover || []).map((url, i) => (
            <div key={i} className={styles.coverItem}>
              <ImageUpload value={url} onChange={(v) => updateCover(i, v)} aspect="16 / 10" />
              <button type="button" className={styles.removeCoverBtn} onClick={() => removeCover(i)}><TrashIcon size={14} /></button>
            </div>
          ))}
          <button type="button" className={styles.addCoverBtn} onClick={addCover}>
            <PlusIcon size={18} />
          </button>
        </div>
      </div>

      <div className={styles.panel}>
        <h3 className={styles.sectionTitle}>{t('admin.settings.contact')}</h3>
        <FieldRow>
          <Field label={t('admin.settings.phone')}>
            <input className={inputClass} dir="ltr" value={restaurant.phone || ''} onChange={(e) => update('phone', e.target.value)} />
          </Field>
          <Field label={t('admin.settings.whatsapp')}>
            <input className={inputClass} dir="ltr" value={restaurant.whatsapp || ''} onChange={(e) => update('whatsapp', e.target.value)} />
          </Field>
        </FieldRow>
        <Field label={t('admin.settings.address')}>
          <input className={inputClass} value={restaurant.address || ''} onChange={(e) => update('address', e.target.value)} />
        </Field>
        <Field label={t('admin.settings.googleMaps')}>
          <input className={inputClass} dir="ltr" value={restaurant.googleMapsUrl || ''} onChange={(e) => update('googleMapsUrl', e.target.value)} />
        </Field>
      </div>

      <div className={styles.panel}>
        <h3 className={styles.sectionTitle}>{t('admin.settings.social')}</h3>
        <Field label={t('admin.settings.facebook')}>
          <input className={inputClass} dir="ltr" value={restaurant.social?.facebook || ''} onChange={(e) => updateSocial('facebook', e.target.value)} />
        </Field>
      </div>

      <div className={styles.panel}>
        <h3 className={styles.sectionTitle}>{t('admin.settings.telegram')}</h3>
        <p className={styles.hint} style={{ marginBottom: 14 }}>{t('admin.settings.telegramHint')}</p>
        <Field label={t('admin.settings.telegramBotToken')}>
          <input className={inputClass} dir="ltr" placeholder="123456789:AAExampleTokenFromBotFather" value={restaurant.telegramBotToken || ''} onChange={(e) => update('telegramBotToken', e.target.value)} />
        </Field>
        <Field label={t('admin.settings.telegramChatId')}>
          <input className={inputClass} dir="ltr" placeholder="123456789" value={restaurant.telegramChatId || ''} onChange={(e) => update('telegramChatId', e.target.value)} />
        </Field>
      </div>
    </div>
  );
}
