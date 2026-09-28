import { formatCurrency } from './formatCurrency';

const ORDER_TYPE_LABEL = { 'dine-in': 'داخل المطعم', pickup: 'استلام من المطعم', delivery: 'توصيل' };

export function buildWhatsAppMessage({ restaurantName, orderNumber, customerName, items, total, type, notes }) {
  const lines = [];
  lines.push(`*طلب جديد - ${restaurantName}*`);
  lines.push(`رقم الطلب: ${orderNumber}`);
  lines.push(`الاسم: ${customerName}`);
  lines.push(`النوع: ${ORDER_TYPE_LABEL[type] || type}`);
  lines.push('');
  lines.push('الأصناف:');
  items.forEach((item) => {
    lines.push(`• ${item.quantity}x ${item.name} — ${formatCurrency(item.price * item.quantity)}`);
  });
  lines.push('');
  lines.push(`الإجمالي: ${formatCurrency(total)}`);
  if (notes) {
    lines.push('');
    lines.push(`ملاحظات: ${notes}`);
  }
  return lines.join('\n');
}

export function buildWhatsAppLink(phone, message) {
  const digitsOnly = String(phone).replace(/[^\d]/g, '');
  return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(message)}`;
}
