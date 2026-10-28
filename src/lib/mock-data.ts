// Mock data layer for the Dentriq front-end prototype. Replace with real API later.

export type Role = "admin" | "dentist" | "receptionist" | "inventory" | "management" | "patient";

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Administrator",
  dentist: "Dentist",
  receptionist: "Receptionist / Staff",
  inventory: "Inventory Personnel",
  management: "Clinic Management",
  patient: "Registered Patient",
};

export const DEMO_USERS: Record<Role, { name: string; email: string }> = {
  admin: { name: "Carlo Dizon", email: "admin@cruznery.clinic" },
  dentist: { name: "Dr. Andrea Cruz", email: "a.cruz@cruznery.clinic" },
  receptionist: { name: "Joanna Reyes", email: "frontdesk@cruznery.clinic" },
  inventory: { name: "Paolo Lim", email: "inventory@cruznery.clinic" },
  management: { name: "Teresa Villanueva", email: "management@cruznery.clinic" },
  patient: { name: "Maria L. Santos", email: "maria.s@example.com" },
};

export type Tone = "success" | "info" | "warning" | "danger" | "neutral" | "primary";

export interface Patient {
  id: string;
  name: string;
  dob: string;
  age: number;
  sex: "Female" | "Male";
  contact: string;
  email: string;
  address: string;
  portal: "Active" | "None" | "Deactivated";
  lastVisit: string;
  alerts: string[];
  medicalHistory: string;
  allergies: string;
  conditions: string;
  emergencyContact: string;
}

export const PATIENTS: Patient[] = [
  {
    id: "P-1001",
    name: "Maria L. Santos",
    dob: "1990-04-12",
    age: 36,
    sex: "Female",
    contact: "0917 555 0142",
    email: "maria.s@example.com",
    address: "Brgy. San Isidro, Quezon City",
    portal: "Active",
    lastVisit: "2026-10-14",
    alerts: ["Penicillin allergy"],
    medicalHistory: "Mild hypertension, controlled",
    allergies: "Penicillin",
    conditions: "Hypertension",
    emergencyContact: "Jose Santos — 0918 555 0199",
  },
  {
    id: "P-1002",
    name: "Ramon D. Aquino",
    dob: "1978-09-02",
    age: 48,
    sex: "Male",
    contact: "0921 555 0178",
    email: "ramon.a@example.com",
    address: "Poblacion, Makati City",
    portal: "Active",
    lastVisit: "2026-10-16",
    alerts: ["Diabetic"],
    medicalHistory: "Type 2 diabetes",
    allergies: "None reported",
    conditions: "Diabetes",
    emergencyContact: "Lita Aquino — 0921 555 0110",
  },
  {
    id: "P-1003",
    name: "Angela P. Mendoza",
    dob: "2001-01-23",
    age: 25,
    sex: "Female",
    contact: "0995 555 0133",
    email: "angela.m@example.com",
    address: "Kapitolyo, Pasig City",
    portal: "None",
    lastVisit: "2026-10-19",
    alerts: [],
    medicalHistory: "None reported",
    allergies: "None reported",
    conditions: "None",
    emergencyContact: "Rosa Mendoza — 0995 555 0101",
  },
  {
    id: "P-1004",
    name: "Benjamin T. Garcia",
    dob: "1965-06-30",
    age: 61,
    sex: "Male",
    contact: "0908 555 0187",
    email: "ben.g@example.com",
    address: "Sta. Mesa, Manila",
    portal: "Active",
    lastVisit: "2026-10-09",
    alerts: ["Anticoagulant therapy"],
    medicalHistory: "Atrial fibrillation",
    allergies: "Latex",
    conditions: "Cardiac",
    emergencyContact: "Elena Garcia — 0908 555 0122",
  },
  {
    id: "P-1005",
    name: "Kristine J. Bautista",
    dob: "1995-11-08",
    age: 30,
    sex: "Female",
    contact: "0917 555 0164",
    email: "kristine.b@example.com",
    address: "Marikina Heights, Marikina",
    portal: "None",
    lastVisit: "2026-09-30",
    alerts: [],
    medicalHistory: "Asthma (mild)",
    allergies: "None reported",
    conditions: "Asthma",
    emergencyContact: "Noel Bautista — 0917 555 0155",
  },
  {
    id: "P-1006",
    name: "Daniel R. Flores",
    dob: "1988-03-17",
    age: 38,
    sex: "Male",
    contact: "0926 555 0119",
    email: "daniel.f@example.com",
    address: "Cubao, Quezon City",
    portal: "Active",
    lastVisit: "2026-10-12",
    alerts: [],
    medicalHistory: "None reported",
    allergies: "None reported",
    conditions: "None",
    emergencyContact: "Ana Flores — 0926 555 0177",
  },
  {
    id: "P-1007",
    name: "Sofia M. Ramos",
    dob: "2012-07-05",
    age: 14,
    sex: "Female",
    contact: "0939 555 0145",
    email: "guardian.ramos@example.com",
    address: "Bel-Air, Makati City",
    portal: "None",
    lastVisit: "2026-10-18",
    alerts: ["Minor — guardian consent"],
    medicalHistory: "None reported",
    allergies: "Ibuprofen",
    conditions: "None",
    emergencyContact: "Carmen Ramos — 0939 555 0100",
  },
  {
    id: "P-1008",
    name: "Victor E. Navarro",
    dob: "1972-12-21",
    age: 53,
    sex: "Male",
    contact: "0915 555 0190",
    email: "victor.n@example.com",
    address: "Ayala Alabang, Muntinlupa",
    portal: "Deactivated",
    lastVisit: "2026-08-22",
    alerts: ["Bisphosphonate use"],
    medicalHistory: "Osteoporosis",
    allergies: "None reported",
    conditions: "Osteoporosis",
    emergencyContact: "Grace Navarro — 0915 555 0133",
  },
  {
    id: "P-1009",
    name: "Patricia A. Castillo",
    dob: "1999-05-14",
    age: 27,
    sex: "Female",
    contact: "0977 555 0126",
    email: "patricia.c@example.com",
    address: "Project 4, Quezon City",
    portal: "Active",
    lastVisit: "2026-10-17",
    alerts: ["Pregnant (2nd trimester)"],
    medicalHistory: "Pregnancy",
    allergies: "None reported",
    conditions: "Pregnancy",
    emergencyContact: "Mark Castillo — 0977 555 0188",
  },
  {
    id: "P-1010",
    name: "Eduardo S. Villareal",
    dob: "1983-08-29",
    age: 43,
    sex: "Male",
    contact: "0919 555 0158",
    email: "eduardo.v@example.com",
    address: "Tandang Sora, Quezon City",
    portal: "None",
    lastVisit: "2026-10-05",
    alerts: [],
    medicalHistory: "None reported",
    allergies: "Sulfa drugs",
    conditions: "None",
    emergencyContact: "Lorna Villareal — 0919 555 0144",
  },
];

