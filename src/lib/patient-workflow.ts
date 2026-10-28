import type { Patient } from "./mock-data";

export type PatientContactDraft = Pick<Patient, "contact" | "address">;

export function validatePatientContact(draft: PatientContactDraft) {
  return {
    contact:
      draft.contact.trim().length < 7 ? "Please enter a complete contact number." : undefined,
    address: draft.address.trim() ? undefined : "Address is required.",
  };
}

export function updatePatientContact(
  patients: Patient[],
  patientId: string,
  draft: PatientContactDraft,
) {
  const errors = validatePatientContact(draft);
  if (errors.contact || errors.address) return { patients, errors, updated: false } as const;

  let updated = false;
  const next = patients.map((patient) => {
    if (patient.id !== patientId) return patient;
    updated = true;
    return { ...patient, contact: draft.contact.trim(), address: draft.address.trim() };
  });

  return { patients: next, errors, updated } as const;
}
