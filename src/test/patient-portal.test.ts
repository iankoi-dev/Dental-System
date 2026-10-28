import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { getTeethFor, PATIENTS, SCHEDULES } from "@/lib/mock-data";
import { routeTree } from "@/routeTree.gen";

describe("Patient portal contract", () => {
  const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

  it.each([
    "/patient/dashboard",
    "/patient/records",
    "/patient/tooth-history",
    "/patient/schedules",
    "/patient/notifications",
    "/patient/instructions",
    "/patient/profile",
  ])("registers %s", (path) => {
    expect(router.matchRoutes(path).at(-1)?.routeId).not.toBe("/__root__");
  });

  it("keeps the portal fixture scoped to the signed-in patient", () => {
    const patient = PATIENTS.find((item) => item.id === "P-1001");
    expect(patient?.name).toBe("Maria L. Santos");
    expect(SCHEDULES.filter((item) => item.patientId === "P-1001").length).toBeGreaterThan(0);
    expect(SCHEDULES.filter((item) => item.patientId !== "P-1001")).not.toHaveLength(0);
  });

  it("exposes clinical history without allowing portal mutation", () => {
    const teeth = getTeethFor("P-1001");
    expect(teeth[26].condition).toBe("attention");
    expect(teeth[26].history.at(-1)?.type).toBe("Root canal (stage 1)");
    expect("setTeeth" in teeth[26]).toBe(false);
  });
});
