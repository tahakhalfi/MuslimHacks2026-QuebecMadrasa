export type ActivityStatus = "planned" | "done" | "needs_review" | "validated";

export interface LearningActivity {
  id: string;
  childId: string | null;
  title: string;
  subjectKey: string;
  day: number;
  minutes: number;
  status: ActivityStatus;
  aiGenerated: boolean;
}

const dayCount = 5;

export function createActivity(input: {
  id: string;
  childId: string | null;
  title: string;
  subjectKey: string;
  day: number;
  minutes: number;
  aiGenerated?: boolean;
}): LearningActivity {
  if (!input.title.trim()) throw new Error("Activity title is required");
  if (input.day < 0 || input.day >= dayCount) throw new Error("Day is out of range");
  if (input.minutes <= 0) throw new Error("Duration must be positive");

  return {
    id: input.id,
    childId: input.childId,
    title: input.title.trim(),
    subjectKey: input.subjectKey,
    day: input.day,
    minutes: input.minutes,
    status: input.aiGenerated ? "needs_review" : "planned",
    aiGenerated: input.aiGenerated ?? false,
  };
}

export function moveActivity(activities: LearningActivity[], id: string, day: number): LearningActivity[] {
  if (day < 0 || day >= dayCount) throw new Error("Day is out of range");
  return activities.map((activity) => (activity.id === id ? { ...activity, day } : activity));
}

export function completeActivity(activities: LearningActivity[], id: string): LearningActivity[] {
  return activities.map((activity) => {
    if (activity.id !== id) return activity;
    if (activity.status !== "planned") throw new Error(`Activity ${id} cannot be completed from status ${activity.status}`);
    return { ...activity, status: "done" as const };
  });
}

export function validateActivity(activities: LearningActivity[], id: string): LearningActivity[] {
  return activities.map((activity) => {
    if (activity.id !== id) return activity;
    if (activity.status !== "needs_review") throw new Error(`Activity ${id} cannot be validated from status ${activity.status}`);
    return { ...activity, status: "validated" as const };
  });
}
