export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date(dateString));
}

export function formatShortDate(dateString: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date(dateString));
}

export function formatDimension(width: number, length: number): string {
  return `${width} × ${length} m`;
}

const READINESS_LABELS: Record<string, string> = {
  siap_huni: "Siap Huni",
  siap_kosong: "Siap Kosong",
  siap_huni_renovasi: "Siap Huni Renovasi",
};

export function formatReadiness(value: string): string {
  return READINESS_LABELS[value] ?? value;
}

const STATUS_LABELS: Record<string, string> = {
  in_stock: "In Stock",
  sold_out: "Sold Out",
};

export function formatStatus(value: string): string {
  return STATUS_LABELS[value] ?? value;
}
