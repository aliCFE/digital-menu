import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import * as itemService from '../../services/itemService';
import * as categoryService from '../../services/categoryService';
import PageHeader from '../../components/admin/PageHeader';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Spinner from '../../components/common/Spinner';
import { SearchIcon, EditIcon, TrashIcon, CopyIcon, EyeIcon, EyeOffIcon } from '../../components/common/Icons';
import { formatCurrency } from '../../utils/formatCurrency';
import { inputClass, selectClass } from '../../components/admin/Field';
import ItemFormModal from './ItemFormModal';
import styles from './ItemsPage.module.css';

export default function ItemsPage() {
  const { t } = useLanguage();
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    const [itemsData, categoriesData] = await Promise.all([itemService.listItems(), categoryService.listCategories()]);
    setItems(itemsData);
    setCategories(categoriesData);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const categoryMap = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c])), [categories]);

  const filtered = items.filter((item) => {
    const matchesSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.categoryId === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  async function handleSubmit(form) {
    setSaving(true);
    try {
      if (editing) {
        await itemService.updateItem(editing.id, form);
        toast.success(t('admin.items.updated'));
      } else {
        await itemService.createItem(form);
        toast.success(t('admin.items.created'));
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
      await itemService.deleteItem(deleteTarget.id);
      toast.success(t('admin.items.deleted'));
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  }

  async function handleDuplicate(item) {
    await itemService.duplicateItem(item.id);
    toast.success(t('admin.items.duplicated'));
    load();
  }

  async function toggleAvailable(item) {
    await itemService.updateItem(item.id, { available: !item.available });
    load();
  }

  return (
    <div>
      <PageHeader
        title={t('admin.items.title')}
        action={<Button onClick={() => { setEditing(null); setModalOpen(true); }}>+ {t('admin.items.addNew')}</Button>}
      />

      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <SearchIcon size={16} />
          <input className={inputClass} placeholder={t('common.search')} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className={selectClass} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ maxWidth: 220 }}>
          <option value="all">{t('common.viewAll')}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className={styles.loading}><Spinner size={24} /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="🍔" title={t('admin.items.empty')} />
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t('admin.items.table.image')}</th>
                <th>{t('admin.items.table.item')}</th>
                <th>{t('admin.items.table.category')}</th>
                <th>{t('admin.items.table.price')}</th>
                <th>{t('admin.items.table.status')}</th>
                <th>{t('admin.items.table.featured')}</th>
                <th>{t('admin.items.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const category = categoryMap[item.categoryId];
                return (
                  <tr key={item.id}>
                    <td><img src={item.image} alt="" className={styles.thumb} /></td>
                    <td>
                      <p className={styles.itemName}>{item.name}</p>
                      <div className={styles.itemTags}>
                        {item.isNew && <Badge tone="success">{t('menu.new')}</Badge>}
                        {item.popular && <Badge tone="primary">{t('menu.popular')}</Badge>}
                        {item.discount > 0 && <Badge tone="danger">-{item.discount}%</Badge>}
                      </div>
                    </td>
                    <td className={styles.muted}>{category ? category.name : '—'}</td>
                    <td>
                      <p className={styles.price}>{formatCurrency(item.price)}</p>
                      {item.oldPrice && <p className={styles.oldPrice}>{formatCurrency(item.oldPrice)}</p>}
                    </td>
                    <td>
                      <button type="button" onClick={() => toggleAvailable(item)}>
                        <Badge tone={item.available ? 'success' : 'neutral'}>{item.available ? t('common.available') : t('common.unavailable')}</Badge>
                      </button>
                    </td>
                    <td>
                      <button type="button" className={styles.iconBtn} onClick={() => itemService.updateItem(item.id, { featured: !item.featured }).then(load)}>
                        {item.featured ? <EyeIcon size={17} /> : <EyeOffIcon size={17} />}
                      </button>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button type="button" className={styles.iconBtn} onClick={() => { setEditing(item); setModalOpen(true); }} aria-label="edit"><EditIcon size={16} /></button>
                        <button type="button" className={styles.iconBtn} onClick={() => handleDuplicate(item)} aria-label="duplicate"><CopyIcon size={16} /></button>
                        <button type="button" className={`${styles.iconBtn} ${styles.dangerIcon}`} onClick={() => setDeleteTarget(item)} aria-label="delete"><TrashIcon size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ItemFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialValue={editing}
        categories={categories}
        saving={saving}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={t('common.delete')}
        message={t('admin.items.deleteConfirm')}
        loading={deleting}
      />
    </div>
  );
}
