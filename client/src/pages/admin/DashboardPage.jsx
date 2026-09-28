import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getDashboardStats } from '../../services/restaurantService';
import PageHeader from '../../components/admin/PageHeader';
import StatCard from '../../components/admin/StatCard';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import { formatCurrency } from '../../utils/formatCurrency';
import styles from './DashboardPage.module.css';

const STATUS_TONE = {
  pending: 'warning', confirmed: 'primary', preparing: 'primary',
  ready: 'success', completed: 'success', cancelled: 'danger',
};

export default function DashboardPage() {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className={styles.loading}><Spinner size={26} /></div>;
  }
  if (!stats) return null;

  const maxStatusCount = Math.max(1, ...stats.ordersByStatus.map((s) => s.count));

  return (
    <div>
      <PageHeader title={t('admin.dashboard.title')} />

      <div className={styles.grid}>
        <StatCard label={t('admin.dashboard.totalCategories')} value={stats.totalCategories} />
        <StatCard label={t('admin.dashboard.totalItems')} value={stats.totalItems} />
        <StatCard label={t('admin.dashboard.availableItems')} value={stats.availableItems} tone="success" />
        <StatCard label={t('admin.dashboard.hiddenItems')} value={stats.hiddenItems} tone="warning" />
        <StatCard label={t('admin.dashboard.featuredItems')} value={stats.featuredItems} tone="primary" />
        <StatCard label={t('admin.dashboard.totalViews')} value={stats.totalViews} />
        <StatCard label={t('admin.dashboard.totalOrders')} value={stats.totalOrders} />
        <StatCard label={t('admin.dashboard.pendingOrders')} value={stats.pendingOrders} tone="warning" />
      </div>

      <div className={styles.panels}>
        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>{t('admin.dashboard.ordersByStatus')}</h3>
          <div className={styles.barList}>
            {stats.ordersByStatus.map((s) => (
              <div key={s.status} className={styles.barRow}>
                <span className={styles.barLabel}>{t(`admin.orders.statuses.${s.status}`)}</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${(s.count / maxStatusCount) * 100}%` }} />
                </div>
                <span className={styles.barValue}>{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>{t('admin.dashboard.recentOrders')}</h3>
          {stats.recentOrders.length === 0 ? (
            <EmptyState icon="🧾" title={t('admin.dashboard.noOrders')} />
          ) : (
            <div className={styles.orderList}>
              {stats.recentOrders.map((order) => (
                <div key={order.id} className={styles.orderRow}>
                  <div>
                    <p className={styles.orderNumber}>{order.orderNumber} · {order.customerName}</p>
                    <p className={styles.orderMeta}>{order.items.length} صنف · {formatCurrency(order.total)}</p>
                  </div>
                  <Badge tone={STATUS_TONE[order.status]}>{t(`admin.orders.statuses.${order.status}`)}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
