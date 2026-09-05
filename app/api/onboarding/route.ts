import { createChild, createFamily, requiredConsents } from "@/src/domain/family";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  try {
    const family = createFamily({
      id: crypto.randomUUID(),
      name: body.name ?? "",
      parentName: body.parentName ?? "",
      locale: body.locale === "en" ? "en" : "fr",
      jurisdiction: "quebec",
      schoolYear: body.schoolYear ?? "",
      consents: Array.isArray(body.consents) ? body.consents : [],
      requiredConsents,
    });

    const rawChildren = Array.isArray(body.children) ? body.children : [];
    const children = rawChildren.map((child: { displayName?: string; ageBand?: string; level?: string }) =>
      createChild({
        id: crypto.randomUUID(),
        familyId: family.id,
        displayName: child.displayName ?? "",
        ageBand: (child.ageBand as "5-8" | "9-12" | "13-15" | "16-17") ?? "5-8",
        level: child.level,
      }),
    );

    if (children.length === 0) {
      return Response.json({ error: "At least one child is required" }, { status: 400 });
    }

    return Response.json({ family, children }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid onboarding request";
    return Response.json({ error: message }, { status: 400 });
  }
}
