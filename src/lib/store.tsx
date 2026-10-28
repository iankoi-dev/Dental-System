import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import {
  AUDIT,
  BATCHES,
  PATIENTS,
  QUEUE,
  SCHEDULES,
  type Batch,
  type Patient,
  type QueueEntry,
  type Role,
  type Schedule,
  DEMO_USERS,
  ROLE_LABELS,
} from "./mock-data";

type Audit = (typeof AUDIT)[number];

interface Store {
  hydrated: boolean;
  role: Role | null;
  setRole: (r: Role | null) => void;
  user: { name: string; email: string } | null;
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  queue: QueueEntry[];
  setQueue: React.Dispatch<React.SetStateAction<QueueEntry[]>>;
  overlapUsed: boolean;
  setOverlapUsed: (v: boolean) => void;
  schedules: Schedule[];
  setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>;
  batches: Batch[];
  setBatches: React.Dispatch<React.SetStateAction<Batch[]>>;
  audit: Audit[];
  log: (action: string, module: string, record: string, details: string, outcome?: string) => void;
}

const Ctx = createContext<Store | null>(null);
const KEY = "dentriq-role";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [role, setRoleState] = useState<Role | null>(null);
  const [patients, setPatients] = useState(PATIENTS);
  const [queue, setQueue] = useState(QUEUE);
  const [overlapUsed, setOverlapUsed] = useState(true);
  const [schedules, setSchedules] = useState(SCHEDULES);
  const [batches, setBatches] = useState(BATCHES);
  const [audit, setAudit] = useState<Audit[]>(AUDIT);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    const r = stored && DEMO_USERS[stored as Role] ? (stored as Role) : null;
    if (r) setRoleState(r);
    else if (stored) localStorage.removeItem(KEY);
    setHydrated(true);
  }, []);

  const setRole = useCallback((r: Role | null) => {
    setRoleState(r);
    if (r) localStorage.setItem(KEY, r);
    else localStorage.removeItem(KEY);
  }, []);

  const user = role ? DEMO_USERS[role] : null;
  const log = useCallback(
    (action: string, module: string, record: string, details: string, outcome = "Success") => {
      const now = new Date();
      const ts = `2026-10-19 ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      setAudit((a) => [
        {
          id: `A-${9100 + a.length}`,
          ts,
          user: user?.name ?? "System",
          role: role ? ROLE_LABELS[role] : "—",
          action,
          module,
          record,
          outcome,
          details,
        },
        ...a,
      ]);
    },
    [user, role],
  );

  return (
    <Ctx.Provider
      value={{
        hydrated,
        role,
        setRole,
        user,
        patients,
        setPatients,
        queue,
        setQueue,
        overlapUsed,
        setOverlapUsed,
        schedules,
        setSchedules,
        batches,
        setBatches,
        audit,
        log,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore outside provider");
  return c;
}
