// Date helpers for the daily question and weekly prompt. Everything is keyed by a plain
// "YYYY-MM-DD" date in a chosen time zone, so every visitor sees the same item on the same day.

export const DEFAULT_TIMEZONE = "UTC";

export function isValidTimeZone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}

// The time zone the app uses to decide what "today" is. Set APP_TIMEZONE, e.g. "America/New_York".
export function getAppTimezone(): string {
  const configured = process.env.APP_TIMEZONE?.trim();
  return configured && isValidTimeZone(configured) ? configured : DEFAULT_TIMEZONE;
}

export function zonedDateKey(date: Date, timeZone: string = DEFAULT_TIMEZONE): string {
  const zone = isValidTimeZone(timeZone) ? timeZone : DEFAULT_TIMEZONE;
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

const DATE_KEY = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isDateKey(value: string): boolean {
  const match = DATE_KEY.exec(value);
  if (!match) return false;
  const [, y, m, d] = match.map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

function toUtcDate(dateKey: string): Date {
  if (!isDateKey(dateKey)) throw new Error(`Invalid date key: ${dateKey}`);
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

// Whole days since 1970-01-01 for a date key.
export function dayNumber(dateKey: string): number {
  return Math.round(toUtcDate(dateKey).getTime() / 86_400_000);
}

// The Monday of the week that contains the given date.
export function weekStartKey(dateKey: string): string {
  const date = toUtcDate(dateKey);
  const daysSinceMonday = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - daysSinceMonday);
  return date.toISOString().slice(0, 10);
}

export function weekNumber(dateKey: string): number {
  return Math.floor((dayNumber(weekStartKey(dateKey)) + 3) / 7);
}

export function hourInZone(date: Date, timeZone: string = DEFAULT_TIMEZONE): number {
  const zone = isValidTimeZone(timeZone) ? timeZone : DEFAULT_TIMEZONE;
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: zone, hour: "numeric", hourCycle: "h23" }).formatToParts(date);
  return Number(parts.find((p) => p.type === "hour")?.value ?? 0);
}

export function greetingFor(date: Date, timeZone: string = DEFAULT_TIMEZONE): string {
  const hour = hourInZone(date, timeZone);
  if (hour < 5) return "Still up";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function formatLongDate(date: Date, timeZone: string = DEFAULT_TIMEZONE): string {
  const zone = isValidTimeZone(timeZone) ? timeZone : DEFAULT_TIMEZONE;
  return new Intl.DateTimeFormat("en-US", { timeZone: zone, weekday: "long", month: "long", day: "numeric" }).format(date);
}
