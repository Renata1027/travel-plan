export function computeCategoryTotal(items) {
  return items.reduce((sum, item) => sum + item.amount, 0);
}

export function computeGrandTotal(categories) {
  return categories.reduce((sum, category) => sum + computeCategoryTotal(category.items), 0);
}

export function formatCurrency(amount, currency = '¥') {
  const rounded = Math.round(amount);
  return `${currency}${rounded.toLocaleString('en-US')}`;
}
