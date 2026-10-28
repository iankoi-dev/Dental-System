import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, CircleHelp, HeartPulse, ShieldCheck } from "lucide-react";
import { Callout, Panel } from "@/components/app/kit";
import { PatientPortalShell } from "@/components/app/PatientPortalShell";

export const Route = createFileRoute("/patient/instructions")({
  head: () => ({ meta: [{ title: "Instructions — Dentriq" }] }),
  component: Instructions,
});

function Instructions() {
  return (
    <PatientPortalShell
      title="Clinic instructions"
      description="Helpful guidance for your next visit and everyday care."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Panel
          title={
            <span className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" /> Before your visit
            </span>
          }
        >
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>Bring a current medication list and tell the clinic about new allergies.</li>
            <li>
              Eat a light meal before longer procedures unless your care team instructed otherwise.
            </li>
            <li>Arrive 10 minutes early for registration and questions.</li>
          </ul>
        </Panel>
        <Panel
          title={
            <span className="flex items-center gap-2">
              <HeartPulse className="h-4 w-4 text-primary" /> Aftercare
            </span>
          }
        >
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>
              Follow the written instructions from your dentist and take medicines only as directed.
            </li>
            <li>
              Call the clinic for persistent pain, swelling, fever, or a lost temporary filling.
            </li>
            <li>Do not use this portal for urgent dental or medical emergencies.</li>
          </ul>
        </Panel>
      </div>
      <Callout tone="info" title="Need help with your record?">
        Contact Cruz Nery Dental Clinic during business hours. Only authorized clinic staff can
        update records or schedules.
      </Callout>
      <div className="grid gap-4 sm:grid-cols-2">
        <Panel
          title={
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-success" /> Privacy reminder
            </span>
          }
        >
          <p className="text-sm text-muted-foreground">
            Keep your account private and sign out when using a shared device.
          </p>
        </Panel>
        <Panel
          title={
            <span className="flex items-center gap-2">
              <CircleHelp className="h-4 w-4 text-primary" /> Clinic help
            </span>
          }
        >
          <p className="text-sm text-muted-foreground">
            Cruz Nery Dental Clinic · Mon–Sat, 8:00 AM–5:00 PM · (02) 8555 0142
          </p>
        </Panel>
      </div>
    </PatientPortalShell>
  );
}
