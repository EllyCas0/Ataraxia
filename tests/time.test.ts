import { describe, expect, it } from "vitest";
import { dayNumber, getAppTimezone, isDateKey, isValidTimeZone, weekNumber, weekStartKey, zonedDateKey } from "@/lib/time";

describe("zonedDateKey", () => {
  it("returns the calendar date in the requested time zone", () => {
    // 02:30 UTC on Oct 18 is still the evening of Oct 17 in New York and already Oct 18 in Tokyo.
    const instant = new Date("2026-10-18T02:30:00Z");
    expect(zonedDateKey(instant, "UTC")).toBe("2026-10-18");
    expect(zonedDateKey(instant, "America/New_York")).toBe("2026-10-17");
    expect(zonedDateKey(instant, "Asia/Tokyo")).toBe("2026-10-18");
  });

  it("falls back to UTC for an invalid time zone instead of throwing", () => {
    expect(zonedDateKey(new Date("2026-10-18T12:00:00Z"), "Not/AZone")).toBe("2026-10-18");
  });
});

describe("date keys", () => {
  it("validates real dates only", () => {
    expect(isDateKey("2026-10-18")).toBe(true);
    expect(isDateKey("2026-02-29")).toBe(false);
    expect(isDateKey("2024-02-29")).toBe(true);
    expect(isDateKey("2026-13-01")).toBe(false);
    expect(isDateKey("10/18/2026")).toBe(false);
  });

  it("counts days consecutively, including across month and year boundaries", () => {
    expect(dayNumber("1970-01-01")).toBe(0);
    expect(dayNumber("2026-10-19") - dayNumber("2026-10-18")).toBe(1);
    expect(dayNumber("2027-01-01") - dayNumber("2026-12-31")).toBe(1);
    expect(() => dayNumber("nope")).toThrow();
  });

  it("finds the Monday that starts a week", () => {
    expect(weekStartKey("2026-10-18")).toBe("2026-10-12"); // Sunday -> previous Monday
    expect(weekStartKey("2026-10-12")).toBe("2026-10-12"); // Monday -> itself
    expect(weekStartKey("2026-10-14")).toBe("2026-10-12");
    expect(weekStartKey("2026-01-01")).toBe("2025-12-29");
  });

  it("gives every day in the same week the same week number, and the next week the next number", () => {
    const base = weekNumber("2026-10-12");
    for (const day of ["2026-10-13", "2026-10-16", "2026-10-18"]) expect(weekNumber(day)).toBe(base);
    expect(weekNumber("2026-10-19")).toBe(base + 1);
  });
});

describe("app time zone", () => {
  it("recognizes valid zones", () => {
    expect(isValidTimeZone("America/New_York")).toBe(true);
    expect(isValidTimeZone("Nope/Nowhere")).toBe(false);
  });

  it("reads APP_TIMEZONE and ignores bad values", () => {
    const original = process.env.APP_TIMEZONE;
    process.env.APP_TIMEZONE = "Europe/London";
    expect(getAppTimezone()).toBe("Europe/London");
    process.env.APP_TIMEZONE = "garbage";
    expect(getAppTimezone()).toBe("UTC");
    delete process.env.APP_TIMEZONE;
    expect(getAppTimezone()).toBe("UTC");
    if (original !== undefined) process.env.APP_TIMEZONE = original;
  });
});

import { formatLongDate, greetingFor, hourInZone } from "@/lib/time";

describe("greeting", () => {
  it("reads the hour in the given zone", () => {
    const instant = new Date("2026-10-18T02:30:00Z");
    expect(hourInZone(instant, "UTC")).toBe(2);
    expect(hourInZone(instant, "America/New_York")).toBe(22);
    expect(hourInZone(instant, "Asia/Tokyo")).toBe(11);
  });

  it("picks a greeting for the time of day", () => {
    const at = (iso: string) => greetingFor(new Date(iso), "UTC");
    expect(at("2026-10-18T03:00:00Z")).toBe("Still up");
    expect(at("2026-10-18T09:00:00Z")).toBe("Good morning");
    expect(at("2026-10-18T14:00:00Z")).toBe("Good afternoon");
    expect(at("2026-10-18T20:00:00Z")).toBe("Good evening");
    expect(at("2026-10-18T00:00:00Z")).toBe("Still up");
  });

  it("treats midnight as hour 0, not 24", () => {
    expect(hourInZone(new Date("2026-10-18T00:15:00Z"), "UTC")).toBe(0);
  });

  it("formats a friendly date in the given zone", () => {
    expect(formatLongDate(new Date("2026-10-18T02:30:00Z"), "America/New_York")).toBe("Saturday, October 17");
  });
});
