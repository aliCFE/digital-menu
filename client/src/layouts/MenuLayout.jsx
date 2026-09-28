import { themeToCssVars } from '../utils/color';
import styles from './MenuLayout.module.css';

export default function MenuLayout({ theme, children }) {
  return (
    <div className={styles.root} style={themeToCssVars(theme)}>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
