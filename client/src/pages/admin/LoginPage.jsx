import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import Button from '../../components/common/Button';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!authLoading && isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(username, password);
      navigate('/admin');
    } catch {
      setError(t('admin.login.error'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.screen}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.logo}>DM</div>
        <h1 className={styles.title}>{t('admin.login.title')}</h1>
        <p className={styles.subtitle}>{t('admin.login.subtitle')}</p>

        <label className={styles.field}>
          <span>{t('admin.login.username')}</span>
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoFocus required />
        </label>

        <label className={styles.field}>
          <span>{t('admin.login.password')}</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <Button type="submit" loading={submitting} className={styles.submitBtn}>
          {t('admin.login.submit')}
        </Button>

        <p className={styles.demoHint}>{t('admin.login.demoHint')}</p>
      </form>
    </div>
  );
}
