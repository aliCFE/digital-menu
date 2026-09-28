export function formatCurrency(amount) {
  const value = Number(amount) || 0;
  return `${new Intl.NumberFormat('en-US').format(value)} د.ع`;
}
