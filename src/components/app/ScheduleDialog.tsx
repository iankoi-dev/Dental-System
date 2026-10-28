import { useState } from "react";
import { Loader2, Network } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  CHAIRS,
  DENTISTS,
  EQUIPMENT,
  PROCEDURES,
  ROOMS,
  PROCEDURE_MATERIALS,
  type Schedule,
  type ScheduleStatus,
} from "@/lib/mock-data";
import { itemName, runChangeImpactAnalysis, type ImpactResult } from "@/lib/mock-service";
import { hasDuplicateActiveSchedule, validateScheduleDraft } from "@/lib/workflow-rules";
import { useStore } from "@/lib/store";
import { Field, selectCls } from "./kit";
import { ImpactReview, impactBlocks } from "./ImpactReview";

const blank = (pid?: string): Partial<Schedule> => ({
  patientId: pid ?? "",
  procedure: "",
  tooth: "",
  date: "2026-10-26",
  start: "10:00",
  duration: 45,
  dentist: DENTISTS[0],
  staff: "",
  chair: CHAIRS[0],
  room: ROOMS[0],
  equipment: EQUIPMENT[0],
  instructions: "",
  notes: "",
  status: "Scheduled",
});

export function ScheduleDialog({
  open,
  onOpenChange,
  initial,
  patientId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: Schedule;
  patientId?: string;
}) {
  const { patients, schedules, setSchedules, log } = useStore();
  const [d, setD] = useState<Partial<Schedule>>(initial ?? blank(patientId));
  const [touched, setTouched] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<ImpactResult | null>(null);
  const [ack, setAck] = useState(false);
  const set = (k: keyof Schedule, v: string | number) => {
    setD((x) => ({ ...x, [k]: v }));
    setResult(null);
    setAck(false);
  };

  const errors = validateScheduleDraft(d);
  const valid = Object.keys(errors).length === 0;
  const mats = PROCEDURE_MATERIALS[d.procedure ?? ""] ?? [];

  async function review() {
    setTouched(true);
    if (!valid) return;
    setRunning(true);
    setResult(await runChangeImpactAnalysis(d));
    setRunning(false);
  }
  function save(status: ScheduleStatus) {
    setTouched(true);
    if (!valid) {
      toast.error("Complete the required schedule fields before saving.");
      return;
    }
    const p = patients.find((x) => x.id === d.patientId);
    if (!p) {
      toast.error("Select a valid patient record before saving.");
      return;
    }
    const duplicate = hasDuplicateActiveSchedule(schedules, d, initial?.id);
    if (duplicate) {
      toast.error("This patient already has an active schedule at that date and time.");
      return;
    }
    const rec: Schedule = {
      ...(d as Schedule),
      patient: p.name,
      materials: mats.map((m) => itemName(m.itemId)).join(", "),
      status,
      id: initial?.id ?? `S-${2200 + Math.floor(Math.random() * 700)}`,
    };
    setSchedules((all) =>
      initial ? all.map((s) => (s.id === initial.id ? rec : s)) : [rec, ...all],
    );
    log(
      initial
        ? "Schedule modified"
        : status === "Scheduled" && !result
          ? "Schedule draft saved"
          : "Schedule created",
      "Schedules",
      rec.id,
      `Change-impact: ${result?.overall ?? "not run"}`,
    );
    toast.success(
      initial
        ? "Follow-up schedule updated."
        : result
          ? "Follow-up schedule created."
          : "Draft saved.",
    );
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initial ? `Reschedule ${initial.id}` : "Create follow-up schedule"}
          </DialogTitle>
          <DialogDescription>
            Follow-ups are arranged by dentists or authorized clinic staff only. A change-impact
            review is required before confirming.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className="mb-2 text-sm font-semibold text-primary">Schedule details</legend>
            <Field label="Patient" required error={touched ? errors.patientId : undefined}>
              <select
                className={selectCls}
                value={d.patientId}
                onChange={(e) => set("patientId", e.target.value)}
              >
                <option value="">Select patient…</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.id})
                  </option>
                ))}
              </select>
            </Field>
            <Field
              label="Procedure or treatment"
              required
              error={touched ? errors.procedure : undefined}
            >
              <select
                className={selectCls}
                value={d.procedure}
                onChange={(e) => set("procedure", e.target.value)}
              >
                <option value="">Select procedure…</option>
                {PROCEDURES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </Field>
            <Field
              label="Affected tooth or site"
              required
              error={touched ? errors.tooth : undefined}
            >
              <Input
                value={d.tooth}
                onChange={(e) => set("tooth", e.target.value)}
                placeholder="e.g. 26"
              />
            </Field>
            <Field label="Date" required error={touched ? errors.date : undefined}>
              <Input type="date" value={d.date} onChange={(e) => set("date", e.target.value)} />
            </Field>
            <Field label="Start time" required>
              <Input type="time" value={d.start} onChange={(e) => set("start", e.target.value)} />
            </Field>
            <Field label="Expected duration (minutes)" required>
              <Input
                type="number"
                min={10}
                step={5}
                value={d.duration}
                onChange={(e) => set("duration", +e.target.value)}
              />
            </Field>
          </fieldset>
          <fieldset className="grid gap-4 sm:grid-cols-3">
            <legend className="mb-2 text-sm font-semibold text-primary">Resource assignment</legend>
            <Field label="Assigned dentist" required>
              <select
                className={selectCls}
                value={d.dentist}
                onChange={(e) => set("dentist", e.target.value)}
              >
                {DENTISTS.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </Field>
            <Field label="Assigned staff (optional)">
              <select
                className={selectCls}
                value={d.staff}
                onChange={(e) => set("staff", e.target.value)}
              >
                <option value="">None</option>
                <option>Joanna Reyes</option>
                <option>Dental assistant on duty</option>
              </select>
            </Field>
            <Field label="Dental chair" required>
              <select
                className={selectCls}
                value={d.chair}
                onChange={(e) => set("chair", e.target.value)}
              >
                {CHAIRS.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </Field>
            <Field label="Treatment room" required>
              <select
                className={selectCls}
                value={d.room}
                onChange={(e) => set("room", e.target.value)}
              >
                {ROOMS.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </Field>
            <Field label="Equipment">
              <select
                className={selectCls}
                value={d.equipment}
                onChange={(e) => set("equipment", e.target.value)}
              >
                {EQUIPMENT.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select
                className={selectCls}
                value={d.status}
                onChange={(e) => set("status", e.target.value)}
              >
                {["Scheduled", "Confirmed", "Needs Review"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </Field>
          </fieldset>
          <div>
            <p className="mb-2 text-sm font-semibold text-primary">Required materials</p>
            {mats.length ? (
              <div className="flex flex-wrap gap-2">
                {mats.map((m) => (
                  <span
                    key={m.itemId}
                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium"
                  >
                    {itemName(m.itemId)} × {m.qty}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select a procedure to see mapped materials.
              </p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Patient instructions">
              <Textarea
                rows={2}
                value={d.instructions}
                onChange={(e) => set("instructions", e.target.value)}
                placeholder="e.g. Eat a light meal before the visit."
              />
            </Field>
            <Field label="Notes">
              <Textarea rows={2} value={d.notes} onChange={(e) => set("notes", e.target.value)} />
            </Field>
          </div>
          {running && (
            <div className="flex items-center gap-2 rounded-xl bg-ai-soft p-4 text-sm">
              <Loader2 className="h-4 w-4 animate-spin text-ai" /> Checking 10 scheduling factors…
            </div>
          )}
          {result && <ImpactReview result={result} ack={ack} setAck={setAck} />}
        </div>
        <DialogFooter className="flex-wrap gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="outline" disabled={!valid} onClick={() => save("Scheduled")}>
            Save draft
          </Button>
          <Button variant="secondary" onClick={review} disabled={running}>
            <Network className="mr-1.5 h-4 w-4" />
            Run change-impact review
          </Button>
          <Button
            disabled={impactBlocks(result, ack)}
            onClick={() => save(initial ? "Rescheduled" : "Confirmed")}
            title={
              impactBlocks(result, ack)
                ? "Run the review and resolve conflicts or acknowledge warnings first"
                : undefined
            }
          >
            Confirm schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