export const DENTISTS = ["Dr. Andrea Cruz", "Dr. Miguel Nery", "Dr. Lianne Santos"];
export const STAFF = [
  {
    id: "U-01",
    name: "Carlo Dizon",
    role: "admin" as Role,
    email: "admin@cruznery.clinic",
    status: "Active",
    lastLogin: "2026-10-19 08:02",
  },
  {
    id: "U-02",
    name: "Dr. Andrea Cruz",
    role: "dentist" as Role,
    email: "a.cruz@cruznery.clinic",
    status: "Active",
    lastLogin: "2026-10-19 08:15",
  },
  {
    id: "U-03",
    name: "Dr. Miguel Nery",
    role: "dentist" as Role,
    email: "m.nery@cruznery.clinic",
    status: "Active",
    lastLogin: "2026-10-19 08:40",
  },
  {
    id: "U-04",
    name: "Dr. Lianne Santos",
    role: "dentist" as Role,
    email: "l.santos@cruznery.clinic",
    status: "On leave",
    lastLogin: "2026-10-10 17:20",
  },
  {
    id: "U-05",
    name: "Joanna Reyes",
    role: "receptionist" as Role,
    email: "frontdesk@cruznery.clinic",
    status: "Active",
    lastLogin: "2026-10-19 07:55",
  },
  {
    id: "U-06",
    name: "Paolo Lim",
    role: "inventory" as Role,
    email: "inventory@cruznery.clinic",
    status: "Active",
    lastLogin: "2026-10-18 16:10",
  },
  {
    id: "U-07",
    name: "Teresa Villanueva",
    role: "management" as Role,
    email: "management@cruznery.clinic",
    status: "Active",
    lastLogin: "2026-10-17 10:30",
  },
  {
    id: "U-08",
    name: "Mark Dela Paz",
    role: "receptionist" as Role,
    email: "m.delapaz@cruznery.clinic",
    status: "Deactivated",
    lastLogin: "2026-07-01 12:00",
  },
];

export const CHAIRS = ["Chair 1", "Chair 2", "Chair 3", "Chair 4"];
export const ROOMS = ["Treatment Room A", "Treatment Room B", "Surgery Room"];
export const EQUIPMENT = [
  "Intraoral camera",
  "Panoramic X-ray",
  "Ultrasonic scaler",
  "Rotary endo motor",
  "Curing light",
];
export const PROCEDURES = [
  "Oral prophylaxis",
  "Composite restoration",
  "Root canal (stage 1)",
  "Root canal (stage 2)",
  "Tooth extraction",
  "Crown preparation",
  "Crown fitting",
  "Orthodontic adjustment",
];

// ---------- Teeth ----------
export type ToothCondition = "healthy" | "review" | "treated" | "attention" | "missing";
export const CONDITION_META: Record<ToothCondition, { label: string; tone: Tone }> = {
  healthy: { label: "Healthy", tone: "success" },
  review: { label: "For review", tone: "warning" },
  treated: { label: "Treated", tone: "info" },
  attention: { label: "Needs attention", tone: "danger" },
  missing: { label: "Missing / N.A.", tone: "neutral" },
};

const TOOTH_NAMES: Record<number, string> = {
  1: "Central incisor",
  2: "Lateral incisor",
  3: "Canine",
  4: "First premolar",
  5: "Second premolar",
  6: "First molar",
  7: "Second molar",
  8: "Third molar",
};
export function toothName(n: number) {
  const q = Math.floor(n / 10);
  const pos = ["", "Upper right", "Upper left", "Lower left", "Lower right"][q];
  return `${pos} ${TOOTH_NAMES[n % 10].toLowerCase()}`;
}
export const UPPER = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
export const LOWER = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

export interface ToothEvent {
  date: string;
  type: string;
  note: string;
  by: string;
}
export interface ToothRecord {
  number: number;
  condition: ToothCondition;
  diagnosis: string;
  notes: string;
  recommendation: string;
  plan: string;
  history: ToothEvent[];
}

