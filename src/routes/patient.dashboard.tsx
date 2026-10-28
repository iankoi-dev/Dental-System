import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarClock,
  FileText,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Callout, Empty, Panel, StatusBadge } from "@/components/app/kit";
import { PatientPortalShell } from "@/components/app/PatientPortalShell";
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
  const { schedules } = useStore();
  const mine = schedules.filter((s) => s.patientId === "P-1001");
  const links = [
    ["/patient/records", "My records", FileText],
    ["/patient/tooth-history", "Tooth history", ShieldCheck],
    ["/patient/schedules", "Follow-up schedules", CalendarClock],
    ["/patient/notifications", "Notifications", Bell],
    ["/patient/instructions", "Instructions", BookOpen],
    ["/patient/profile", "Profile", UserRound],
  ] as const;
  return (
    <PatientPortalShell
      title="Welcome back, Maria"
      description="Your read-only view of care information shared by Cruz Nery Dental Clinic."
    >
      <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <Panel title="Upcoming follow-up">
          {mine[0] ? (
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold">{mine[0].procedure}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {mine[0].date} at {mine[0].start} · {mine[0].dentist}
                </p>
                <p className="mt-3 text-sm">{mine[0].instructions}</p>
              </div>
              <StatusBadge status={mine[0].status} />
            </div>
          ) : (
            <Empty
              icon={CalendarClock}
              title="No follow-up scheduled"
              body="Your clinic will share one here when arranged."
            />
          )}
        </Panel>
        <Panel title="Portal shortcuts">
          <div className="grid grid-cols-2 gap-2">
            {links.map(([to, label, Icon]) => (
              <Link
                key={to}
                to={to}
                className="group rounded-xl border p-3 text-sm font-medium transition hover:border-primary hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Icon className="mb-2 h-4 w-4 text-primary" aria-hidden />
                <span>{label}</span>
                <ArrowRight
                  className="mt-2 h-3.5 w-3.5 text-muted-foreground transition group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            ))}
          </div>
        </Panel>
      </div>
      <Panel
        title="Recent updates"
        action={
          <Link to="/patient/notifications" className="text-sm font-medium text-primary">
            View all
          </Link>
        }
      >
        <div className="space-y-3">
          {PATIENT_NOTIFICATIONS.slice(0, 3).map((n) => (
            <div
              key={n.id}
              className="flex items-start gap-3 border-b pb-3 last:border-0 last:pb-0"
            >
              <StatusBadge status={n.title} tone={n.tone} className="mt-0.5" />
              <div>
                <p className="text-sm">{n.body}</p>
                <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>
      <Callout tone="primary" title="Information-only portal">
        Follow-up schedules are arranged by your dentist or authorized clinic staff. Patients cannot
        book, cancel, or reschedule schedules through the portal.
      </Callout>
    </PatientPortalShell>
  );
}
