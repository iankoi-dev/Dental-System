import { createFileRoute } from "@tanstack/react-router";
import { Bell, Megaphone } from "lucide-react";
import { PatientPortalShell } from "@/components/app/PatientPortalShell";
import { Callout } from "@/components/app/kit";
import { PATIENT_NOTIFICATIONS } from "@/lib/mock-data";

export const Route = createFileRoute("/patient/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Dentriq" },
      { name: "description", content: "Patient portal notifications." },
    ],
  }),
  component: Notifications,
});

function Notifications() {
  return (
    <PatientPortalShell
      title="Notifications"
      description="Reminders and updates from Cruz Nery Dental Clinic."
    >
      <div className="space-y-3">
        {PATIENT_NOTIFICATIONS.map((notification) => (
          <Callout key={notification.id} tone={notification.tone} title={notification.title}>
            {notification.body}
          </Callout>
        ))}
      </div>
      <section className="rounded-2xl border bg-card p-5 shadow-soft">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Notification preferences</h2>
        </div>
        <div className="mt-4 flex items-start gap-3 rounded-xl bg-muted/50 p-4">
          <Megaphone className="mt-0.5 h-4 w-4 text-primary" />
          <p className="text-sm text-muted-foreground">
            This prototype displays clinic notifications for your authorized account. Preference
            changes are not connected to a live messaging service.
          </p>
        </div>
      </section>
    </PatientPortalShell>
  );
}