const OVERRIDES: Record<string, Partial<Record<number, Partial<ToothRecord>>>> = {
  "P-1001": {
    16: {
      condition: "treated",
      diagnosis: "Restored occlusal caries",
      notes: "Composite restoration intact; no sensitivity reported.",
      recommendation: "Routine monitoring at next prophylaxis.",
      plan: "Completed",
      history: [
        {
          date: "2026-03-04",
          type: "Restoration",
          note: "Class I composite, shade A2",
          by: "Dr. Andrea Cruz",
        },
        { date: "2026-09-12", type: "Check-up", note: "Restoration stable", by: "Dr. Andrea Cruz" },
      ],
    },
    26: {
      condition: "attention",
      diagnosis: "Deep caries, pulpal involvement suspected",
      notes: "Patient reports lingering cold sensitivity. Periapical film taken.",
      recommendation: "Proceed with root canal stage 2 after 7-day interval.",
      plan: "Root canal — stage 2 of 3",
      history: [
        {
          date: "2026-10-07",
          type: "Examination",
          note: "Deep distal caries noted",
          by: "Dr. Andrea Cruz",
        },
        {
          date: "2026-10-14",
          type: "Root canal (stage 1)",
          note: "Access and canal cleaning; temporary filling",
          by: "Dr. Andrea Cruz",
        },
      ],
    },
    36: {
      condition: "review",
      diagnosis: "Early enamel lesion",
      notes: "White-spot lesion on buccal surface.",
      recommendation: "Fluoride varnish and re-evaluate in 3 months.",
      plan: "Preventive",
    },
    38: {
      condition: "missing",
      diagnosis: "Extracted",
      notes: "Third molar extracted 2019.",
      recommendation: "—",
      plan: "—",
    },
    48: {
      condition: "missing",
      diagnosis: "Congenitally absent",
      notes: "",
      recommendation: "—",
      plan: "—",
    },
    11: {
      condition: "treated",
      diagnosis: "Porcelain crown",
      notes: "Crown placed after trauma.",
      recommendation: "Monitor margins.",
      plan: "Completed",
    },
  },
};

export function getTeethFor(patientId: string): Record<number, ToothRecord> {
  const seed = parseInt(patientId.replace(/\D/g, ""), 10) || 1;
  const out: Record<number, ToothRecord> = {};
  [...UPPER, ...LOWER].forEach((n, i) => {
    const r = (n * 7 + seed * 13 + i) % 29;
    const condition: ToothCondition =
      r === 0
        ? "attention"
        : r === 3
          ? "review"
          : r === 5 || r === 11
            ? "treated"
            : r === 17
              ? "missing"
              : "healthy";
    out[n] = {
      number: n,
      condition,
      diagnosis: {
        healthy: "No findings",
        review: "Monitor — minor finding",
        treated: "Previously restored",
        attention: "Active lesion recorded",
        missing: "Not present",
      }[condition],
      notes:
        condition === "healthy"
          ? "No clinical notes recorded."
          : "Recorded during last examination.",
      recommendation:
        condition === "attention"
          ? "Schedule follow-up assessment."
          : condition === "review"
            ? "Re-evaluate at next visit."
            : "Routine care.",
      plan: condition === "attention" ? "Pending treatment plan" : "—",
      history:
        condition === "healthy"
          ? []
          : [
              {
                date: "2026-09-02",
                type: "Examination",
                note: "Finding documented",
                by: DENTISTS[seed % 3],
              },
            ],
      ...(OVERRIDES[patientId]?.[n] ?? {}),
    } as ToothRecord;
  });
  return out;
}

// ---------- Queue ----------
export type QueueStatus =
  "Waiting" | "Called" | "In Service" | "Completed" | "Cancelled" | "Rescheduled";
export interface QueueEntry {
  id: string;
  no: number;
  patientId: string;
  patient: string;
  arrival: string;
  dentist: string;
  status: QueueStatus;
  type: "Walk-in" | "Scheduled";
  reason?: string;
}
export const QUEUE: QueueEntry[] = [
  {
    id: "Q1",
    no: 1,
    patientId: "P-1003",
    patient: "Angela P. Mendoza",
    arrival: "08:12",
    dentist: "Dr. Andrea Cruz",
    status: "Completed",
    type: "Walk-in",
  },
  {
    id: "Q2",
    no: 2,
    patientId: "P-1007",
    patient: "Sofia M. Ramos",
    arrival: "08:40",
    dentist: "Dr. Miguel Nery",
    status: "In Service",
    type: "Walk-in",
  },
  {
    id: "Q3",
    no: 3,
    patientId: "P-1001",
    patient: "Maria L. Santos",
    arrival: "09:05",
    dentist: "Dr. Andrea Cruz",
    status: "In Service",
    type: "Scheduled",
  },
  {
    id: "Q4",
    no: 4,
    patientId: "P-1010",
    patient: "Eduardo S. Villareal",
    arrival: "09:18",
    dentist: "Dr. Andrea Cruz",
    status: "Called",
    type: "Walk-in",
  },
  {
    id: "Q5",
    no: 5,
    patientId: "P-1005",
    patient: "Kristine J. Bautista",
    arrival: "09:31",
    dentist: "Dr. Miguel Nery",
    status: "Waiting",
    type: "Walk-in",
  },
  {
    id: "Q6",
    no: 6,
    patientId: "P-1006",
    patient: "Daniel R. Flores",
    arrival: "09:44",
    dentist: "Dr. Andrea Cruz",
    status: "Waiting",
    type: "Scheduled",
  },
  {
    id: "Q7",
    no: 7,
    patientId: "P-1009",
    patient: "Patricia A. Castillo",
    arrival: "09:52",
    dentist: "Dr. Miguel Nery",
    status: "Waiting",
    type: "Walk-in",
  },
  {
    id: "Q8",
    no: 8,
    patientId: "P-1008",
    patient: "Victor E. Navarro",
    arrival: "08:30",
    dentist: "Dr. Miguel Nery",
    status: "Cancelled",
    type: "Walk-in",
    reason: "Patient left before being called",
  },
];

