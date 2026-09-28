import styles from './CategoryNav.module.css';

export default function CategoryNav({ categories, activeId }) {
  function handleClick(e, id) {
    e.preventDefault();
    const el = document.getElementById(`category-${id}`);
    if (el) {
      const offset = 96;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  return (
    <nav className={`${styles.nav} hide-scrollbar`}>
      {categories.map((cat) => (
        <a
          key={cat.id}
          href={`#category-${cat.id}`}
          onClick={(e) => handleClick(e, cat.id)}
          className={`${styles.chip} ${activeId === cat.id ? styles.chipActive : ''}`}
        >
          {cat.image ? (
            <img src={cat.image} alt="" className={styles.chipImage} />
          ) : (
            <div className={styles.chipFallback}>{cat.name?.[0]}</div>
          )}
          <span className={styles.chipLabel}>{cat.name}</span>
        </a>
      ))}
    </nav>
  );
}
