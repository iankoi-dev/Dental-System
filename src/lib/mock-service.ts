// Mock service layer — pure functions over mock data; swap for real API calls later.
import {
  AUDIT,
  BATCHES,
  FORECAST,
  ITEMS,
  PATIENTS,
  PROCEDURE_MATERIALS,
  QUEUE,
  SCHEDULES,
  type Batch,
  type Schedule,
} from "./mock-data";

export const getPatients = () => PATIENTS;
export const getPatientById = (id: string) => PATIENTS.find((p) => p.id === id);
export const getQueue = () => QUEUE;
export const getInventoryItems = () => ITEMS;
export const getInventoryBatches = () => BATCHES;
export const getAuditLogs = () => AUDIT;
export const itemName = (id: string) => ITEMS.find((i) => i.id === id)?.name ?? id;

export const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function uploadRegistrationForm(file: File | null) {
  await wait(400);
  return { fileName: file?.name ?? "registration-form-scan.jpg" };
}

export type OcrField = {
  key: string;
  label: string;
  value: string;
  confidence: number;
  required: boolean;
  type?: string;
};
export async function extractOCRFields(): Promise<OcrField[]> {
  await wait(300);
  return [
    {
      key: "name",
      label: "Full name",
      value: "Lorenzo B. Dela Cruz",
      confidence: 97,
      required: true,
    },
    {
      key: "dob",
      label: "Date of birth",
      value: "1992-02-1?",
      confidence: 54,
      required: true,
      type: "date",
    },
    { key: "sex", label: "Sex", value: "Male", confidence: 92, required: true },
    {
      key: "contact",
      label: "Contact number",
      value: "0917 555 01_8",
      confidence: 61,
      required: true,
    },
    {
      key: "email",
      label: "Email",
      value: "lorenzo.dc@example.com",
      confidence: 88,
      required: false,
    },
    {
      key: "address",
      label: "Address",
      value: "Brgy. Holy Spirit, Quezon City",
      confidence: 83,
      required: true,
    },
    {
      key: "medicalHistory",
      label: "Medical history",
      value: "Hypertension",
      confidence: 79,
      required: false,
    },
    { key: "allergies", label: "Allergies", value: "", confidence: 0, required: true },
    {
      key: "conditions",
      label: "Existing conditions",
      value: "None",
      confidence: 90,
      required: false,
    },
    {
      key: "emergencyContact",
      label: "Emergency contact",
      value: "Rina Dela Cruz — 0918 555 0177",
      confidence: 86,
      required: true,
    },
    {
      key: "visitReason",
      label: "Reason for visit",
      value: "Toothache, upper left",
      confidence: 74,
      required: false,
    },
  ];
}

// ---------- Change-impact ----------
export type CheckStatus = "pass" | "info" | "warning" | "conflict";
export interface ImpactCheck {
  label: string;
  status: CheckStatus;
  detail: string;
}
export interface ImpactResult {
  overall: "Safe" | "Info" | "Warning" | "Conflict";
  checks: ImpactCheck[];
  guidance?: string;
}

const CHECK_LABELS = [
  "Patient schedule conflicts",
  "Dentist availability",
  "Staff availability",
  "Dental-chair availability",
  "Treatment-room availability",
  "Equipment availability",
  "Treatment dependencies & intervals",
  "Materials & inventory availability",
  "Related follow-up schedules",
  "Clinic capacity",
];

function build(over: Record<number, [CheckStatus, string]>, guidance?: string): ImpactResult {
  const checks = CHECK_LABELS.map((label, i) => {
    const o = over[i];
    return {
      label,
      status: o ? o[0] : "pass",
      detail: o ? o[1] : "No issues found.",
    } as ImpactCheck;
  });
  const overall = checks.some((c) => c.status === "conflict")
    ? "Conflict"
    : checks.some((c) => c.status === "warning")
      ? "Warning"
      : checks.some((c) => c.status === "info")
        ? "Info"
        : "Safe";
  return { overall, checks, guidance };
}

