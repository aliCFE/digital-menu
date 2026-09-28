import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import * as categoryService from '../../services/categoryService';
import PageHeader from '../../components/admin/PageHeader';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Spinner from '../../components/common/Spinner';
import { ChevronLeftIcon, ChevronRightIcon, EditIcon, TrashIcon } from '../../components/common/Icons';
import CategoryFormModal from './CategoryFormModal';
import styles from './CategoriesPage.module.css';

export default function CategoriesPage() {
  const { t } = useLanguage();
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    const data = await categoryService.listCategories();
    setCategories(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(form) {
    setSaving(true);
    try {
      if (editing) {
        await categoryService.updateCategory(editing.id, form);
        toast.success(t('admin.categories.updated'));
      } else {
        await categoryService.createCategory(form);
        toast.success(t('admin.categories.created'));
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await categoryService.deleteCategory(deleteTarget.id);
      toast.success(t('admin.categories.deleted'));
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.message || t('admin.categories.deleteBlocked'));
    } finally {
      setDeleting(false);
    }
  }

  async function move(index, direction) {
    const next = [...categories];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setCategories(next);
    await categoryService.reorderCategories(next.map((c) => c.id));
  }

  async function toggleActive(category) {
    await categoryService.updateCategory(category.id, { active: !category.active });
    load();
  }

  return (
    <div>
      <PageHeader
        title={t('admin.categories.title')}
        action={<Button onClick={() => { setEditing(null); setModalOpen(true); }}>+ {t('admin.categories.addNew')}</Button>}
      />

      {loading ? (
        <div className={styles.loading}><Spinner size={24} /></div>
      ) : categories.length === 0 ? (
        <EmptyState icon="🗂️" title={t('admin.categories.empty')} />
      ) : (
        <div className={styles.list}>
          {categories.map((cat, index) => {
            return (
              <div key={cat.id} className={styles.row}>
                <div className={styles.reorderCol}>
                  <button disabled={index === 0} onClick={() => move(index, -1)} aria-label="up"><ChevronLeftIcon size={16} className={styles.rotateUp} /></button>
                  <button disabled={index === categories.length - 1} onClick={() => move(index, 1)} aria-label="down"><ChevronRightIcon size={16} className={styles.rotateDown} /></button>
                </div>
                {cat.image ? <img src={cat.image} alt="" className={styles.thumb} /> : <div className={styles.thumbFallback}>{cat.name?.[0]}</div>}
                <div className={styles.info}>
                  <p className={styles.name}>{cat.name}</p>
                  {cat.description && <p className={styles.desc}>{cat.description}</p>}
                </div>
                <button type="button" onClick={() => toggleActive(cat)}>
                  <Badge tone={cat.active ? 'success' : 'neutral'}>{cat.active ? t('common.active') : t('common.inactive')}</Badge>
                </button>
                <div className={styles.actions}>
                  <button type="button" className={styles.iconBtn} onClick={() => { setEditing(cat); setModalOpen(true); }} aria-label="edit">
                    <EditIcon size={16} />
                  </button>
                  <button type="button" className={`${styles.iconBtn} ${styles.dangerIcon}`} onClick={() => setDeleteTarget(cat)} aria-label="delete">
                    <TrashIcon size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CategoryFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialValue={editing}
        saving={saving}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={t('common.delete')}
        message={t('admin.categories.deleteConfirm')}
        loading={deleting}
      />
    </div>
  );
}