// ---------- Schedules ----------
export type ScheduleStatus =
  "Scheduled" | "Confirmed" | "Completed" | "Cancelled" | "Rescheduled" | "Needs Review";
export interface Schedule {
  id: string;
  patientId: string;
  patient: string;
  procedure: string;
  tooth: string;
  date: string;
  start: string;
  duration: number;
  dentist: string;
  staff?: string;
  chair: string;
  room: string;
  equipment: string;
  materials: string;
  instructions: string;
  notes: string;
  status: ScheduleStatus;
}
export const SCHEDULES: Schedule[] = [
  {
    id: "S-2101",
    patientId: "P-1001",
    patient: "Maria L. Santos",
    procedure: "Root canal (stage 2)",
    tooth: "26",
    date: "2026-10-21",
    start: "10:00",
    duration: 60,
    dentist: "Dr. Andrea Cruz",
    chair: "Chair 1",
    room: "Treatment Room A",
    equipment: "Rotary endo motor",
    materials: "Endo files, NaOCl, gutta-percha",
    instructions: "Eat a light meal before the visit. Continue prescribed medication.",
    notes: "7-day interval after stage 1",
    status: "Confirmed",
  },
  {
    id: "S-2102",
    patientId: "P-1002",
    patient: "Ramon D. Aquino",
    procedure: "Crown fitting",
    tooth: "46",
    date: "2026-10-21",
    start: "13:30",
    duration: 45,
    dentist: "Dr. Miguel Nery",
    chair: "Chair 2",
    room: "Treatment Room B",
    equipment: "Curing light",
    materials: "Resin cement",
    instructions: "Bring temporary crown if dislodged.",
    notes: "",
    status: "Scheduled",
  },
  {
    id: "S-2103",
    patientId: "P-1004",
    patient: "Benjamin T. Garcia",
    procedure: "Tooth extraction",
    tooth: "37",
    date: "2026-10-22",
    start: "09:00",
    duration: 45,
    dentist: "Dr. Andrea Cruz",
    chair: "Chair 1",
    room: "Surgery Room",
    equipment: "Panoramic X-ray",
    materials: "Lidocaine, sutures, gauze",
    instructions: "Physician clearance for anticoagulant required.",
    notes: "Awaiting INR result",
    status: "Needs Review",
  },
  {
    id: "S-2104",
    patientId: "P-1006",
    patient: "Daniel R. Flores",
    procedure: "Oral prophylaxis",
    tooth: "Full mouth",
    date: "2026-10-22",
    start: "11:00",
    duration: 40,
    dentist: "Dr. Lianne Santos",
    chair: "Chair 3",
    room: "Treatment Room A",
    equipment: "Ultrasonic scaler",
    materials: "Prophy paste, fluoride varnish",
    instructions: "None.",
    notes: "",
    status: "Scheduled",
  },
  {
    id: "S-2105",
    patientId: "P-1009",
    patient: "Patricia A. Castillo",
    procedure: "Composite restoration",
    tooth: "14",
    date: "2026-10-23",
    start: "14:00",
    duration: 45,
    dentist: "Dr. Miguel Nery",
    chair: "Chair 2",
    room: "Treatment Room B",
    equipment: "Curing light",
    materials: "Composite A2, bonding agent",
    instructions: "Inform staff of any pregnancy-related concerns.",
    notes: "Avoid radiographs",
    status: "Confirmed",
  },
  {
    id: "S-2106",
    patientId: "P-1003",
    patient: "Angela P. Mendoza",
    procedure: "Orthodontic adjustment",
    tooth: "Full arch",
    date: "2026-10-24",
    start: "10:30",
    duration: 30,
    dentist: "Dr. Miguel Nery",
    chair: "Chair 4",
    room: "Treatment Room B",
    equipment: "Intraoral camera",
    materials: "Elastic ligatures",
    instructions: "Brush thoroughly before visit.",
    notes: "",
    status: "Scheduled",
  },
  {
    id: "S-2107",
    patientId: "P-1001",
    patient: "Maria L. Santos",
    procedure: "Crown preparation",
    tooth: "26",
    date: "2026-11-04",
    start: "10:00",
    duration: 75,
    dentist: "Dr. Andrea Cruz",
    chair: "Chair 1",
    room: "Treatment Room A",
    equipment: "Intraoral camera",
    materials: "Impression material, temp crown",
    instructions: "Scheduled after root canal completion.",
    notes: "Depends on S-2101",
    status: "Scheduled",
  },
  {
    id: "S-2108",
    patientId: "P-1010",
    patient: "Eduardo S. Villareal",
    procedure: "Composite restoration",
    tooth: "36",
    date: "2026-10-20",
    start: "15:00",
    duration: 45,
    dentist: "Dr. Andrea Cruz",
    chair: "Chair 1",
    room: "Treatment Room A",
    equipment: "Curing light",
    materials: "Composite A3",
    instructions: "None.",
    notes: "",
    status: "Rescheduled",
  },
  {
    id: "S-2109",
    patientId: "P-1005",
    patient: "Kristine J. Bautista",
    procedure: "Oral prophylaxis",
    tooth: "Full mouth",
    date: "2026-10-14",
    start: "09:00",
    duration: 40,
    dentist: "Dr. Lianne Santos",
    chair: "Chair 3",
    room: "Treatment Room A",
    equipment: "Ultrasonic scaler",
    materials: "Prophy paste",
    instructions: "Bring inhaler.",
    notes: "",
    status: "Completed",
  },
  {
    id: "S-2110",
    patientId: "P-1008",
    patient: "Victor E. Navarro",
    procedure: "Tooth extraction",
    tooth: "45",
    date: "2026-10-27",
    start: "16:00",
    duration: 45,
    dentist: "Dr. Miguel Nery",
    chair: "Chair 2",
    room: "Surgery Room",
    equipment: "Panoramic X-ray",
    materials: "Lidocaine, sutures",
    instructions: "Medical clearance pending.",
    notes: "Bisphosphonate risk review",
    status: "Cancelled",
  },
];