export const IMPACT_SCENARIOS: {
  id: string;
  title: string;
  draft: Partial<Schedule>;
  result: ImpactResult;
}[] = [
  {
    id: "SC-1",
    title: "Prophylaxis — Daniel R. Flores",
    draft: {
      procedure: "Oral prophylaxis",
      chair: "Chair 4",
      dentist: "Dr. Miguel Nery",
      date: "2026-10-24",
      start: "09:00",
    },
    result: build({}),
  },
  {
    id: "SC-2",
    title: "Extraction with panoramic X-ray",
    draft: {
      procedure: "Tooth extraction",
      chair: "Chair 1",
      dentist: "Dr. Andrea Cruz",
      equipment: "Panoramic X-ray",
      date: "2026-10-27",
      start: "14:00",
    },
    result: build({
      5: ["info", "Panoramic X-ray calibration due Nov 1 — no impact on this date."],
      9: ["info", "Clinic at 70% capacity for this block."],
    }),
  },
  {
    id: "SC-3",
    title: "Root canal stage 2 — interval check",
    draft: {
      procedure: "Root canal (stage 2)",
      chair: "Chair 1",
      dentist: "Dr. Andrea Cruz",
      date: "2026-10-19",
      start: "15:00",
    },
    result: build(
      {
        6: ["warning", "Only 5 days since stage 1 (recommended ≥ 7 days)."],
        7: ["warning", "Gutta-percha points below reorder level (4 boxes)."],
      },
      "Consider moving to Oct 21 or later. Confirm with the treating dentist.",
    ),
  },
  {
    id: "SC-4",
    title: "Chair 3 during maintenance",
    draft: {
      procedure: "Composite restoration",
      chair: "Chair 3",
      dentist: "Dr. Lianne Santos",
      date: "2026-10-22",
      start: "09:00",
    },
    result: build(
      {
        1: ["warning", "Dr. Lianne Santos marked On leave until Oct 23."],
        3: ["conflict", "Chair 3 is under maintenance until Oct 22."],
      },
      "Select Chair 4 (available) or reschedule after Oct 22. AI will not change the schedule automatically.",
    ),
  },
  {
    id: "SC-5",
    title: "Double-booked patient",
    draft: {
      procedure: "Crown fitting",
      chair: "Chair 2",
      dentist: "Dr. Andrea Cruz",
      date: "2026-10-21",
      start: "10:00",
    },
    result: build(
      {
        0: ["conflict", "Maria L. Santos already has S-2101 at 10:00 on Oct 21."],
        1: ["conflict", "Dr. Andrea Cruz is booked for S-2101 at this time."],
        6: ["warning", "Crown fitting requires completed preparation (S-2107 pending)."],
      },
      "Choose another time slot or patient. Resolve both conflicts before confirming.",
    ),
  },
];

export async function runChangeImpactAnalysis(d: Partial<Schedule>): Promise<ImpactResult> {
  await wait(1400);
  if (d.chair === "Chair 3") return IMPACT_SCENARIOS[3].result;
  const clash = SCHEDULES.find(
    (s) =>
      s.id !== d.id &&
      s.status !== "Cancelled" &&
      s.date === d.date &&
      s.start === d.start &&
      (s.patientId === d.patientId || s.dentist === d.dentist || s.chair === d.chair),
  );
  if (clash)
    return build(
      {
        0: s0(clash, d),
        3:
          clash.chair === d.chair
            ? ["conflict", `${clash.chair} is booked for ${clash.id} at ${clash.start}.`]
            : (["pass", "No issues found."] as [CheckStatus, string]),
      },
      "Pick a different time or resource, then re-run the review.",
    );
  if (d.procedure === "Root canal (stage 2)" || d.procedure === "Crown fitting")
    return IMPACT_SCENARIOS[2].result;
  if (d.equipment === "Panoramic X-ray" || d.equipment === "Curing light")
    return build({
      5: ["info", `${d.equipment}: maintenance note on file — verify before the visit.`],
    });
  return build({});
}
function s0(clash: Schedule, d: Partial<Schedule>): [CheckStatus, string] {
  return clash.patientId === d.patientId
    ? ["conflict", `Patient already has ${clash.id} at this time.`]
    : clash.dentist === d.dentist
      ? ["conflict", `${clash.dentist} is booked for ${clash.id}.`]
      : ["pass", "No issues found."];
}

// ---------- FIFO ----------
export const DEMO_TODAY = "2026-10-28";
const INELIGIBLE = ["Expired", "Damaged", "Recalled", "Unavailable"];
const isExpired = (batch: Batch) => batch.expiry <= DEMO_TODAY;
const isEligible = (batch: Batch) =>
  !INELIGIBLE.includes(batch.status) && !isExpired(batch) && batch.remaining > 0;

