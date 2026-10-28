import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarPlus, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Callout,
  DataTable,
  PageHeader,
  Restricted,
  StatusBadge,
  Td,
  selectCls,
} from "@/components/app/kit";
import { ScheduleDialog } from "@/components/app/ScheduleDialog";
import { DENTISTS, PROCEDURES, CHAIRS, type Schedule } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { can, canSchedule } from "@/lib/permissions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/staff/schedules")({
  head: () => ({
    meta: [
      { title: "Follow-Up Schedules — Dentriq" },
      { name: "description", content: "Dentist-arranged follow-up scheduling." },
      { property: "og:title", content: "Follow-Up Schedules — Dentriq" },
      { property: "og:description", content: "Dentist-arranged follow-up scheduling." },
    ],
  }),
  component: Schedules,
});

const addDays = (d: string, n: number) => {
  const x = new Date(d + "T00:00:00");
  x.setDate(x.getDate() + n);
  return x.toISOString().slice(0, 10);
};

function Schedules() {
  const { role, schedules, setSchedules, log } = useStore();
  const [mode, setMode] = useState<"day" | "week" | "month" | "list">("week");
  const [anchor, setAnchor] = useState("2026-10-19");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Schedule | undefined>();
  const [cancel, setCancel] = useState<Schedule | null>(null);
  const [f, setF] = useState({
    q: "",
    dentist: "",
    procedure: "",
    status: "",
    chair: "",
    date: "",
  });
  const rows = useMemo(
    () =>
      schedules
        .filter(
          (s) =>
            (s.patient + s.id).toLowerCase().includes(f.q.toLowerCase()) &&
            (!f.dentist || s.dentist === f.dentist) &&
            (!f.procedure || s.procedure === f.procedure) &&
            (!f.status || s.status === f.status) &&
            (!f.chair || s.chair === f.chair) &&
            (!f.date || s.date === f.date),
        )
        .sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start)),
    [schedules, f],
  );
  if (!can(role, "schedules")) return <Restricted what="follow-up schedules" />;
  const editable = canSchedule(role);
  const days =
    mode === "day"
      ? [anchor]
      : mode === "week"
        ? Array.from({ length: 7 }, (_, i) => addDays(anchor, i))
        : Array.from({ length: 35 }, (_, i) => addDays("2026-09-28", i));
  const step = mode === "day" ? 1 : mode === "week" ? 7 : 0;

  return (
    <>
      <PageHeader
        title="Follow-Up Schedules"
        description="Follow-ups are arranged only by dentists or authorized clinic staff. Every change goes through an AI change-impact review."
        crumbs={[{ label: "Follow-Up Schedules" }]}
        actions={
          editable && (
            <Button
              onClick={() => {
                setEditing(undefined);
                setOpen(true);
              }}
            >
              <CalendarPlus className="mr-1.5 h-4 w-4" />
              Create follow-up schedule
            </Button>
          )
        }
      />
      {!editable && (
        <Callout tone="neutral" className="mb-4">
          View only — your role cannot create or modify schedules.
        </Callout>
      )}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-lg border bg-card p-0.5">
          {(["day", "week", "month", "list"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium capitalize",
                mode === m && "bg-primary text-primary-foreground",
              )}
            >
              {m}
            </button>
          ))}
        </div>
        {mode !== "list" && mode !== "month" && (
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              aria-label="Previous"
              onClick={() => setAnchor(addDays(anchor, -step))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-semibold">
              {anchor}
              {mode === "week" && ` – ${addDays(anchor, 6)}`}
            </span>
            <Button
              size="icon"
              variant="outline"
              aria-label="Next"
              onClick={() => setAnchor(addDays(anchor, step))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
        {mode === "month" && <span className="text-sm font-semibold">October 2026</span>}
      </div>

      {mode === "list" ? (
        <>
          <div className="mb-3 grid gap-2 rounded-2xl border bg-card p-3 sm:grid-cols-3 lg:grid-cols-6">
            <Input
              placeholder="Patient or ID"
              value={f.q}
              onChange={(e) => setF({ ...f, q: e.target.value })}
              aria-label="Search patient"
            />
            <Input
              type="date"
              value={f.date}
              onChange={(e) => setF({ ...f, date: e.target.value })}
              aria-label="Date"
            />
            <select
              className={selectCls}
              value={f.dentist}
              onChange={(e) => setF({ ...f, dentist: e.target.value })}
              aria-label="Dentist"
            >
              <option value="">All dentists</option>
              {DENTISTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <select
              className={selectCls}
              value={f.procedure}
              onChange={(e) => setF({ ...f, procedure: e.target.value })}
              aria-label="Procedure"
            >
              <option value="">All procedures</option>
              {PROCEDURES.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <select
              className={selectCls}
              value={f.status}
              onChange={(e) => setF({ ...f, status: e.target.value })}
              aria-label="Status"
            >
              <option value="">All statuses</option>
              {[
                "Scheduled",
                "Confirmed",
                "Completed",
                "Cancelled",
                "Rescheduled",
                "Needs Review",
              ].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <select
              className={selectCls}
              value={f.chair}
              onChange={(e) => setF({ ...f, chair: e.target.value })}
              aria-label="Resource"
            >
              <option value="">All chairs</option>
              {CHAIRS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          <DataTable
            head={[
              "ID",
              "Date",
              "Time",
              "Patient",
              "Procedure",
              "Tooth",
              "Dentist",
              "Chair",
              "Status",
              "",
            ]}
          >
            {rows.map((s) => (
              <tr key={s.id}>
                <Td className="font-mono text-xs">{s.id}</Td>
                <Td>{s.date}</Td>
                <Td>
                  {s.start} · {s.duration}m
                </Td>
                <Td className="font-medium">{s.patient}</Td>
                <Td>{s.procedure}</Td>
                <Td>{s.tooth}</Td>
                <Td>{s.dentist}</Td>
                <Td>{s.chair}</Td>
                <Td>
                  <StatusBadge status={s.status} />
                </Td>
                <Td>
                  {editable && !["Cancelled", "Completed"].includes(s.status) && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditing(s);
                          setOpen(true);
                        }}
                      >
                        Reschedule
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-danger"
                        onClick={() => setCancel(s)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </Td>
              </tr>
            ))}
          </DataTable>
        </>
      ) : (
        <div
          className={cn(
            "grid gap-2",
            mode === "day" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-7",
          )}
        >
          {mode === "month" &&
            ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <p
                key={d}
                className="hidden text-center text-xs font-semibold text-muted-foreground md:block"
              >
                {d}
              </p>
            ))}
          {days.map((d) => {
            const items = schedules
              .filter((s) => s.date === d)
              .sort((a, b) => a.start.localeCompare(b.start));
            const dim = mode === "month" && !d.startsWith("2026-10");
            return (
              <div
                key={d}
                className={cn(
                  "rounded-xl border bg-card p-2",
                  mode === "month" ? "min-h-24" : "min-h-56",
                  dim && "opacity-40",
                  d === "2026-10-19" && "ring-2 ring-primary/40",
                )}
              >
                <p className="mb-2 text-xs font-semibold">
                  {new Date(d + "T00:00:00").toLocaleDateString("en-US", {
                    weekday: mode === "month" ? undefined : "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <div className="space-y-1.5">
                  {items.map((s) => (
                    <button
                      key={s.id}
                      onClick={() =>
                        editable &&
                        !["Cancelled", "Completed"].includes(s.status) &&
                        (setEditing(s), setOpen(true))
                      }
                      disabled={!editable || ["Cancelled", "Completed"].includes(s.status)}
                      aria-label={`${s.start} ${s.patient} ${s.procedure}`}
                      className={cn(
                        "w-full rounded-lg border-l-4 bg-muted/50 p-1.5 text-left text-[11px] hover:bg-accent",
                        s.status === "Needs Review"
                          ? "border-warning"
                          : s.status === "Cancelled"
                            ? "border-neutral line-through"
                            : s.status === "Completed"
                              ? "border-success"
                              : "border-primary",
                      )}
                    >
                      <b>{s.start}</b> {s.patient.split(" ")[0]}
                      {mode !== "month" && (
                        <>
                          <br />
                          {s.procedure}
                          <br />
                          <span className="text-muted-foreground">
                            {s.dentist} · {s.chair}
                          </span>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {open && (
        <ScheduleDialog
          key={editing?.id ?? "new"}
          open={open}
          onOpenChange={setOpen}
          initial={editing}
        />
      )}
      <AlertDialog open={!!cancel} onOpenChange={(v) => !v && setCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel {cancel?.id}?</AlertDialogTitle>
            <AlertDialogDescription>
              {cancel?.patient} · {cancel?.procedure} on {cancel?.date}. Reserved materials will be
              released and the patient will see the updated status in their portal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep schedule</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                setSchedules((all) =>
                  all.map((s) => (s.id === cancel!.id ? { ...s, status: "Cancelled" } : s)),
                );
                log("Schedule cancelled", "Schedules", cancel!.id, "Cancelled by authorized user.");
                toast.success("Schedule cancelled");
              }}
            >
              Cancel schedule
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
