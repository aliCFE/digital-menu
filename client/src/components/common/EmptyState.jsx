import styles from './EmptyState.module.css';

export default function EmptyState({ icon = '🍽️', title, action }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.icon}>{icon}</div>
      <p className={styles.title}>{title}</p>
      {action}
    </div>
  );
}
