import { describe, it, expect } from "vitest";
import { slugify, reviewSlug, shortId } from "@/lib/ids";

describe("slugify", () => {
  it("lowercases", () => {
    expect(slugify("Northstar Studio")).toBe("northstar-studio");
  });
  it("strips punctuation", () => {
    expect(slugify("Acme Co. — Brand!!")).toBe("acme-co-brand");
  });
  it("trims edges", () => {
    expect(slugify("---hello---")).toBe("hello");
  });
  it("caps at 50 chars", () => {
    const long = "a".repeat(80);
    expect(slugify(long).length).toBe(50);
  });
});

describe("reviewSlug", () => {
  it("returns 16 chars", () => {
    expect(reviewSlug()).toHaveLength(16);
  });
  it("is unguessable across many calls", () => {
    const set = new Set<string>();
    for (let i = 0; i < 5000; i++) set.add(reviewSlug());
    expect(set.size).toBe(5000);
  });
});

describe("shortId", () => {
  it("returns 10 chars", () => {
    expect(shortId()).toHaveLength(10);
  });
});
