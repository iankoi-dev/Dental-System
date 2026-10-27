import { createFileRoute, Link } from "@tanstack/react-router";
import { Callout, StatusBadge } from "@/components/app/kit";
import { Logo } from "@/components/app/Logo";
import { PATIENT_NOTIFICATIONS } from "@/lib/mock-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/patient/dashboard")({
  head: () => ({
    meta: [
      { title: "My Portal — Dentriq" },
      { name: "description", content: "Information-only patient portal." },
      { property: "og:title", content: "My Portal — Dentriq" },
      { property: "og:description", content: "Information-only patient portal." },
    ],
  }),
  component: Portal,
});

function Portal() {
  const { schedules, setRole } = useStore();
  const mine = schedules.filter((s) => s.patientId === "P-1001");
  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b bg-card px-5 py-3">
        <Logo />
        <Link to="/" onClick={() => setRole(null)} className="text-sm font-medium text-primary">
          Log out
        </Link>
      </header>
      <main className="mx-auto max-w-3xl space-y-6 p-5">
        <h1 className="text-2xl font-bold">Hello, Maria</h1>
        <Callout tone="primary">
          Follow-up schedules are arranged by your dentist or authorized clinic staff. Patients
          cannot book, cancel, or reschedule schedules through the portal.
        </Callout>
        <section>
          <h2 className="mb-2 text-lg font-semibold">My follow-up schedules</h2>
          <div className="space-y-2">
            {mine.map((s) => (
              <div key={s.id} className="rounded-2xl border bg-card p-4">
                <div className="flex justify-between">
                  <p className="font-semibold">{s.procedure}</p>
                  <StatusBadge status={s.status} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {s.date} · {s.start} · {s.dentist}
                </p>
                <p className="mt-1 text-sm">{s.instructions}</p>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold">Notifications</h2>
          <div className="space-y-2">
            {PATIENT_NOTIFICATIONS.map((n) => (
              <Callout key={n.id} tone={n.tone} title={n.title}>
                {n.body}
              </Callout>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
