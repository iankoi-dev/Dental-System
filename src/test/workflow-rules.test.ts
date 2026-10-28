import { describe, expect, it } from "vitest";

import { PATIENTS, QUEUE, SCHEDULES } from "@/lib/mock-data";
import { getPatientById } from "@/lib/mock-service";
import {
  canTransitionQueue,
  hasDuplicateActiveSchedule,
  validateScheduleDraft,
} from "@/lib/workflow-rules";

describe("patient records", () => {
  it("returns the requested patient and no stale record for an unknown id", () => {
    expect(getPatientById("P-1001")?.name).toBe("Maria L. Santos");
    expect(getPatientById("missing")).toBeUndefined();
    expect(PATIENTS.some((patient) => patient.id === "missing")).toBe(false);
  });
});

describe("queue transitions", () => {
  it.each([
    ["Waiting", "Called"],
    ["Called", "In Service"],
    ["In Service", "Completed"],
    ["Waiting", "Cancelled"],
    ["Called", "Rescheduled"],
  ] as const)("allows %s to %s", (from, to) => {
    expect(canTransitionQueue(from, to)).toBe(true);
  });

  it.each([
    ["Completed", "Called"],
    ["Cancelled", "In Service"],
    ["Rescheduled", "Completed"],
    ["Waiting", "Completed"],
  ] as const)("rejects %s to %s", (from, to) => {
    expect(canTransitionQueue(from, to)).toBe(false);
  });

  it("has queue records tied to known patients", () => {
    expect(QUEUE.every((entry) => getPatientById(entry.patientId))).toBe(true);
  });
});

describe("schedule validation", () => {
  it("reports every required field and invalid duration", () => {
    const errors = validateScheduleDraft({ duration: 5 });
    expect(errors).toEqual({
      patientId: "Please select the patient for this follow-up.",
      procedure: "Please select the procedure or treatment.",
      tooth: "Enter the affected tooth or site (e.g. 26 or Full mouth).",
      date: "Please choose a date.",
      start: "Please choose a start time.",
      duration: "Duration must be at least 10 minutes.",
    });
  });

  it("accepts a complete schedule draft", () => {
    expect(
      validateScheduleDraft({
        patientId: "P-1003",
        procedure: "Oral prophylaxis",
        tooth: "Full mouth",
        date: "2026-12-01",
        start: "10:00",
        duration: 40,
      }),
    ).toEqual({});
  });

  it("blocks duplicate active schedules but ignores completed and cancelled records", () => {
    const draft = { patientId: "P-1001", date: "2026-10-21", start: "10:00" };
    expect(hasDuplicateActiveSchedule(SCHEDULES, draft)).toBe(true);
    expect(hasDuplicateActiveSchedule(SCHEDULES, draft, "S-2101")).toBe(false);
    expect(
      hasDuplicateActiveSchedule(SCHEDULES, {
        patientId: "P-1005",
        date: "2026-10-14",
        start: "09:00",
      }),
    ).toBe(false);
  });
});
