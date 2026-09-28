import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import * as authService from '../../services/authService';
import PageHeader from '../../components/admin/PageHeader';
import Button from '../../components/common/Button';
import { Field, inputClass } from '../../components/admin/Field';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { admin, setAdmin } = useAuth();
  const { t } = useLanguage();
  const toast = useToast();

  const [name, setName] = useState(admin?.name || '');
  const [username, setUsername] = useState(admin?.username || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const payload = { name, username };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }
      const updated = await authService.updateProfile(payload);
      setAdmin(updated);
      setCurrentPassword('');
      setNewPassword('');
      toast.success(t('admin.profile.updated'));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader title={t('admin.profile.title')} />

      <div className={styles.panel}>
        <Field label={t('admin.profile.name')}>
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label={t('admin.profile.username')}>
          <input className={inputClass} value={username} onChange={(e) => setUsername(e.target.value)} />
        </Field>

        <h3 className={styles.subTitle}>{t('admin.profile.changePassword')}</h3>
        <Field label={t('admin.profile.currentPassword')}>
          <input className={inputClass} type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        </Field>
        <Field label={t('admin.profile.newPassword')}>
          <input className={inputClass} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </Field>

        <Button onClick={handleSave} loading={saving}>{t('common.save')}</Button>
      </div>
    </div>
  );
}