// ---------- Inventory ----------
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  reorder: number;
}
export const ITEMS: InventoryItem[] = [
  {
    id: "I-01",
    name: "Lidocaine 2% cartridge",
    category: "Anesthetics",
    unit: "cartridge",
    reorder: 50,
  },
  {
    id: "I-02",
    name: "Composite resin A2",
    category: "Restoratives",
    unit: "syringe",
    reorder: 10,
  },
  { id: "I-03", name: "Composite resin A3", category: "Restoratives", unit: "syringe", reorder: 8 },
  { id: "I-04", name: "Bonding agent", category: "Restoratives", unit: "bottle", reorder: 4 },
  { id: "I-05", name: "Gutta-percha points", category: "Endodontics", unit: "box", reorder: 6 },
  { id: "I-06", name: "Endo files (K-type)", category: "Endodontics", unit: "pack", reorder: 5 },
  {
    id: "I-07",
    name: "Sodium hypochlorite 3%",
    category: "Endodontics",
    unit: "bottle",
    reorder: 3,
  },
  { id: "I-08", name: "Resin cement", category: "Prosthodontics", unit: "kit", reorder: 3 },
  { id: "I-09", name: "Alginate impression", category: "Prosthodontics", unit: "bag", reorder: 4 },
  { id: "I-10", name: "Absorbable sutures 4-0", category: "Surgical", unit: "pack", reorder: 10 },
  { id: "I-11", name: "Sterile gauze", category: "Surgical", unit: "pack", reorder: 20 },
  { id: "I-12", name: "Prophy paste", category: "Preventive", unit: "cup", reorder: 40 },
  { id: "I-13", name: "Fluoride varnish", category: "Preventive", unit: "dose", reorder: 30 },
  { id: "I-14", name: "Nitrile gloves (M)", category: "PPE", unit: "box", reorder: 15 },
  { id: "I-15", name: "Elastic ligatures", category: "Orthodontics", unit: "pack", reorder: 5 },
];

export type BatchStatus =
  | "Available"
  | "Reserved"
  | "Low Stock"
  | "Near Expiry"
  | "Expired"
  | "Damaged"
  | "Recalled"
  | "Unavailable";
export interface Batch {
  id: string;
  itemId: string;
  received: string;
  expiry: string;
  qty: number;
  remaining: number;
  status: BatchStatus;
  reserved: number;
}
export const BATCHES: Batch[] = [
  {
    id: "B-0101",
    itemId: "I-01",
    received: "2026-05-10",
    expiry: "2026-11-02",
    qty: 100,
    remaining: 18,
    status: "Near Expiry",
    reserved: 4,
  },
  {
    id: "B-0102",
    itemId: "I-01",
    received: "2026-08-15",
    expiry: "2027-08-01",
    qty: 100,
    remaining: 100,
    status: "Available",
    reserved: 0,
  },
  {
    id: "B-0103",
    itemId: "I-01",
    received: "2026-03-01",
    expiry: "2026-09-30",
    qty: 50,
    remaining: 6,
    status: "Expired",
    reserved: 0,
  },
  {
    id: "B-0201",
    itemId: "I-02",
    received: "2026-06-02",
    expiry: "2027-06-01",
    qty: 12,
    remaining: 5,
    status: "Low Stock",
    reserved: 2,
  },
  {
    id: "B-0202",
    itemId: "I-02",
    received: "2026-09-20",
    expiry: "2027-09-15",
    qty: 10,
    remaining: 10,
    status: "Available",
    reserved: 0,
  },
  {
    id: "B-0301",
    itemId: "I-03",
    received: "2026-07-11",
    expiry: "2027-07-01",
    qty: 8,
    remaining: 6,
    status: "Available",
    reserved: 1,
  },
  {
    id: "B-0401",
    itemId: "I-04",
    received: "2026-04-18",
    expiry: "2026-11-15",
    qty: 6,
    remaining: 2,
    status: "Near Expiry",
    reserved: 1,
  },
  {
    id: "B-0501",
    itemId: "I-05",
    received: "2026-07-01",
    expiry: "2028-01-01",
    qty: 10,
    remaining: 4,
    status: "Low Stock",
    reserved: 1,
  },
  {
    id: "B-0601",
    itemId: "I-06",
    received: "2026-06-10",
    expiry: "2029-06-01",
    qty: 8,
    remaining: 3,
    status: "Reserved",
    reserved: 2,
  },
  {
    id: "B-0602",
    itemId: "I-06",
    received: "2026-09-05",
    expiry: "2029-09-01",
    qty: 6,
    remaining: 6,
    status: "Available",
    reserved: 0,
  },
  {
    id: "B-0701",
    itemId: "I-07",
    received: "2026-08-01",
    expiry: "2027-02-01",
    qty: 6,
    remaining: 4,
    status: "Available",
    reserved: 1,
  },
  {
    id: "B-0801",
    itemId: "I-08",
    received: "2026-05-22",
    expiry: "2027-05-01",
    qty: 4,
    remaining: 2,
    status: "Low Stock",
    reserved: 1,
  },
  {
    id: "B-0901",
    itemId: "I-09",
    received: "2026-06-30",
    expiry: "2026-10-28",
    qty: 6,
    remaining: 3,
    status: "Near Expiry",
    reserved: 0,
  },
  {
    id: "B-1001",
    itemId: "I-10",
    received: "2026-07-15",
    expiry: "2028-07-01",
    qty: 20,
    remaining: 14,
    status: "Available",
    reserved: 2,
  },
  {
    id: "B-1002",
    itemId: "I-10",
    received: "2026-04-01",
    expiry: "2028-04-01",
    qty: 10,
    remaining: 4,
    status: "Damaged",
    reserved: 0,
  },
  {
    id: "B-1101",
    itemId: "I-11",
    received: "2026-09-01",
    expiry: "2029-09-01",
    qty: 50,
    remaining: 41,
    status: "Available",
    reserved: 4,
  },
  {
    id: "B-1201",
    itemId: "I-12",
    received: "2026-08-12",
    expiry: "2027-08-01",
    qty: 60,
    remaining: 33,
    status: "Low Stock",
    reserved: 2,
  },
  {
    id: "B-1301",
    itemId: "I-13",
    received: "2026-07-20",
    expiry: "2027-01-10",
    qty: 40,
    remaining: 26,
    status: "Available",
    reserved: 0,
  },
  {
    id: "B-1401",
    itemId: "I-14",
    received: "2026-09-10",
    expiry: "2028-09-01",
    qty: 30,
    remaining: 22,
    status: "Available",
    reserved: 0,
  },
  {
    id: "B-1402",
    itemId: "I-14",
    received: "2026-06-01",
    expiry: "2028-06-01",
    qty: 20,
    remaining: 0,
    status: "Recalled",
    reserved: 0,
  },
  {
    id: "B-1501",
    itemId: "I-15",
    received: "2026-08-08",
    expiry: "2028-08-01",
    qty: 10,
    remaining: 7,
    status: "Available",
    reserved: 1,
  },
];

