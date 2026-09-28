import styles from './CategoryNav.module.css';

export default function CategoryNav({ items, onOpenItem }) {
  return (
    <nav className={`${styles.nav} hide-scrollbar`}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onOpenItem(item)}
          className={styles.chip}
        >
          {item.image ? (
            <img src={item.image} alt="" className={styles.chipImage} />
          ) : (
            <div className={styles.chipFallback}>{item.name?.[0]}</div>
          )}
          <span className={styles.chipLabel}>{item.name}</span>
        </button>
      ))}
    </nav>
  );
}
