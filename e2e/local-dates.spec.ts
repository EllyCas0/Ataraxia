import { expect, test } from "@playwright/test";
import { open } from "./helpers";

for (const [timezoneId, journalDate, savedDate] of [
  ["America/Havana", "Nov 5, 2026", "Nov 5"],
  ["Asia/Tokyo", "Nov 6, 2026", "Nov 6"],
] as const) {
  test.describe(`personal dates in ${timezoneId}`, () => {
    test.use({ timezoneId });
    test("journal and saved dates follow the browser timezone", async ({ page }) => {
      await page.addInitScript(() => {
        const instant = "2026-11-06T02:30:00Z";
        localStorage.setItem("stoa.journal.v1", JSON.stringify([
          { id: "local-date-entry", title: "Late evening", body: "A reflection", createdAt: instant, updatedAt: instant },
        ]));
        localStorage.setItem("stoa.saved.v1", JSON.stringify([
          { id: "local-date-saved", type: "concept", title: "An idea", createdAt: instant },
        ]));
      });
      await open(page, "/my-philosophy?tab=journal");
      const entry = page.getByRole("listitem").filter({ has: page.getByRole("heading", { name: "Late evening" }) });
      await expect(entry.getByText(journalDate, { exact: true })).toBeVisible();
      await expect(page.getByText(`Saved ${savedDate}`, { exact: true })).toBeVisible();
    });
  });
}
