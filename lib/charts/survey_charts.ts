import { SubmissionCount } from "../types/charts";
import { SubmissionRow } from "../types/db_schema";

export function getSubmissionCount(
  submissions: SubmissionRow[],
): SubmissionCount[] {
  const countsByDate = new Map<string, number>();

  submissions.forEach((s) => {
    const date = new Date(s.submitted_at).toISOString().slice(0, 10);
    const count = countsByDate.get(date) ?? 0;

    countsByDate.set(date, count + 1);
  });

  return Array.from(countsByDate.entries())
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([k, v]) => {
      return {
        count: v,
        date: k,
      } as SubmissionCount;
    });
}
