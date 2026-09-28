import ItemCard from './ItemCard';
import styles from './CategorySection.module.css';

export default function CategorySection({ category, items, onOpenItem }) {
  if (!items.length) return null;

  return (
    <section id={`category-${category.id}`} className={styles.section} style={{ scrollMarginTop: 96 }}>
      <h2 className={styles.title}>{category.name}</h2>
      <div className={styles.grid}>
        {items.map((item) => (
          <ItemCard key={item.id} item={item} onOpen={onOpenItem} />
        ))}
      </div>
    </section>
  );
}
