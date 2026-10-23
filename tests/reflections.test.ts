import { describe, expect, it } from "vitest";
import { MAX_REFLECTION_LENGTH, cleanResponse, newestFirst, parseReflections, reflectionFor, removeReflection, saveReflection } from "@/lib/reflections";
import type { UserReflection } from "@/lib/philosophy/types";

const ids = () => {
  let n = 0;
  return () => `id-${++n}`;
};
const at = (iso: string) => new Date(iso);

describe("saving reflections", () => {
  it("creates a reflection with matching created and updated times", () => {
    const list = saveReflection([], { tenetId: "t1", response: "  I think so.  " }, at("2026-01-01T10:00:00Z"), ids());
    expect(list).toEqual([{ id: "id-1", userId: "local", tenetId: "t1", response: "I think so.", createdAt: "2026-01-01T10:00:00.000Z", updatedAt: "2026-01-01T10:00:00.000Z" }]);
  });

  it("edits the same reflection, keeping its id and creation time", () => {
    const first = saveReflection([], { tenetId: "t1", response: "First" }, at("2026-01-01T10:00:00Z"), ids());
    const second = saveReflection(first, { tenetId: "t1", response: "Second" }, at("2026-01-02T10:00:00Z"), ids());
    expect(second).toHaveLength(1);
    expect(second[0]).toMatchObject({ id: "id-1", response: "Second", createdAt: "2026-01-01T10:00:00.000Z", updatedAt: "2026-01-02T10:00:00.000Z" });
  });

  it("does nothing for a blank response or an unchanged one", () => {
    const first = saveReflection([], { tenetId: "t1", response: "Same" }, at("2026-01-01T10:00:00Z"), ids());
    expect(saveReflection(first, { tenetId: "t1", response: "   " }, at("2026-01-02T10:00:00Z"), ids())).toBe(first);
    expect(saveReflection(first, { tenetId: "t1", response: "Same" }, at("2026-01-02T10:00:00Z"), ids())).toBe(first);
    expect(saveReflection([], { tenetId: "t1", response: "" }, at("2026-01-02T10:00:00Z"), ids())).toEqual([]);
  });

  it("keeps reflections for different tenets separate and limits the length", () => {
    let list = saveReflection([], { tenetId: "t1", response: "One" }, at("2026-01-01T10:00:00Z"), ids());
    list = saveReflection(list, { tenetId: "t2", response: "x".repeat(MAX_REFLECTION_LENGTH + 500) }, at("2026-01-01T11:00:00Z"), ids());
    expect(list).toHaveLength(2);
    expect(reflectionFor(list, "t2")!.response.length).toBe(MAX_REFLECTION_LENGTH);
    expect(cleanResponse("a\r\nb")).toBe("a\nb");
  });

  it("deletes a reflection and ignores deleting one that does not exist", () => {
    const list = saveReflection([], { tenetId: "t1", response: "One" }, at("2026-01-01T10:00:00Z"), ids());
    expect(removeReflection(list, "t1")).toEqual([]);
    expect(removeReflection(list, "nope")).toBe(list);
  });

  it("lists the most recently edited first", () => {
    let list = saveReflection([], { tenetId: "t1", response: "Old" }, at("2026-01-01T10:00:00Z"), ids());
    list = saveReflection(list, { tenetId: "t2", response: "New" }, at("2026-01-03T10:00:00Z"), ids());
    list = saveReflection(list, { tenetId: "t1", response: "Old, edited last" }, at("2026-01-05T10:00:00Z"), ids());
    expect(newestFirst(list).map((r) => r.tenetId)).toEqual(["t1", "t2"]);
  });
});

describe("reading stored reflections", () => {
  const good: UserReflection = { id: "a", userId: "local", tenetId: "t1", response: "Hello", createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z" };

  it("round-trips a saved list", () => {
    expect(parseReflections(JSON.stringify([good]))).toEqual([good]);
  });

  it("returns an empty list for missing, broken, or wrongly shaped storage", () => {
    for (const raw of [null, undefined, "", "not json", "{}", '"text"', "42"]) expect(parseReflections(raw)).toEqual([]);
  });

  it("drops malformed entries but keeps the good ones", () => {
    const raw = JSON.stringify([good, { id: "b" }, null, 7, { ...good, id: "c", tenetId: "" }, { ...good, id: "d", tenetId: "t2", response: 5 }]);
    expect(parseReflections(raw)).toEqual([good]);
  });

  it("keeps the newest when a tenet appears twice", () => {
    const newer = { ...good, id: "z", response: "Newer", updatedAt: "2026-02-01T00:00:00Z" };
    expect(parseReflections(JSON.stringify([newer, good]))).toEqual([newer]);
  });
});
