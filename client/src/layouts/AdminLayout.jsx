import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import styles from './AdminLayout.module.css';

const NAV_GROUPS = [
  { items: [{ key: 'dashboard', to: '/admin', end: true }] },
  {
    label: 'menu',
    items: [
      { key: 'categories', to: '/admin/categories' },
      { key: 'items', to: '/admin/items' },
    ],
  },
  { items: [{ key: 'orders', to: '/admin/orders' }] },
  {
    label: null,
    items: [
      { key: 'settings', to: '/admin/settings' },
      { key: 'qr', to: '/admin/qr' },
    ],
  },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  return (
    <div className={styles.shell} data-admin-root>
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>DM</div>
          <span>Digital Menu</span>
        </div>

        <nav className={styles.nav}>
          {NAV_GROUPS.map((group, gi) => (
            <div key={gi} className={styles.navGroup}>
              {group.label && <p className={styles.groupLabel}>{t(`admin.nav.${group.label}`)}</p>}
              {group.items.map((item) => (
                <NavLink
                  key={item.key}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                >
                  {t(`admin.nav.${item.key}`)}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <NavLink to="/admin/profile" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
            {t('admin.nav.profile')}
          </NavLink>
          <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
            {t('admin.nav.logout')}
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      <div className={styles.main}>
        <header className={styles.topbar}>
          <button type="button" className={styles.hamburger} onClick={() => setSidebarOpen((v) => !v)} aria-label="Menu">
            <span /><span /><span />
          </button>
          <div className={styles.topbarSpacer} />
          <span className={styles.adminName}>{admin?.name || admin?.username}</span>
        </header>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
