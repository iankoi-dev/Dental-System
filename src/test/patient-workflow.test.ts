import { describe, expect, it } from "vitest";

import { PATIENTS } from "@/lib/mock-data";
import { updatePatientContact, validatePatientContact } from "@/lib/patient-workflow";

describe("patient contact workflow", () => {
  it("rejects missing required values", () => {
    expect(validatePatientContact({ contact: "123", address: "" })).toEqual({
      contact: "Please enter a complete contact number.",
      address: "Address is required.",
    });
  });

  it("updates a known patient immutably with valid input", () => {
    const result = updatePatientContact(PATIENTS, "P-1001", {
      contact: " 0917 555 0999 ",
      address: "  New address  ",
    });

    expect(result.updated).toBe(true);
    expect(result.errors).toEqual({ contact: undefined, address: undefined });
    expect(result.patients.find((patient) => patient.id === "P-1001")).toMatchObject({
      contact: "0917 555 0999",
      address: "New address",
    });
    expect(PATIENTS.find((patient) => patient.id === "P-1001")).toMatchObject({
      contact: "0917 555 0142",
    });
  });

  it("does not apply invalid or unknown-patient edits", () => {
    const invalid = updatePatientContact(PATIENTS, "P-1001", { contact: "", address: "" });
    const missing = updatePatientContact(PATIENTS, "missing", {
      contact: "0917 555 0999",
      address: "New address",
    });

    expect(invalid.updated).toBe(false);
    expect(invalid.patients).toBe(PATIENTS);
    expect(missing.updated).toBe(false);
    expect(missing.patients).toEqual(PATIENTS);
  });
});
