import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import * as orderService from '../../services/orderService';
import PageHeader from '../../components/admin/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import { formatCurrency } from '../../utils/formatCurrency';
import { selectClass } from '../../components/admin/Field';
import styles from './OrdersPage.module.css';

const STATUSES = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
const STATUS_TONE = {
  pending: 'warning', confirmed: 'primary', preparing: 'primary',
  ready: 'success', completed: 'success', cancelled: 'danger',
};
const TYPE_LABEL = { 'dine-in': 'داخل المطعم', pickup: 'استلام', delivery: 'توصيل' };

export default function OrdersPage() {
  const { t } = useLanguage();
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const data = await orderService.listOrders();
    setOrders(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(order, status) {
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
    try {
      await orderService.updateOrderStatus(order.id, status);
      toast.success(t('admin.orders.updated'));
    } catch (err) {
      toast.error(err.message);
      load();
    }
  }

  return (
    <div>
      <PageHeader title={t('admin.orders.title')} />

      {loading ? (
        <div className={styles.loading}><Spinner size={24} /></div>
      ) : orders.length === 0 ? (
        <EmptyState icon="🧾" title={t('admin.orders.empty')} />
      ) : (
        <div className={styles.list}>
          {orders.map((order) => (
            <div key={order.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <p className={styles.orderNumber}>{order.orderNumber}</p>
                  <p className={styles.date}>{new Date(order.createdAt).toLocaleString('ar-IQ')}</p>
                </div>
                <Badge tone={STATUS_TONE[order.status]}>{t(`admin.orders.statuses.${order.status}`)}</Badge>
              </div>

              <div className={styles.cardBody}>
                <div>
                  <p className={styles.label}>{t('admin.orders.customer')}</p>
                  <p className={styles.value}>{order.customerName} · <span dir="ltr">{order.phone}</span></p>
                </div>
                <div>
                  <p className={styles.label}>{t('admin.orders.type')}</p>
                  <p className={styles.value}>{TYPE_LABEL[order.type] || order.type}</p>
                </div>
                <div>
                  <p className={styles.label}>{t('admin.orders.items')}</p>
                  <p className={styles.value}>{order.items.map((i) => `${i.quantity}× ${i.name}`).join('، ')}</p>
                </div>
                {order.notes && (
                  <div>
                    <p className={styles.label}>{t('checkout.notes')}</p>
                    <p className={styles.value}>{order.notes}</p>
                  </div>
                )}
              </div>

              <div className={styles.cardFooter}>
                <p className={styles.total}>{t('admin.orders.total')}: <span>{formatCurrency(order.total)}</span></p>
                <select
                  className={selectClass}
                  style={{ maxWidth: 180 }}
                  value={order.status}
                  onChange={(e) => updateStatus(order, e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{t(`admin.orders.statuses.${s}`)}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
