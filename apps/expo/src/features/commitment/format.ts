export function formatEuro(cents: number, currency = "EUR") {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

export function defaultDueAt(now = new Date()) {
  const due = new Date(now);
  due.setDate(due.getDate() + 1);
  due.setHours(7, 30, 0, 0);
  return due;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatDateRow(date: Date, now = new Date()) {
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const weekday = date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  if (isSameDay(date, tomorrow)) {
    return `Tomorrow, ${date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    })}`;
  }
  return weekday;
}

export function formatTimeRow(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDeadline(date: Date, now = new Date()) {
  return `${formatDateRow(date, now)} · ${formatTimeRow(date)}`;
}

export function withDatePreset(current: Date, daysFromToday: number) {
  const next = new Date();
  next.setDate(next.getDate() + daysFromToday);
  next.setHours(current.getHours(), current.getMinutes(), 0, 0);
  return next;
}

export function withTimePreset(current: Date, hours: number, minutes: number) {
  const next = new Date(current);
  next.setHours(hours, minutes, 0, 0);
  return next;
}
