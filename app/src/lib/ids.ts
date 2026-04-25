import { customAlphabet } from "nanoid";

// URL-safe, unguessable, readable. 16 chars = ~95 bits entropy.
const alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
export const reviewSlug = customAlphabet(alphabet, 16);
export const shortId = customAlphabet(alphabet, 10);

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}
