import styles from './StatCard.module.css';

export default function StatCard({ label, value, tone = 'neutral' }) {
  return (
    <div className={styles.card}>
      <p className={styles.label}>{label}</p>
      <p className={`${styles.value} ${styles[tone]}`}>{value}</p>
    </div>
  );
}
