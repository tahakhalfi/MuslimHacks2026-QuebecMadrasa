import { createGenerationJob } from "@/src/domain/ai-generation-job";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const job = createGenerationJob({
    id: crypto.randomUUID(),
    requestId: body.requestId ?? crypto.randomUUID(),
    parentId: body.parentId ?? "demo-parent",
    childId: body.childId ?? "demo-child",
    type: body.type ?? "lesson",
    requestText: body.requestText ?? "Créer une activité de révision",
    creditsReserved: 1,
  });
  return Response.json(job, { status: 201 });
}
