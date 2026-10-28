import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, CheckCircle2 } from "lucide-react";
import { PatientPortalShell } from "@/components/app/PatientPortalShell";
import { StatusBadge, Empty } from "@/components/app/kit";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/patient/schedules")({
  head: () => ({
    meta: [
      { title: "Follow-up Schedules — Dentriq" },
      { name: "description", content: "Dentist-arranged follow-up schedules." },
    ],
  }),
  component: Schedules,
});

function Schedules() {
  const { schedules } = useStore();
  const mine = schedules.filter((s) => s.patientId === "P-1001");
  return (
    <PatientPortalShell
      title="Follow-up schedules"
      description="View visits arranged by your dentist or authorized clinic staff."
    >
      {mine.length ? (
        <div className="space-y-3">
          {mine.map((schedule) => (
            <article key={schedule.id} className="rounded-2xl border bg-card p-5 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex gap-3">
                  <span className="rounded-xl bg-primary-soft p-2 text-primary">
                    <CalendarClock className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-semibold">{schedule.procedure}</h2>
                    <p className="text-sm text-muted-foreground">
                      {schedule.date} at {schedule.start} · {schedule.dentist}
                    </p>
                  </div>
                </div>
                <StatusBadge status={schedule.status} />
              </div>
              <p className="mt-4 text-sm">{schedule.instructions}</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-success" /> Details are for information only
              </div>
            </article>
          ))}
        </div>
      ) : (
        <Empty
          icon={CalendarClock}
          title="No follow-ups yet"
          body="Your clinic will share a schedule here when one is arranged."
        />
      )}
    </PatientPortalShell>
  );
}
