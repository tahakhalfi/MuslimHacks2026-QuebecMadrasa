export type Locale = "fr" | "en";

export type Jurisdiction = "quebec";

export interface Family {
  id: string;
  name: string;
  parentName: string;
  locale: Locale;
  jurisdiction: Jurisdiction;
  schoolYear: string;
  consents: string[];
  createdAt: string;
}

export type AgeBand = "5-8" | "9-12" | "13-15" | "16-17";

export interface Child {
  id: string;
  familyId: string;
  displayName: string;
  ageBand: AgeBand;
  level: string;
  permissions: string[];
}

export const requiredConsents = ["guardian", "aiReview", "quebecLimit"];

const schoolYearPattern = /^\d{4}-\d{4}$/;

export function createFamily(input: {
  id: string;
  name: string;
  parentName: string;
  locale: Locale;
  jurisdiction: Jurisdiction;
  schoolYear: string;
  consents: string[];
  requiredConsents: string[];
  now?: string;
}): Family {
  if (!input.name.trim()) throw new Error("Family name is required");
  if (!input.parentName.trim()) throw new Error("Parent name is required");
  if (!schoolYearPattern.test(input.schoolYear)) {
    throw new Error("School year must look like 2026-2027");
  }
  const missing = input.requiredConsents.filter(
    (consentId) => !input.consents.includes(consentId),
  );
  if (missing.length > 0) {
    throw new Error(`Missing required consent: ${missing.join(", ")}`);
  }

  return {
    id: input.id,
    name: input.name.trim(),
    parentName: input.parentName.trim(),
    locale: input.locale,
    jurisdiction: input.jurisdiction,
    schoolYear: input.schoolYear,
    consents: input.consents,
    createdAt: input.now ?? new Date().toISOString(),
  };
}

export function createChild(input: {
  id: string;
  familyId: string;
  displayName: string;
  ageBand: AgeBand;
  level?: string;
}): Child {
  if (!input.displayName.trim()) throw new Error("Child name is required");
  if (!input.familyId) throw new Error("A family must exist before adding a child");

  return {
    id: input.id,
    familyId: input.familyId,
    displayName: input.displayName.trim(),
    ageBand: input.ageBand,
    level: input.level?.trim() ?? "",
    permissions: [],
  };
}
