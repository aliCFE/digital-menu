import { useEffect, useState } from 'react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import ImageUpload from '../../components/common/ImageUpload';
import { Field, FieldRow, ToggleField, inputClass, textareaClass, selectClass } from '../../components/admin/Field';
import { useLanguage } from '../../context/LanguageContext';

const EMPTY = {
  name: '', description: '', price: '', oldPrice: '',
  categoryId: '', image: '', available: true, featured: false, popular: false, isNew: false, discount: 0,
};

export default function ItemFormModal({ open, onClose, onSubmit, initialValue, categories, saving }) {
  const { t } = useLanguage();
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (open) {
      setForm(initialValue ? { ...EMPTY, ...initialValue, price: initialValue.price ?? '', oldPrice: initialValue.oldPrice ?? '' } : { ...EMPTY, categoryId: categories[0]?.id || '' });
    }
  }, [open, initialValue, categories]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      ...form,
      price: Number(form.price) || 0,
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      discount: Number(form.discount) || 0,
    });
  }

  return (
    <Modal open={open} onClose={onClose} title={initialValue ? t('common.edit') : t('admin.items.addNew')} width={560}>
      <form onSubmit={handleSubmit}>
        <ImageUpload label={t('admin.items.image')} value={form.image} onChange={(url) => update('image', url)} />

        <div style={{ marginTop: 16 }}>
          <Field label={t('admin.items.name')}>
            <input className={inputClass} value={form.name} onChange={(e) => update('name', e.target.value)} required />
          </Field>

          <Field label={t('admin.items.description')}>
            <textarea className={textareaClass} rows={2} value={form.description} onChange={(e) => update('description', e.target.value)} />
          </Field>

          <FieldRow>
            <Field label={t('admin.items.price')}>
              <input className={inputClass} type="number" min="0" value={form.price} onChange={(e) => update('price', e.target.value)} required />
            </Field>
            <Field label={`${t('admin.items.oldPrice')} (${t('common.optional')})`}>
              <input className={inputClass} type="number" min="0" value={form.oldPrice} onChange={(e) => update('oldPrice', e.target.value)} />
            </Field>
          </FieldRow>

          <FieldRow>
            <Field label={t('admin.items.category')}>
              <select className={selectClass} value={form.categoryId} onChange={(e) => update('categoryId', e.target.value)} required>
                <option value="" disabled>{t('admin.items.selectCategory')}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>
            <Field label={`${t('admin.items.discount')} (${t('common.optional')})`}>
              <input className={inputClass} type="number" min="0" max="90" value={form.discount} onChange={(e) => update('discount', e.target.value)} />
            </Field>
          </FieldRow>

          <ToggleField label={t('common.available')} checked={form.available} onChange={(v) => update('available', v)} />
          <ToggleField label={t('admin.items.featured')} checked={form.featured} onChange={(v) => update('featured', v)} />
          <ToggleField label={t('admin.items.popular')} checked={form.popular} onChange={(v) => update('popular', v)} />
          <ToggleField label={t('admin.items.isNew')} checked={form.isNew} onChange={(v) => update('isNew', v)} />
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'flex-end' }}>
          <Button variant="secondary" type="button" onClick={onClose}>{t('common.cancel')}</Button>
          <Button type="submit" loading={saving}>{t('common.save')}</Button>
        </div>
      </form>
    </Modal>
  );
}
