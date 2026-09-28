export async function sendTelegramMessage(botToken, chatId, text) {
  if (!botToken || !chatId) return;
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error('Telegram notification failed:', res.status, body);
    }
  } catch (err) {
    console.error('Telegram notification error:', err.message);
  }
}

export function buildOrderTelegramMessage(order, restaurantName) {
  const typeLabel = { 'dine-in': 'داخل المطعم', pickup: 'استلام من المطعم', delivery: 'توصيل' }[order.type] || order.type;
  const lines = [
    `🔔 <b>طلب جديد - ${restaurantName}</b>`,
    `رقم الطلب: ${order.orderNumber}`,
    `الاسم: ${order.customerName}`,
    `الهاتف: ${order.phone}`,
    `النوع: ${typeLabel}`,
    '',
    '<b>الأصناف:</b>',
    ...order.items.map((i) => `• ${i.quantity}x ${i.name} — ${i.price * i.quantity} د.ع`),
    '',
    `<b>الإجمالي: ${order.total} د.ع</b>`,
  ];
  if (order.notes) lines.push('', `ملاحظات: ${order.notes}`);
  return lines.join('\n');
}
