export interface ParentAiContext {
  parentId: string;
  childId: string;
  allowedSourceIds: string[];
}

export interface ParentAiTools {
  getChildLearningSnapshot(
    context: ParentAiContext,
  ): Promise<unknown>;
  getSkillEvidence(context: ParentAiContext, skillId: string): Promise<unknown>;
  getWeekPlan(context: ParentAiContext): Promise<unknown>;
  getQuebecRequirementStatus(context: ParentAiContext): Promise<unknown>;
  searchApprovedLessons(
    context: ParentAiContext,
    query: string,
  ): Promise<unknown>;
  createGenerationJob(input: {
    context: ParentAiContext;
    requestId: string;
    type: "lesson" | "exercises" | "weekly_report" | "explanation";
    requestText: string;
  }): Promise<{ jobId: string; status: "queued" }>;
  getGenerationJob(
    context: ParentAiContext,
    jobId: string,
  ): Promise<unknown>;
  approveGeneratedContent(
    context: ParentAiContext,
    jobId: string,
  ): Promise<{ status: "approved" }>;
  cancelGenerationJob(
    context: ParentAiContext,
    jobId: string,
  ): Promise<{ status: "cancelled" }>;
}

/**
 * Every implementation must enforce authorization server-side before using a tool.
 * The browser must never receive database credentials or unrestricted tool access.
 */
export function assertParentCanAccess(
  sessionParentId: string,
  context: ParentAiContext,
): void {
  if (sessionParentId !== context.parentId) {
    throw new Error("Forbidden family access");
  }
  if (!context.childId) throw new Error("A child must be selected");
}
