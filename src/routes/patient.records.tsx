import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, ClipboardList, HeartPulse, UserRound } from "lucide-react";
import { PATIENT_NOTIFICATIONS } from "@/lib/mock-data";
import { PatientPortalShell } from "@/components/app/PatientPortalShell";
import { StatusBadge } from "@/components/app/kit";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/patient/records")({
  head: () => ({
    meta: [
      { title: "My Records — Dentriq" },
      { name: "description", content: "Your authorized dental record summary." },
    ],
  }),
  component: Records,
});

function Records() {
  const { patients } = useStore();
  const patient = patients.find((p) => p.id === "P-1001");
  if (!patient) return null;
  return (
    <PatientPortalShell
      title="My records"
      description="A simple view of the personal and clinical information shared with you."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border bg-card p-5 shadow-soft">
          <div className="flex items-center gap-2">
            <UserRound className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Personal information</h2>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Full name</dt>
              <dd className="font-medium">{patient.name}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Patient ID</dt>
              <dd className="font-mono">{patient.id}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Date of birth</dt>
              <dd>{patient.dob}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Contact</dt>
              <dd>{patient.contact}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-muted-foreground">Address</dt>
              <dd>{patient.address}</dd>
            </div>
          </dl>
        </section>
        <section className="rounded-2xl border bg-card p-5 shadow-soft">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Medical history</h2>
          </div>
          <p className="mt-4 text-sm">{patient.medicalHistory}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <StatusBadge status={`Allergies: ${patient.allergies}`} tone="warning" />
            <StatusBadge status={patient.conditions} tone="info" />
          </div>
        </section>
      </div>
      <section className="rounded-2xl border bg-card p-5 shadow-soft">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <h2 className="font-semibold">Alerts shared with your care team</h2>
        </div>
        {patient.alerts.length ? (
          <ul className="mt-3 space-y-2 text-sm">
            {patient.alerts.map((alert) => (
              <li key={alert} className="rounded-lg bg-warning-soft px-3 py-2">
                {alert}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">No active alerts are recorded.</p>
        )}
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border bg-card p-5 shadow-soft">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Treatment summary</h2>
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Last visit</dt>
              <dd>{patient.lastVisit}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Current care</dt>
              <dd>Root canal stage 2 follow-up for tooth 26</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Record access</dt>
              <dd className="text-muted-foreground">Read-only patient view</dd>
            </div>
          </dl>
        </section>
        <section className="rounded-2xl border bg-card p-5 shadow-soft">
          <h2 className="font-semibold">Recent clinical updates</h2>
          <div className="mt-4 space-y-3">
            {PATIENT_NOTIFICATIONS.filter((item) => item.id === "PN2" || item.id === "PN5").map(
              (item) => (
                <div key={item.id} className="border-b pb-3 last:border-0 last:pb-0">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.time}</p>
                </div>
              ),
            )}
          </div>
        </section>
      </section>
    </PatientPortalShell>
  );
}
