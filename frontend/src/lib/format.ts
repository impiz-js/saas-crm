export function formatDate(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium" }).format(date);
}

export function formatMoney(value?: number | null) {
  if (!value && value !== 0) return "—";
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0
  }).format(value);
}
