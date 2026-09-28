import styles from './Field.module.css';

export function Field({ label, hint, children }) {
  return (
    <label className={styles.field}>
      {label && <span className={styles.label}>{label}</span>}
      {children}
      {hint && <span className={styles.hint}>{hint}</span>}
    </label>
  );
}

export function FieldRow({ children }) {
  return <div className={styles.row}>{children}</div>;
}

export function ToggleField({ label, checked, onChange }) {
  return (
    <label className={styles.toggleRow}>
      <span>{label}</span>
      <span className={`${styles.switch} ${checked ? styles.switchOn : ''}`} onClick={() => onChange(!checked)}>
        <span className={styles.switchKnob} />
      </span>
    </label>
  );
}

export const inputClass = styles.input;
export const textareaClass = styles.textarea;
export const selectClass = styles.select;
