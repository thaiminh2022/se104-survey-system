import { SubmissionCount } from "../types/charts";
import { SubmissionRow } from "../types/db_schema";

export function getSubmissionCount(
  submissions: SubmissionRow[],
): SubmissionCount[] {
  const shits: Map<number, number> = new Map();
  submissions.forEach((s) => {
    const ms = new Date(s.created_at).getTime();

    if (!shits.get(ms)) {
      shits.set(ms, 1);
      return;
    }

    const inner = shits.get(ms)!;
    shits.set(ms, inner + 1);
  });

  return shits
    .entries()
    .map(([k, v]) => {
      return {
        count: v,
        date: new Date(k),
      } as SubmissionCount;
    })
    .toArray();
}