export const PROCEDURE_MATERIALS: Record<string, { itemId: string; qty: number }[]> = {
  "Oral prophylaxis": [
    { itemId: "I-12", qty: 1 },
    { itemId: "I-13", qty: 1 },
    { itemId: "I-14", qty: 1 },
  ],
  "Composite restoration": [
    { itemId: "I-01", qty: 1 },
    { itemId: "I-02", qty: 1 },
    { itemId: "I-04", qty: 1 },
  ],
  "Root canal (stage 1)": [
    { itemId: "I-01", qty: 2 },
    { itemId: "I-06", qty: 1 },
    { itemId: "I-07", qty: 1 },
  ],
  "Root canal (stage 2)": [
    { itemId: "I-01", qty: 2 },
    { itemId: "I-05", qty: 1 },
    { itemId: "I-07", qty: 1 },
  ],
  "Tooth extraction": [
    { itemId: "I-01", qty: 2 },
    { itemId: "I-10", qty: 1 },
    { itemId: "I-11", qty: 2 },
  ],
  "Crown preparation": [
    { itemId: "I-01", qty: 1 },
    { itemId: "I-09", qty: 1 },
  ],
  "Crown fitting": [{ itemId: "I-08", qty: 1 }],
  "Orthodontic adjustment": [{ itemId: "I-15", qty: 1 }],
};

export const MOVEMENTS = [
  {
    id: "M-501",
    date: "2026-10-19 09:40",
    item: "Lidocaine 2% cartridge",
    batch: "B-0101",
    type: "Consumption",
    qty: -2,
    by: "Dr. Andrea Cruz",
  },
  {
    id: "M-500",
    date: "2026-10-18 15:10",
    item: "Endo files (K-type)",
    batch: "B-0601",
    type: "Reservation",
    qty: -2,
    by: "Paolo Lim",
  },
  {
    id: "M-499",
    date: "2026-10-18 11:00",
    item: "Nitrile gloves (M)",
    batch: "B-1402",
    type: "Recall",
    qty: -20,
    by: "Paolo Lim",
  },
  {
    id: "M-498",
    date: "2026-10-17 14:25",
    item: "Composite resin A2",
    batch: "B-0202",
    type: "Receipt",
    qty: 10,
    by: "Paolo Lim",
  },
  {
    id: "M-497",
    date: "2026-10-16 10:05",
    item: "Absorbable sutures 4-0",
    batch: "B-1002",
    type: "Damaged",
    qty: -4,
    by: "Paolo Lim",
  },
  {
    id: "M-496",
    date: "2026-10-15 16:40",
    item: "Prophy paste",
    batch: "B-1201",
    type: "Consumption",
    qty: -3,
    by: "Dr. Lianne Santos",
  },
];

export const FORECAST = [
  {
    itemId: "I-01",
    demand: 34,
    risk: "High",
    action: "Review reorder; near-expiry batch B-0101 should be used first.",
  },
  {
    itemId: "I-02",
    demand: 9,
    risk: "Moderate",
    action: "Monitor usage; reorder level may be reached within 2 weeks.",
  },
  {
    itemId: "I-05",
    demand: 5,
    risk: "Critical",
    action: "Projected shortage before S-2107. Review purchase request.",
  },
  {
    itemId: "I-08",
    demand: 3,
    risk: "High",
    action: "Only 2 kits remaining; crown fittings scheduled this week.",
  },
  {
    itemId: "I-12",
    demand: 18,
    risk: "Moderate",
    action: "Reorder level reached; review quantity for next month.",
  },
  { itemId: "I-09", demand: 2, risk: "Low", action: "Use remaining bag before 2026-10-28 expiry." },
] as const;

