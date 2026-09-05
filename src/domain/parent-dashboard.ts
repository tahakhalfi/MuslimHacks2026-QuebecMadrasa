export type TaskStatus = "pending" | "done";

export interface ParentTask {
  id: string;
  childId: string | null;
  status: TaskStatus;
  dueAt?: string;
}

export function markTaskDone(tasks: ParentTask[], taskId: string): ParentTask[] {
  return tasks.map((task) => (task.id === taskId ? { ...task, status: "done" as const } : task));
}

export function pendingCount(tasks: ParentTask[]): number {
  return tasks.filter((task) => task.status === "pending").length;
}

export function visibleForChild<T extends { childId: string | null }>(
  items: T[],
  childId: string | null,
): T[] {
  if (!childId) return items;
  return items.filter((item) => item.childId === null || item.childId === childId);
}

export interface SubjectProgress {
  key: string;
  done: boolean;
}

export function computeProgress(subjects: SubjectProgress[]): number {
  if (subjects.length === 0) return 0;
  return Math.round((subjects.filter((subject) => subject.done).length / subjects.length) * 100);
}
