import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../context/LanguageContext';
import { SearchIcon, XIcon } from '../common/Icons';
import ItemCard from './ItemCard';
import EmptyState from '../common/EmptyState';
import styles from './SearchOverlay.module.css';

export default function SearchOverlay({ open, items, onClose, onOpenItem }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 60);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return items.filter((item) => {
      const haystack = [item.name, item.description].filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }, [items, query]);

  if (!open) return null;

  return createPortal(
    <div className={styles.overlay}>
      <div className={styles.searchBar}>
        <SearchIcon size={18} className={styles.searchIcon} />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('menu.searchPlaceholder')}
          className={styles.input}
        />
        <button type="button" onClick={onClose} className={styles.closeBtn} aria-label={t('common.close')}>
          <XIcon size={20} />
        </button>
      </div>

      <div className={styles.results}>
        {query.trim() && results.length === 0 && (
          <EmptyState icon="🔍" title={t('menu.noResults')} />
        )}
        {results.length > 0 && (
          <div className={styles.grid}>
            {results.map((item) => (
              <ItemCard key={item.id} item={item} onOpen={(it) => { onOpenItem(it); }} />
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
