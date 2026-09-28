import styles from './Spinner.module.css';

export default function Spinner({ size = 22, className = '' }) {
  return (
    <span
      className={`${styles.spinner} ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label="loading"
    />
  );
}