export const DEMAND_TREND = [
  { week: "W42", demand: 42, stock: 260 },
  { week: "W43", demand: 55, stock: 220 },
  { week: "W44", demand: 48, stock: 180 },
  { week: "W45", demand: 61, stock: 132 },
  { week: "W46", demand: 58, stock: 88 },
  { week: "W47", demand: 64, stock: 41 },
];
export const FLOW_TREND = [
  { day: "Mon", walkIns: 14, followUps: 6 },
  { day: "Tue", walkIns: 11, followUps: 8 },
  { day: "Wed", walkIns: 16, followUps: 5 },
  { day: "Thu", walkIns: 12, followUps: 9 },
  { day: "Fri", walkIns: 18, followUps: 7 },
  { day: "Sat", walkIns: 21, followUps: 4 },
];

// ---------- Notifications ----------
export const NOTIFICATIONS = [
  {
    id: "N1",
    tone: "info" as Tone,
    title: "Follow-up tomorrow",
    body: "Maria L. Santos — Root canal (stage 2), 10:00 with Dr. Andrea Cruz.",
    time: "10 min ago",
  },
  {
    id: "N2",
    tone: "warning" as Tone,
    title: "Low stock: Gutta-percha points",
    body: "4 boxes remaining (reorder level 6).",
    time: "35 min ago",
  },
  {
    id: "N3",
    tone: "danger" as Tone,
    title: "Expired batch B-0103",
    body: "Lidocaine 2% batch excluded from FIFO deductions.",
    time: "1 hr ago",
  },
  {
    id: "N4",
    tone: "warning" as Tone,
    title: "OCR review awaiting verification",
    body: "2 registration forms need receptionist review.",
    time: "2 hr ago",
  },
  {
    id: "N5",
    tone: "danger" as Tone,
    title: "Schedule conflict detected",
    body: "S-2103 overlaps with Chair 1 maintenance window.",
    time: "Yesterday",
  },
  {
    id: "N6",
    tone: "success" as Tone,
    title: "Nightly backup completed",
    body: "Backup BK-0419 verified successfully.",
    time: "Today 02:00",
  },
];

export const PATIENT_NOTIFICATIONS = [
  {
    id: "PN1",
    tone: "info" as Tone,
    title: "Reminder: follow-up on Oct 21",
    body: "Root canal (stage 2) at 10:00 AM with Dr. Andrea Cruz.",
    time: "Today",
  },
  {
    id: "PN2",
    tone: "primary" as Tone,
    title: "Aftercare instructions added",
    body: "Avoid chewing on the upper left side until your next visit.",
    time: "Oct 14",
  },
  {
    id: "PN3",
    tone: "neutral" as Tone,
    title: "Clinic announcement",
    body: "The clinic will be closed on Nov 1 (All Saints' Day).",
    time: "Oct 12",
  },
  {
    id: "PN4",
    tone: "info" as Tone,
    title: "Schedule updated by clinic",
    body: "Your crown preparation is set for Nov 4 at 10:00 AM.",
    time: "Oct 10",
  },
  {
    id: "PN5",
    tone: "success" as Tone,
    title: "Record updated",
    body: "Your dentist added notes for tooth 26.",
    time: "Oct 14",
  },
];

// ---------- Audit ----------
export const AUDIT = [
  {
    id: "A-9012",
    ts: "2026-10-19 09:41",
    user: "Dr. Andrea Cruz",
    role: "Dentist",
    action: "FIFO deduction",
    module: "Inventory",
    record: "B-0101",
    outcome: "Success",
    details: "2 cartridges deducted for Q3 procedure.",
  },
  {
    id: "A-9011",
    ts: "2026-10-19 09:20",
    user: "Joanna Reyes",
    role: "Receptionist",
    action: "Queue adjustment",
    module: "Queue",
    record: "Q6",
    outcome: "Success",
    details: "Scheduled overlap used for walk-in Q4. Reason: earlier arrival.",
  },
  {
    id: "A-9010",
    ts: "2026-10-19 09:02",
    user: "Joanna Reyes",
    role: "Receptionist",
    action: "OCR verification",
    module: "Registration",
    record: "P-1003",
    outcome: "Success",
    details: "3 low-confidence fields corrected before save.",
  },
  {
    id: "A-9009",
    ts: "2026-10-19 08:15",
    user: "Dr. Andrea Cruz",
    role: "Dentist",
    action: "Login + MFA",
    module: "Auth",
    record: "U-02",
    outcome: "Success",
    details: "MFA code verified.",
  },
  {
    id: "A-9008",
    ts: "2026-10-19 08:03",
    user: "unknown",
    role: "—",
    action: "Login attempt",
    module: "Auth",
    record: "frontdesk@…",
    outcome: "Failed",
    details: "Invalid MFA code (2 attempts).",
  },
  {
    id: "A-9007",
    ts: "2026-10-18 16:20",
    user: "Dr. Andrea Cruz",
    role: "Dentist",
    action: "Tooth record update",
    module: "Odontogram",
    record: "P-1001 / 26",
    outcome: "Success",
    details: "Clinical note added after root canal stage 1.",
  },
  {
    id: "A-9006",
    ts: "2026-10-18 15:12",
    user: "Dr. Miguel Nery",
    role: "Dentist",
    action: "Schedule created",
    module: "Schedules",
    record: "S-2106",
    outcome: "Success",
    details: "Change-impact review: Safe.",
  },
  {
    id: "A-9005",
    ts: "2026-10-18 14:00",
    user: "Dr. Miguel Nery",
    role: "Dentist",
    action: "Schedule cancelled",
    module: "Schedules",
    record: "S-2110",
    outcome: "Success",
    details: "Reason: medical clearance pending.",
  },
  {
    id: "A-9004",
    ts: "2026-10-18 11:00",
    user: "Paolo Lim",
    role: "Inventory",
    action: "Batch recall",
    module: "Inventory",
    record: "B-1402",
    outcome: "Success",
    details: "Supplier recall notice #R-334.",
  },
  {
    id: "A-9003",
    ts: "2026-10-17 10:31",
    user: "Maria L. Santos",
    role: "Patient",
    action: "Portal access",
    module: "Portal",
    record: "P-1001",
    outcome: "Success",
    details: "Viewed follow-up schedules.",
  },
  {
    id: "A-9002",
    ts: "2026-10-17 09:00",
    user: "Carlo Dizon",
    role: "Administrator",
    action: "Role change",
    module: "Users",
    record: "U-08",
    outcome: "Success",
    details: "Account deactivated.",
  },
  {
    id: "A-9001",
    ts: "2026-10-17 02:00",
    user: "System",
    role: "System",
    action: "Backup",
    module: "Backup",
    record: "BK-0418",
    outcome: "Success",
    details: "Nightly backup verified.",
  },
  {
    id: "A-9000",
    ts: "2026-10-16 13:10",
    user: "Joanna Reyes",
    role: "Receptionist",
    action: "AI assistant query",
    module: "AI Assistant",
    record: "—",
    outcome: "Success",
    details: "Prompt: 'Show upcoming follow-ups for Dr. Cruz'.",
  },
];

