import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  CalendarPlus,
  FileText,
  KeyRound,
  Lock,
  Pencil,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Callout,
  DataTable,
  Field,
  PageHeader,
  Panel,
  Restricted,
  StatusBadge,
  Td,
} from "@/components/app/kit";
import { ScheduleDialog } from "@/components/app/ScheduleDialog";
import { OdontogramWorkspace } from "@/components/app/OdontogramWorkspace";
import { useStore } from "@/lib/store";
import { can, canEditClinical, canSchedule } from "@/lib/permissions";

export const Route = createFileRoute("/staff/patients/$id")({
  head: () => ({
    meta: [
      { title: "Patient record — Dentriq" },
      { name: "description", content: "Patient profile, clinical records and schedules." },
      { property: "og:title", content: "Patient record — Dentriq" },
      { property: "og:description", content: "Patient profile and records." },
    ],
  }),
  component: PatientPage,
});

function PatientPage() {
  const { id } = Route.useParams();
  const { patients, setPatients, schedules, audit, role, log } = useStore();
  const p = patients.find((x) => x.id === id);
  const [edit, setEdit] = useState(false);
  const [portal, setPortal] = useState(false);
  const [sched, setSched] = useState(false);
  const [contact, setContact] = useState(p?.contact ?? "");
  const [address, setAddress] = useState(p?.address ?? "");
  if (!can(role, "patients")) return <Restricted what="patient records" />;
  if (!p)
    return (
      <Callout tone="danger" title="Patient not found">
        No record exists for {id}.{" "}
        <Link to="/staff/patients" className="font-semibold underline">
          Back to patients
        </Link>
      </Callout>
    );
  const mine = schedules.filter((s) => s.patientId === id);
  const clinical = canEditClinical(role);

  return (
    <>
      <PageHeader
        title={p.name}
        description={`${p.id} · ${p.age} y/o ${p.sex} · Last visit ${p.lastVisit}`}
        crumbs={[{ label: "Patients", to: "/staff/patients" }, { label: p.name }]}
        actions={
          <>
            {p.portal === "None" && (
              <Button variant="outline" onClick={() => setPortal(true)}>
                <KeyRound className="mr-1.5 h-4 w-4" />
                Create portal account
              </Button>
            )}
            {canSchedule(role) && (
              <Button onClick={() => setSched(true)}>
                <CalendarPlus className="mr-1.5 h-4 w-4" />
                Create follow-up
              </Button>
            )}
          </>
        }
      />
      {p.alerts.length > 0 && (
        <Callout tone="warning" title="Medical alerts" className="mb-4">
          {p.alerts.join(" · ")}
        </Callout>
      )}
      <Tabs defaultValue="info">
        <TabsList className="mb-4 flex h-auto flex-wrap justify-start">
          {[
            "Personal information",
            "Medical history & alerts",
            "Clinical records",
            "3D Odontogram",
            "Follow-up schedules",
            "Attachments",
            "Activity history",
          ].map((t, i) => (
            <TabsTrigger key={t} value={["info", "med", "clin", "odo", "sch", "att", "act"][i]}>
              {t}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="info">
          <Panel
            title="Personal information"
            action={
              <Button size="sm" variant="outline" onClick={() => setEdit(true)}>
                <Pencil className="mr-1 h-3.5 w-3.5" />
                Edit contact
              </Button>
            }
          >
            <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["Full name", p.name],
                ["Date of birth", p.dob],
                ["Sex", p.sex],
                ["Contact number", p.contact],
                ["Email", p.email],
                ["Address", p.address],
                ["Emergency contact", p.emergencyContact],
                ["Portal status", p.portal],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-muted-foreground">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            {!clinical && (
              <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5" />
                Clinical fields can only be edited by dentists or administrators.
              </p>
            )}
          </Panel>
        </TabsContent>
        <TabsContent value="med">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Medical history", p.medicalHistory],
              ["Allergies", p.allergies],
              ["Existing conditions", p.conditions],
            ].map(([k, v]) => (
              <Panel key={k} title={k}>
                <p className="text-sm">{v}</p>
              </Panel>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="clin">
          <DataTable head={["Date", "Tooth", "Entry", "By"]}>
            {[
              [
                "2026-10-14",
                "26",
                "Root canal stage 1 — canal cleaning, temporary filling",
                "Dr. Andrea Cruz",
              ],
              ["2026-10-07", "26", "Examination — deep distal caries recorded", "Dr. Andrea Cruz"],
              ["2026-09-12", "16", "Check-up — restoration stable", "Dr. Andrea Cruz"],
            ].map((r) => (
              <tr key={r[0] + r[1]}>
                {r.map((c) => (
                  <Td key={c}>{c}</Td>
                ))}
              </tr>
            ))}
          </DataTable>
        </TabsContent>
        <TabsContent value="odo">
          <OdontogramWorkspace patientId={p.id} />
        </TabsContent>
        <TabsContent value="sch">
          {mine.length ? (
            <DataTable head={["ID", "Date", "Time", "Procedure", "Tooth", "Dentist", "Status"]}>
              {mine.map((s) => (
                <tr key={s.id}>
                  <Td className="font-mono text-xs">{s.id}</Td>
                  <Td>{s.date}</Td>
                  <Td>{s.start}</Td>
                  <Td>{s.procedure}</Td>
                  <Td>{s.tooth}</Td>
                  <Td>{s.dentist}</Td>
                  <Td>
                    <StatusBadge status={s.status} />
                  </Td>
                </tr>
              ))}
            </DataTable>
          ) : (
            <Callout tone="neutral">No follow-up schedules for this patient.</Callout>
          )}
        </TabsContent>
        <TabsContent value="att">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {["registration_form.jpg", "periapical_26.jpg", "consent_form.pdf"].map((f) => (
              <div
                key={f}
                className="flex aspect-[4/3] flex-col items-center justify-center rounded-xl border bg-muted text-xs"
              >
                <FileText className="mb-1 h-5 w-5 text-muted-foreground" />
                {f}
              </div>
            ))}
            <button
              onClick={() => toast.success("Attachment uploaded (simulated)")}
              className="flex aspect-[4/3] flex-col items-center justify-center rounded-xl border-2 border-dashed text-xs text-muted-foreground hover:border-primary hover:text-primary"
            >
              <Upload className="mb-1 h-5 w-5" />
              Upload file
            </button>
          </div>
        </TabsContent>
        <TabsContent value="act">
          <ul className="space-y-2">
            {audit
              .filter((a) => a.record.includes(p.id))
              .concat(audit.slice(0, 2))
              .map((a, i) => (
                <li
                  key={a.id + i}
                  className="flex justify-between rounded-lg border bg-card p-3 text-sm"
                >
                  <span>
                    <b>{a.action}</b> — {a.details}
                  </span>
                  <span className="text-xs text-muted-foreground">{a.ts}</span>
                </li>
              ))}
          </ul>
        </TabsContent>
      </Tabs>

      <Dialog open={edit} onOpenChange={setEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit contact details</DialogTitle>
            <DialogDescription>Changes are recorded in the audit log.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Field
              label="Contact number"
              required
              error={contact.length < 7 ? "Please enter a complete contact number." : undefined}
            >
              <Input value={contact} onChange={(e) => setContact(e.target.value)} />
            </Field>
            <Field label="Address" required>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} />
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEdit(false)}>
              Cancel
            </Button>
            <Button
              disabled={contact.length < 7 || !address}
              onClick={() => {
                setPatients((all) =>
                  all.map((x) => (x.id === p.id ? { ...x, contact, address } : x)),
                );
                log("Patient-record update", "Patients", p.id, "Contact details updated.");
                toast.success("Patient record saved successfully.");
                setEdit(false);
              }}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={portal} onOpenChange={setPortal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Patient Portal account</DialogTitle>
            <DialogDescription>
              An information-only account will be linked to {p.name}'s verified record. An
              invitation will be sent to {p.email}.
            </DialogDescription>
          </DialogHeader>
          <Callout tone="info">
            Patients can view their records and schedules but cannot book, cancel or reschedule.
          </Callout>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPortal(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setPatients((all) =>
                  all.map((x) => (x.id === p.id ? { ...x, portal: "Active" } : x)),
                );
                log("Portal account created", "Portal", p.id, "Invitation sent.");
                toast.success("Portal account created and invitation sent.");
                setPortal(false);
              }}
            >
              Create account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {sched && <ScheduleDialog open={sched} onOpenChange={setSched} patientId={p.id} />}
    </>
  );
}
