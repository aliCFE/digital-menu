import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { buildWhatsAppLink, buildWhatsAppMessage } from '../../utils/whatsapp';
import { placeOrder } from '../../services/orderService';
import { XIcon, PlusIcon, MinusIcon, TrashIcon, CheckIcon } from '../common/Icons';
import CheckoutForm from './CheckoutForm';
import styles from './CartDrawer.module.css';

export default function CartDrawer({ restaurant }) {
  const { t } = useLanguage();
  const { items, setQuantity, removeItem, totalPrice, isCartOpen, closeCart, clear } = useCart();
  const toast = useToast();
  const [view, setView] = useState('cart');
  const [submitting, setSubmitting] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [form, setForm] = useState({ customerName: '', phone: '', type: 'pickup', notes: '' });

  if (!isCartOpen) return null;

  function handleClose() {
    closeCart();
    setTimeout(() => setView('cart'), 250);
  }

  async function handleSubmitOrder() {
    if (!form.customerName.trim() || !form.phone.trim()) {
      toast.error('الرجاء إدخال الاسم ورقم الهاتف');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        slug: restaurant.slug,
        customerName: form.customerName,
        phone: form.phone,
        type: form.type,
        notes: form.notes,
        items: items.map((i) => ({ itemId: i.itemId, name: i.name, price: i.price, quantity: i.quantity })),
      };
      const order = await placeOrder(payload);
      setLastOrder(order);

      const message = buildWhatsAppMessage({
        restaurantName: restaurant.name,
        orderNumber: order.orderNumber,
        customerName: form.customerName,
        items: payload.items,
        total: order.total,
        type: form.type,
        notes: form.notes,
      });
      if (restaurant.whatsapp) {
        window.open(buildWhatsAppLink(restaurant.whatsapp, message), '_blank', 'noopener');
      }
      clear();
      setView('success');
    } catch (err) {
      toast.error(err.message || 'Failed to place order.');
    } finally {
      setSubmitting(false);
    }
  }

  return createPortal(
    <div className={styles.backdrop} onMouseDown={handleClose}>
      <div className={styles.sheet} onMouseDown={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>{view === 'checkout' ? t('checkout.title') : t('cart.title')}</h3>
          <button type="button" onClick={handleClose} className={styles.closeBtn} aria-label={t('common.close')}>
            <XIcon size={18} />
          </button>
        </div>

        {view === 'success' && lastOrder ? (
          <div className={styles.success}>
            <div className={styles.successIcon}><CheckIcon size={28} /></div>
            <p className={styles.successTitle}>{t('checkout.orderSent')}</p>
            <p className={styles.successOrder}>{t('checkout.orderNumber')}: {lastOrder.orderNumber}</p>
            <button type="button" className={styles.primaryBtn} onClick={handleClose}>
              {t('common.close')}
            </button>
          </div>
        ) : view === 'checkout' ? (
          <>
            <CheckoutForm form={form} setForm={setForm} />
            <div className={styles.footer}>
              <div className={styles.totalRow}>
                <span>{t('cart.total')}</span>
                <span className={styles.totalValue}>{formatCurrency(totalPrice)}</span>
              </div>
              <button type="button" className={styles.primaryBtn} onClick={handleSubmitOrder} disabled={submitting}>
                {submitting ? t('common.loading') : t('checkout.sendWhatsApp')}
              </button>
              <button type="button" className={styles.secondaryBtn} onClick={() => setView('cart')}>
                {t('common.back')}
              </button>
            </div>
          </>
        ) : items.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>{t('cart.empty')}</p>
            <p className={styles.emptyHint}>{t('cart.emptyHint')}</p>
            <button type="button" className={styles.primaryBtn} onClick={handleClose}>
              {t('cart.browseMenu')}
            </button>
          </div>
        ) : (
          <>
            <div className={styles.list}>
              {items.map((item) => {
                return (
                  <div key={item.itemId} className={styles.row}>
                    {item.image && <img src={item.image} alt="" className={styles.rowImage} />}
                    <div className={styles.rowInfo}>
                      <p className={styles.rowName}>{item.name}</p>
                      <p className={styles.rowPrice}>{formatCurrency(item.price)}</p>
                    </div>
                    <div className={styles.rowActions}>
                      <div className={styles.stepper}>
                        <button type="button" onClick={() => setQuantity(item.itemId, item.quantity - 1)}><MinusIcon size={14} /></button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => setQuantity(item.itemId, item.quantity + 1)}><PlusIcon size={14} /></button>
                      </div>
                      <button type="button" className={styles.removeBtn} onClick={() => removeItem(item.itemId)} aria-label={t('cart.remove')}>
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={styles.footer}>
              <div className={styles.totalRow}>
                <span>{t('cart.subtotal')}</span>
                <span className={styles.totalValue}>{formatCurrency(totalPrice)}</span>
              </div>
              <button type="button" className={styles.primaryBtn} onClick={() => setView('checkout')}>
                {t('cart.checkout')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
