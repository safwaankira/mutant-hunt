export function total(items) {
  let sum = 0;
  for (const item of items) {
    if (item.qty > 0) sum += item.price * item.qty;
  }
  return sum;
}
export function label(n) {
  return n === 1 ? "1 item" : `${n} items`;
}