export const BACKUPS = [
  { id: "BK-0419", ts: "2026-10-19 02:00", size: "1.42 GB", type: "Automatic", status: "Verified" },
  { id: "BK-0418", ts: "2026-10-18 02:00", size: "1.41 GB", type: "Automatic", status: "Verified" },
  { id: "BK-0417", ts: "2026-10-17 14:22", size: "1.40 GB", type: "Manual", status: "Verified" },
  { id: "BK-0416", ts: "2026-10-17 02:00", size: "1.40 GB", type: "Automatic", status: "Verified" },
  { id: "BK-0415", ts: "2026-10-16 02:00", size: "1.39 GB", type: "Automatic", status: "Failed" },
];

export const TREATMENT_PLANS = [
  {
    id: "TP-01",
    patient: "Maria L. Santos",
    tooth: "26",
    stages: [
      {
        name: "Root canal (stage 1)",
        status: "Completed",
        interval: "—",
        prereq: "Periapical radiograph",
      },
      {
        name: "Root canal (stage 2)",
        status: "Scheduled",
        interval: "≥ 7 days after stage 1",
        prereq: "Stage 1 completed",
      },
      {
        name: "Crown preparation",
        status: "Scheduled",
        interval: "≥ 10 days after stage 2",
        prereq: "Root canal completed",
      },
      {
        name: "Crown fitting",
        status: "Pending",
        interval: "≥ 14 days after preparation",
        prereq: "Lab crown received",
      },
    ],
  },
  {
    id: "TP-02",
    patient: "Ramon D. Aquino",
    tooth: "46",
    stages: [
      {
        name: "Crown preparation",
        status: "Completed",
        interval: "—",
        prereq: "Glycemic control confirmed",
      },
      {
        name: "Crown fitting",
        status: "Scheduled",
        interval: "≥ 14 days after preparation",
        prereq: "Lab crown received",
      },
    ],
  },
  {
    id: "TP-03",
    patient: "Benjamin T. Garcia",
    tooth: "37",
    stages: [
      {
        name: "Medical clearance",
        status: "Pending",
        interval: "—",
        prereq: "Physician INR report",
      },
      {
        name: "Tooth extraction",
        status: "Needs Review",
        interval: "After clearance",
        prereq: "Medical clearance",
      },
    ],
  },
];

export const RESOURCES = {
  chairs: [
    { name: "Chair 1", status: "Available", note: "Maintenance block Oct 22, 08:00–10:00" },
    { name: "Chair 2", status: "In use", note: "Q2 in service" },
    { name: "Chair 3", status: "Maintenance", note: "Suction unit repair until Oct 22" },
    { name: "Chair 4", status: "Available", note: "—" },
  ],
  rooms: [
    { name: "Treatment Room A", status: "In use", note: "—" },
    { name: "Treatment Room B", status: "Available", note: "—" },
    { name: "Surgery Room", status: "Available", note: "Sterilization cycle 12:00–12:30" },
  ],
  equipment: [
    { name: "Intraoral camera", status: "Available", note: "—" },
    { name: "Panoramic X-ray", status: "Available", note: "Calibration due Nov 1" },
    { name: "Ultrasonic scaler", status: "Available", note: "—" },
    { name: "Rotary endo motor", status: "In use", note: "—" },
    { name: "Curing light", status: "Maintenance", note: "Battery replacement" },
  ],
};

export const AI_PROMPTS = [
  "Find patient records for today.",
  "Show upcoming follow-ups for Dr. Andrea Cruz.",
  "Prepare a follow-up schedule draft for this patient.",
  "Summarize this patient's tooth-specific history.",
  "Show available dental chairs this week.",
  "Check inventory needed for this procedure.",
];
