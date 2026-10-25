import { describe, expect, it } from "vitest";
import { MAX_VALUE_NAME_LENGTH, addValue, moveValue, normalizeValueName, removeValue } from "@/lib/values";

describe("values ranking", () => {
  it("normalizes whitespace", () => {
    expect(normalizeValueName("  Deep   work \n")).toBe("Deep work");
  });

  it("adds a value to the end of the list", () => {
    expect(addValue(["Truth"], "Courage")).toEqual({ ok: true, values: ["Truth", "Courage"] });
  });

  it("rejects empty, over-long, and duplicate values (ignoring case)", () => {
    expect(addValue([], "   ")).toMatchObject({ ok: false });
    expect(addValue([], "x".repeat(MAX_VALUE_NAME_LENGTH + 1))).toMatchObject({ ok: false });
    expect(addValue(["Truth"], "truth")).toMatchObject({ ok: false, error: expect.stringContaining("already") });
    expect(addValue(["Truth"], "  TRUTH  ")).toMatchObject({ ok: false });
  });

  it("accepts custom values at the length limit", () => {
    const name = "y".repeat(MAX_VALUE_NAME_LENGTH);
    expect(addValue([], name)).toEqual({ ok: true, values: [name] });
  });

  it("allows at most five ranked values", () => {
    const five = ["A", "B", "C", "D", "E"];
    const result = addValue(five, "F");
    expect(result).toMatchObject({ ok: false, error: expect.stringContaining("up to 5") });
    expect(addValue(["A", "B", "C", "D"], "E")).toMatchObject({ ok: true });
  });

  it("removes a value, ignoring case", () => {
    expect(removeValue(["Truth", "Courage"], "truth")).toEqual(["Courage"]);
    expect(removeValue(["Truth"], "Missing")).toEqual(["Truth"]);
  });

  it("moves values up and down without mutating the original", () => {
    const list = ["A", "B", "C"];
    expect(moveValue(list, 1, -1)).toEqual(["B", "A", "C"]);
    expect(moveValue(list, 1, 1)).toEqual(["A", "C", "B"]);
    expect(list).toEqual(["A", "B", "C"]);
  });

  it("ignores moves past either end or from a bad index", () => {
    const list = ["A", "B"];
    expect(moveValue(list, 0, -1)).toBe(list);
    expect(moveValue(list, 1, 1)).toBe(list);
    expect(moveValue(list, 5, -1)).toBe(list);
    expect(moveValue(list, -1, 1)).toBe(list);
  });
});

import { MY_PHILOSOPHY_TABS, parseMyPhilosophyTab } from "@/lib/my-philosophy-tabs";

describe("My Philosophy tab parameter", () => {
  it("accepts each real tab", () => {
    for (const tab of MY_PHILOSOPHY_TABS) expect(parseMyPhilosophyTab(tab)).toBe(tab);
  });

  it("falls back to the journal for anything else", () => {
    for (const bad of [undefined, "", "nope", "JOURNAL", "../etc/passwd", ["values", "saved"][1] + "x"]) {
      expect(parseMyPhilosophyTab(bad as string | undefined)).toBe("journal");
    }
  });

  it("uses the first value when the parameter is repeated", () => {
    expect(parseMyPhilosophyTab(["values", "saved"])).toBe("values");
  });

  it("has three tabs, and the old saved tab now opens the journal tab that contains saved items", () => {
    expect([...MY_PHILOSOPHY_TABS]).toEqual(["journal", "values", "history"]);
    expect(parseMyPhilosophyTab("saved")).toBe("journal");
    expect(parseMyPhilosophyTab(["saved"])).toBe("journal");
  });
});
