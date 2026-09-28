import { useEffect, useState } from 'react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import ImageUpload from '../../components/common/ImageUpload';
import { Field, ToggleField, inputClass, textareaClass } from '../../components/admin/Field';
import { useLanguage } from '../../context/LanguageContext';

const EMPTY = { name: '', description: '', image: '', active: true };

export default function CategoryFormModal({ open, onClose, onSubmit, initialValue, saving }) {
  const { t } = useLanguage();
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (open) setForm(initialValue ? { ...EMPTY, ...initialValue } : EMPTY);
  }, [open, initialValue]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <Modal open={open} onClose={onClose} title={initialValue ? t('common.edit') : t('admin.categories.addNew')}>
      <form onSubmit={handleSubmit}>
        <ImageUpload label={t('admin.categories.image')} value={form.image} onChange={(url) => update('image', url)} aspect="16 / 10" />

        <div style={{ marginTop: 16 }}>
          <Field label={t('admin.categories.name')}>
            <input className={inputClass} value={form.name} onChange={(e) => update('name', e.target.value)} required />
          </Field>
          <Field label={t('common.optional')}>
            <textarea className={textareaClass} value={form.description} onChange={(e) => update('description', e.target.value)} rows={2} />
          </Field>
          <ToggleField label={t('common.active')} checked={form.active} onChange={(v) => update('active', v)} />
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 8, justifyContent: 'flex-end' }}>
          <Button variant="secondary" type="button" onClick={onClose}>{t('common.cancel')}</Button>
          <Button type="submit" loading={saving}>{t('common.save')}</Button>
        </div>
      </form>
    </Modal>
  );
}
