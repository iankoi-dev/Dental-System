import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  BellRing,
  CheckCheck,
  Loader2,
  PlayCircle,
  RefreshCw,
  UserPlus,
  XCircle,
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
import { Textarea } from "@/components/ui/textarea";
import {
  Callout,
  DataTable,
  Field,
  PageHeader,
  Restricted,
  StatusBadge,
  Td,
  selectCls,
} from "@/components/app/kit";
import { DENTISTS, type QueueEntry, type QueueStatus } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { can } from "@/lib/permissions";

export const Route = createFileRoute("/staff/queue")({
  head: () => ({
    meta: [
      { title: "Walk-In Queue — Dentriq" },
      { name: "description", content: "Walk-in-first queue management." },
      { property: "og:title", content: "Walk-In Queue — Dentriq" },
      { property: "og:description", content: "Walk-in-first queue management." },
    ],
  }),
  component: Queue,
});

const COLS: QueueStatus[] = [
  "Waiting",
  "Called",
  "In Service",
  "Completed",
  "Cancelled",
  "Rescheduled",
];
const wait = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return Math.max(0, 10 * 60 + 5 - (h * 60 + m));
};

function Queue() {
  const { role, queue, setQueue, patients, overlapUsed, setOverlapUsed, log } = useStore();
  const [view, setView] = useState<"board" | "table">("board");
  const [add, setAdd] = useState(false);
  const [newP, setNewP] = useState("");
  const [newD, setNewD] = useState(DENTISTS[0]);
  const [adjust, setAdjust] = useState<{ q: QueueEntry; to: QueueStatus } | null>(null);
  const [reason, setReason] = useState("");
  const [overlap, setOverlap] = useState(false);
  const [override, setOverride] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  if (!can(role, "queue")) return <Restricted what="the walk-in queue" />;
  const editable = role === "receptionist" || role === "admin";

  const move = (id: string, status: QueueStatus, r?: string) => {
    setQueue((all) => all.map((q) => (q.id === id ? { ...q, status, reason: r ?? q.reason } : q)));
    log("Queue adjustment", "Queue", id, `Status → ${status}${r ? `. Reason: ${r}` : ""}`);
    toast.success(`Queue updated: ${status}`);
  };
  const callNext = () => {
    const n = queue
      .filter((q) => q.status === "Waiting")
      .sort((a, b) => a.arrival.localeCompare(b.arrival))[0];
    if (!n) return toast("No one is waiting.");
    move(n.id, "Called");
  };

  return (
    <>
      <PageHeader
        title="Walk-In Queue"
        description="Walk-in patients are served first. Scheduled patients may be overlapped once by an earlier walk-in, with a recorded reason."
        crumbs={[{ label: "Walk-In Queue" }]}
        actions={
          editable && (
            <>
              <Button variant="outline" onClick={() => setOverlap(true)}>
                Apply scheduled overlap
              </Button>
              <Button variant="outline" onClick={callNext}>
                <BellRing className="mr-1.5 h-4 w-4" />
                Call next
              </Button>
              <Button onClick={() => setAdd(true)}>
                <UserPlus className="mr-1.5 h-4 w-4" />
                Register walk-in
              </Button>
            </>
          )
        }
      />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Callout
          tone={overlapUsed ? "warning" : "success"}
          className="flex-1"
          title={
            overlapUsed
              ? "One-time scheduled overlap already used today"
              : "Scheduled overlap available"
          }
        >
          {overlapUsed
            ? "Q6 (Daniel R. Flores) was overlapped by walk-in Q4 at 09:20. A second overlap requires an authorized override."
            : "One eligible earlier walk-in may be placed ahead of one scheduled patient."}
        </Callout>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              setRefreshing(true);
              await new Promise((r) => setTimeout(r, 700));
              setRefreshing(false);
              toast("Queue refreshed");
            }}
          >
            {refreshing ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-1 h-4 w-4" />
            )}
            Refresh
          </Button>
          <div className="flex rounded-lg border p-0.5">
            {(["board", "table"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-md px-3 py-1 text-sm font-medium capitalize ${view === v ? "bg-primary text-primary-foreground" : ""}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>
      {!editable && (
        <Callout tone="neutral" className="mb-4">
          View only — queue changes are made by reception or authorized staff.
        </Callout>
      )}

      {view === "board" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          {COLS.map((c) => {
            const items = queue.filter((q) => q.status === c);
            return (
              <div key={c} className="rounded-2xl border bg-muted/40 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <StatusBadge status={c} />
                  <span className="text-xs font-semibold text-muted-foreground">
                    {items.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {items.map((q) => (
                    <div key={q.id} className="rounded-xl border bg-card p-3 shadow-soft">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">#{q.no}</span>
                        <span className="text-[11px] font-semibold text-muted-foreground">
                          {q.type}
                        </span>
                      </div>
                      <p className="text-sm font-semibold">{q.patient}</p>
                      <p className="text-xs text-muted-foreground">
                        {q.arrival} · {q.dentist}
                      </p>
                      {["Waiting", "Called"].includes(q.status) && (
                        <p className="mt-1 text-xs font-medium text-warning">
                          Waiting {wait(q.arrival)} min
                        </p>
                      )}
                      {q.reason && (
                        <p className="mt-1 text-xs italic text-muted-foreground">{q.reason}</p>
                      )}
                      {editable && (
                        <Actions
                          q={q}
                          move={move}
                          adjust={(to) => {
                            setReason("");
                            setAdjust({ q, to });
                          }}
                        />
                      )}
                    </div>
                  ))}
                  {!items.length && (
                    <p className="py-4 text-center text-xs text-muted-foreground">Empty</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <DataTable head={["No.", "Patient", "Type", "Arrival", "Dentist", "Status", "Waiting", ""]}>
          {[...queue]
            .sort((a, b) => a.no - b.no)
            .map((q) => (
              <tr key={q.id}>
                <Td className="font-bold text-primary">#{q.no}</Td>
                <Td className="font-medium">
                  {q.patient}
                  <span className="ml-1 text-xs text-muted-foreground">{q.patientId}</span>
                </Td>
                <Td>{q.type}</Td>
                <Td>{q.arrival}</Td>
                <Td>{q.dentist}</Td>
                <Td>
                  <StatusBadge status={q.status} />
                </Td>
                <Td>{["Waiting", "Called"].includes(q.status) ? `${wait(q.arrival)} min` : "—"}</Td>
                <Td>
                  {editable && (
                    <Actions
                      q={q}
                      move={move}
                      adjust={(to) => {
                        setReason("");
                        setAdjust({ q, to });
                      }}
                    />
                  )}
                </Td>
              </tr>
            ))}
        </DataTable>
      )}

      <Dialog open={add} onOpenChange={setAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register walk-in arrival</DialogTitle>
            <DialogDescription>
              New patients should be registered first via OCR registration.
            </DialogDescription>
          </DialogHeader>
          <Field label="Patient" required>
            <select className={selectCls} value={newP} onChange={(e) => setNewP(e.target.value)}>
              <option value="">Select verified patient…</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id})
                </option>
              ))}
            </select>
          </Field>
          <Field label="Assigned dentist" required>
            <select className={selectCls} value={newD} onChange={(e) => setNewD(e.target.value)}>
              {DENTISTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </Field>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdd(false)}>
              Cancel
            </Button>
            <Button
              disabled={!newP}
              onClick={() => {
                const p = patients.find((x) => x.id === newP)!;
                const no = Math.max(...queue.map((q) => q.no)) + 1;
                setQueue((all) => [
                  ...all,
                  {
                    id: `Q${no}`,
                    no,
                    patientId: p.id,
                    patient: p.name,
                    arrival: "10:05",
                    dentist: newD,
                    status: "Waiting",
                    type: "Walk-in",
                  },
                ]);
                log("Walk-in registered", "Queue", `Q${no}`, p.name);
                toast.success(`Added #${no} to the queue`);
                setAdd(false);
                setNewP("");
              }}
            >
              Add to queue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!adjust} onOpenChange={(v) => !v && setAdjust(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {adjust?.to === "Cancelled" ? "Cancel queue entry" : "Mark as rescheduled"}
            </DialogTitle>
            <DialogDescription>
              #{adjust?.q.no} {adjust?.q.patient}. A reason is required and will be recorded.
            </DialogDescription>
          </DialogHeader>
          <Field
            label="Reason"
            required
            error={
              reason && reason.length < 5 ? "Please describe the reason in a few words." : undefined
            }
          >
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Patient requested to return tomorrow"
            />
          </Field>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjust(null)}>
              Back
            </Button>
            <Button
              variant={adjust?.to === "Cancelled" ? "destructive" : "default"}
              disabled={reason.length < 5}
              onClick={() => {
                move(adjust!.q.id, adjust!.to, reason);
                setAdjust(null);
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={overlap} onOpenChange={setOverlap}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scheduled-patient overlap</DialogTitle>
            <DialogDescription>
              Allow an eligible earlier walk-in to be served before one scheduled patient.
            </DialogDescription>
          </DialogHeader>
          {overlapUsed ? (
            <>
              <Callout tone="danger" title="Overlap already used today">
                A second automatic overlap is not permitted. An authorized override with a reason is
                required.
              </Callout>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={override}
                  onChange={(e) => setOverride(e.target.checked)}
                />{" "}
                I am authorizing an override
              </label>
            </>
          ) : (
            <Callout tone="info">
              Q7 (walk-in, arrived 09:52) would be served before the next scheduled patient.
            </Callout>
          )}
          <Field label="Authorized reason" required>
            <Textarea value={reason} onChange={(e) => setReason(e.target.value)} />
          </Field>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOverlap(false)}>
              Cancel
            </Button>
            <Button
              disabled={reason.length < 5 || (overlapUsed && !override)}
              onClick={() => {
                setOverlapUsed(true);
                log(overlapUsed ? "Overlap override" : "Scheduled overlap", "Queue", "Q7", reason);
                toast.success("Overlap recorded in audit log");
                setOverlap(false);
                setReason("");
                setOverride(false);
              }}
            >
              Record overlap
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Actions({
  q,
  move,
  adjust,
}: {
  q: QueueEntry;
  move: (id: string, s: QueueStatus) => void;
  adjust: (to: QueueStatus) => void;
}) {
  if (["Completed", "Cancelled", "Rescheduled"].includes(q.status)) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1">
      {q.status === "Waiting" && (
        <Button
          size="sm"
          variant="outline"
          className="h-7 px-2 text-xs"
          onClick={() => move(q.id, "Called")}
        >
          <BellRing className="mr-1 h-3 w-3" />
          Call
        </Button>
      )}
      {q.status === "Called" && (
        <Button
          size="sm"
          variant="outline"
          className="h-7 px-2 text-xs"
          onClick={() => move(q.id, "In Service")}
        >
          <PlayCircle className="mr-1 h-3 w-3" />
          Start
        </Button>
      )}
      {q.status === "In Service" && (
        <Button size="sm" className="h-7 px-2 text-xs" onClick={() => move(q.id, "Completed")}>
          <CheckCheck className="mr-1 h-3 w-3" />
          Complete
        </Button>
      )}
      <Button
        size="sm"
        variant="ghost"
        className="h-7 px-2 text-xs"
        onClick={() => adjust("Rescheduled")}
      >
        Adjust
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-7 px-2 text-xs text-danger"
        onClick={() => adjust("Cancelled")}
        aria-label={`Cancel #${q.no}`}
      >
        <XCircle className="h-3 w-3" />
      </Button>
    </div>
  );
}
