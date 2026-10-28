import type { QueueStatus, Schedule } from "./mock-data";

export type ScheduleDraft = Partial<Schedule>;

export function validateScheduleDraft(draft: ScheduleDraft) {
  const errors: Record<string, string> = {};
  if (!draft.patientId) errors.patientId = "Please select the patient for this follow-up.";
  if (!draft.procedure) errors.procedure = "Please select the procedure or treatment.";
  if (!draft.tooth) errors.tooth = "Enter the affected tooth or site (e.g. 26 or Full mouth).";
  if (!draft.date) errors.date = "Please choose a date.";
  if (!draft.start) errors.start = "Please choose a start time.";
  if (!draft.duration || draft.duration < 10)
    errors.duration = "Duration must be at least 10 minutes.";
  return errors;
}

export function hasDuplicateActiveSchedule(
  schedules: Schedule[],
  draft: ScheduleDraft,
  editingId?: string,
) {
  return schedules.some(
    (schedule) =>
      schedule.id !== editingId &&
      schedule.patientId === draft.patientId &&
      schedule.date === draft.date &&
      schedule.start === draft.start &&
      !["Completed", "Cancelled"].includes(schedule.status),
  );
}

const transitions: Record<QueueStatus, QueueStatus[]> = {
  Waiting: ["Called", "Cancelled", "Rescheduled"],
  Called: ["In Service", "Cancelled", "Rescheduled"],
  "In Service": ["Completed", "Cancelled", "Rescheduled"],
  Completed: [],
  Cancelled: [],
  Rescheduled: [],
};

export function canTransitionQueue(from: QueueStatus, to: QueueStatus) {
  return transitions[from].includes(to);
}
