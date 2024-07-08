export function calculateNetPrice(grossPrice) {
  const vatRate = 0.23; // Przykładowa stawka VAT
  const netPrice = parseFloat(grossPrice.replace(",", ".")) / (1 + vatRate);
  return netPrice.toFixed(2);
}

export function curentDate() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
