export type Locale = "fr" | "en";

export type StoredChild = { id: string; displayName: string; ageBand: string; level: string };
export type StoredFamily = { name: string; parentName: string; children: StoredChild[] };

export const localeStorageKey = "madrasa-locale";
export const familyStorageKey = "madrasa-family";

export function fallbackFamily(locale: Locale): StoredFamily {
  return {
    name: "Famille Ghorbel",
    parentName: "Amine",
    children: [
      { id: "adam", displayName: "Adam", ageBand: "9-12", level: locale === "fr" ? "5e année" : "Grade 5" },
      { id: "sara", displayName: "Sara", ageBand: "13-15", level: locale === "fr" ? "3e secondaire" : "Grade 9" },
    ],
  };
}

export function familyInitials(parentName: string, familyName: string): string {
  const familyWord = familyName
    .trim()
    .split(/\s+/)
    .filter((word) => !["famille", "family", "the"].includes(word.toLowerCase()))
    .pop();
  const initials = `${parentName.trim()[0] ?? ""}${(familyWord ?? familyName)[0] ?? ""}`.toUpperCase();
  return initials || "AG";
}

export function readStoredLocale(): Locale | null {
  const saved = window.localStorage.getItem(localeStorageKey);
  return saved === "fr" || saved === "en" ? saved : null;
}

export function writeStoredLocale(locale: Locale): void {
  window.localStorage.setItem(localeStorageKey, locale);
}

export function readStoredFamily(): StoredFamily | null {
  const raw = window.localStorage.getItem(familyStorageKey);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.family?.name && Array.isArray(parsed.children) && parsed.children.length > 0) {
      return { name: parsed.family.name, parentName: parsed.family.parentName || "", children: parsed.children };
    }
  } catch {
    // ignore malformed local data
  }
  return null;
}
