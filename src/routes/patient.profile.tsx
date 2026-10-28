import { createFileRoute } from "@tanstack/react-router";
import { KeyRound, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Callout, Panel, StatusBadge } from "@/components/app/kit";
import { PatientPortalShell } from "@/components/app/PatientPortalShell";

export const Route = createFileRoute("/patient/profile")({
  head: () => ({ meta: [{ title: "Profile — Dentriq" }] }),
  component: Profile,
});

function Profile() {
  const [requested, setRequested] = useState(false);
  return (
    <PatientPortalShell
      title="Profile"
      description="Review your portal account information and security options."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Panel
          title={
            <span className="flex items-center gap-2">
              <UserRound className="h-4 w-4 text-primary" /> Patient account
            </span>
          }
        >
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Name</dt>
              <dd className="font-medium">Maria L. Santos</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Patient ID</dt>
              <dd className="font-mono">P-1001</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd>maria.s@example.com</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Portal status</dt>
              <dd>
                <StatusBadge status="Active" />
              </dd>
            </div>
          </dl>
        </Panel>
        <Panel
          title={
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-success" /> Security
            </span>
          }
        >
          <div className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              Password and multi-factor settings are managed by the clinic portal in this prototype.
            </p>
            <Button variant="outline" disabled>
              <KeyRound className="mr-2 h-4 w-4" /> Security settings unavailable
            </Button>
          </div>
        </Panel>
      </div>
      <Panel
        title={
          <span className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" /> Account recovery
          </span>
        }
      >
        <p className="text-sm text-muted-foreground">
          Request help recovering access. This simulates a clinic request and does not send email or
          change credentials.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={() => setRequested(true)} disabled={requested}>
            {requested ? "Request submitted" : "Request recovery help"}
          </Button>
          {requested && (
            <span className="text-sm text-success" role="status">
              Clinic support will review your request.
            </span>
          )}
        </div>
      </Panel>
    </PatientPortalShell>
  );
}