export function fifoPlan(batches: Batch[], procedure: string) {
  const needs = PROCEDURE_MATERIALS[procedure] ?? [];
  return needs.map((n) => {
    const eligible = batches
      .filter((b) => b.itemId === n.itemId && isEligible(b))
      .sort((a, b) => a.received.localeCompare(b.received));
    const excluded = batches.filter(
      (b) => b.itemId === n.itemId && (INELIGIBLE.includes(b.status) || isExpired(b)),
    );
    let left = n.qty;
    const picks: { batchId: string; qty: number; before: number }[] = [];
    for (const b of eligible) {
      if (left <= 0) break;
      const take = Math.min(left, b.remaining);
      picks.push({ batchId: b.id, qty: take, before: b.remaining });
      left -= take;
    }
    return {
      itemId: n.itemId,
      qty: n.qty,
      picks,
      shortfall: left,
      excluded: excluded.map((e) => `${e.id} (${e.status})`),
    };
  });
}
export function confirmMaterialConsumption(
  batches: Batch[],
  plan: ReturnType<typeof fifoPlan>,
): Batch[] {
  const map = new Map(batches.map((b) => [b.id, { ...b }]));
  plan.forEach((p) =>
    p.picks.forEach((pk) => {
      const b = map.get(pk.batchId)!;
      b.remaining -= pk.qty;
    }),
  );
  return [...map.values()];
}
export const reserveMaterials = (batchId: string, qty: number) => ({ batchId, qty });

export const getInventoryForecast = (batches: Batch[]) =>
  FORECAST.map((f) => {
    const bs = batches.filter((b) => b.itemId === f.itemId && isEligible(b));
    const current = bs.reduce((a, b) => a + b.remaining, 0);
    const reserved = bs.reduce((a, b) => a + b.reserved, 0);
    return {
      ...f,
      item: itemName(f.itemId),
      current,
      reserved,
      remaining: current - reserved - f.demand,
    };
  });

// ---------- AI ----------
export interface AIReply {
  title: string;
  bullets: string[];
  source: string;
}
export async function askAssistant(prompt: string, role: string): Promise<AIReply> {
  await wait(900);
  const p = prompt.toLowerCase();
  if (/diagnos|prescri|what is wrong|should i treat/.test(p))
    return {
      title: "Outside assistant scope",
      bullets: [
        "I can't provide a diagnosis or prescribe treatment.",
        "I can summarize authorized records to help the dentist review them.",
      ],
      source: "Assistant policy",
    };
  if (role === "inventory" && /patient|record|tooth/.test(p))
    return {
      title: "Access restricted",
      bullets: [
        "Your role does not include access to patient clinical records.",
        "Try an inventory-related request instead.",
      ],
      source: "Role-based access policy",
    };
  if (/today|records/.test(p))
    return {
      title: "Patients seen or queued today (8)",
      bullets: QUEUE.map((q) => `#${q.no} ${q.patient} — ${q.status} (${q.dentist})`).slice(0, 6),
      source: "Based on today's walk-in queue and authorized patient records",
    };
  if (/follow-up|follow up|upcoming/.test(p) && !/draft/.test(p))
    return {
      title: "Upcoming follow-ups — Dr. Andrea Cruz",
      bullets: SCHEDULES.filter(
        (s) =>
          s.dentist === "Dr. Andrea Cruz" && s.status !== "Completed" && s.status !== "Cancelled",
      ).map((s) => `${s.date} ${s.start} · ${s.patient} · ${s.procedure} (${s.status})`),
      source: "Based on upcoming follow-up schedule",
    };
  if (/draft/.test(p))
    return {
      title: "Draft prepared (not saved)",
      bullets: [
        "Patient: Maria L. Santos (P-1001)",
        "Procedure: Crown preparation, tooth 26",
        "Suggested: Nov 4, 10:00 · Dr. Andrea Cruz · Chair 1",
        "Requires change-impact review and human confirmation.",
      ],
      source: "Based on treatment plan TP-01 and resource calendar",
    };
  if (/tooth|history|summar/.test(p))
    return {
      title: "Tooth 26 — summary (Maria L. Santos)",
      bullets: [
        "Oct 7: deep distal caries documented.",
        "Oct 14: root canal stage 1 completed; temporary filling.",
        "Stage 2 scheduled Oct 21 (S-2101).",
        "Penicillin allergy on file.",
      ],
      source: "Based on authorized patient record",
    };
  if (/chair/.test(p))
    return {
      title: "Dental chair availability this week",
      bullets: [
        "Chair 1 — available except Oct 22, 08:00–10:00 (maintenance)",
        "Chair 2 — available; heavily booked Oct 21",
        "Chair 3 — under maintenance until Oct 22",
        "Chair 4 — available all week",
      ],
      source: "Based on resource availability schedules",
    };
  if (/inventory|material|stock/.test(p))
    return {
      title: "Materials for Root canal (stage 2)",
      bullets: [
        "Lidocaine 2% ×2 — available (FIFO: B-0101, near expiry)",
        "Gutta-percha points ×1 — low stock (4 left)",
        "Sodium hypochlorite ×1 — available",
      ],
      source: "Based on inventory data and procedure-material mapping",
    };
  return {
    title: "Here's what I can help with",
    bullets: [
      "Finding authorized patient records",
      "Listing upcoming follow-ups",
      "Preparing schedule drafts for review",
      "Checking resources and inventory",
    ],
    source: "Assistant capabilities",
  };
}
