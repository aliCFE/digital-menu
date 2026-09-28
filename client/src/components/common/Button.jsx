import Spinner from './Spinner';
import styles from './Button.module.css';

export default function Button({ variant = 'primary', loading = false, disabled, children, className = '', ...rest }) {
  return (
    <button
      type="button"
      className={`${styles.btn} ${styles[variant]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Spinner size={16} /> : children}
    </button>
  );
}
