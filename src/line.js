// ISO日付(YYYY-MM-DD) + 一言 を1行で返す
export function makeLine({ quote, now = new Date() }) {
  const y = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo", year: "numeric" }).format(now);
  const m = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo", month: "2-digit" }).format(now);
  const d = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo", day: "2-digit" }).format(now);
  const iso = `${y}-${m}-${d}`;
  return `- ${iso} — ${quote}`;
}
