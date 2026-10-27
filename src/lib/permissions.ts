import type { Role } from "./mock-data";

export type NavKey =
  | "dashboard"
  | "patients"
  | "registration"
  | "odontogram"
  | "queue"
  | "schedules"
  | "ai"
  | "impact"
  | "inventory"
  | "batches"
  | "forecast"
  | "reports"
  | "audit"
  | "users"
  | "roles"
  | "resources"
  | "plans"
  | "backup";

const ALL: NavKey[] = [
  "dashboard",
  "patients",
  "registration",
  "odontogram",
  "queue",
  "schedules",
  "ai",
  "impact",
  "inventory",
  "batches",
  "forecast",
  "reports",
  "audit",
  "users",
  "roles",
  "resources",
  "plans",
  "backup",
];

export const ACCESS: Record<Exclude<Role, "patient">, NavKey[]> = {
  admin: ALL,
  dentist: [
    "dashboard",
    "patients",
    "odontogram",
    "queue",
    "schedules",
    "ai",
    "impact",
    "inventory",
    "forecast",
    "reports",
    "plans",
    "resources",
  ],
  receptionist: ["dashboard", "patients", "registration", "queue", "schedules", "ai", "impact"],
  inventory: ["dashboard", "inventory", "batches", "forecast", "ai", "reports"],
  management: ["dashboard", "schedules", "inventory", "forecast", "reports", "resources"],
};

export function can(role: Role | null, key: NavKey) {
  if (!role || role === "patient") return false;
  return ACCESS[role].includes(key);
}

export const canEditClinical = (r: Role | null) => r === "dentist" || r === "admin";
export const canSchedule = (r: Role | null) =>
  r === "dentist" || r === "receptionist" || r === "admin";
