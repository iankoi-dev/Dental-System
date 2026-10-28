import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type { ImpactResult, CheckStatus } from "@/lib/mock-service";
import { AIBadge, Callout, StatusBadge } from "./kit";
import { cn } from "@/lib/utils";

const ICON: Record<CheckStatus, { I: typeof Info; cls: string; label: string }> = {
  pass: { I: CheckCircle2, cls: "text-success", label: "Passed" },
  info: { I: Info, cls: "text-info", label: "Info" },
  warning: { I: AlertTriangle, cls: "text-warning", label: "Warning" },
  conflict: { I: XCircle, cls: "text-danger", label: "Conflict" },
};

export function ImpactReview({
  result,
  ack,
  setAck,
}: {
  result: ImpactResult;
  ack: boolean;
  setAck: (v: boolean) => void;
}) {
  const count = (s: CheckStatus) => result.checks.filter((c) => c.status === s).length;
  const tone = { Safe: "success", Info: "info", Warning: "warning", Conflict: "danger" } as const;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AIBadge label="AI Change-Impact Review" />
          <StatusBadge status={result.overall} tone={tone[result.overall]} />
        </div>
        <p className="text-sm font-medium">
          {count("pass")} passed · {count("info")} info · {count("warning")} warning
          {count("warning") === 1 ? "" : "s"} · {count("conflict")} conflict
          {count("conflict") === 1 ? "" : "s"}
        </p>
      </div>
      <ul className="divide-y rounded-xl border">
        {result.checks.map((c) => {
          const m = ICON[c.status];
          return (
            <li
              key={c.label}
              className={cn(
                "flex items-start gap-3 px-4 py-2.5",
                c.status === "conflict" && "bg-danger-soft/50",
                c.status === "warning" && "bg-warning-soft/50",
              )}
            >
              <m.I className={cn("mt-0.5 h-4 w-4 shrink-0", m.cls)} aria-label={m.label} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{c.label}</p>
                <p className="text-xs text-muted-foreground">{c.detail}</p>
              </div>
              <span className={cn("text-xs font-semibold", m.cls)}>{m.label}</span>
            </li>
          );
        })}
      </ul>
      {result.overall === "Conflict" && (
        <Callout tone="danger" title="Confirmation blocked">
          Resolve all conflicts before this schedule can be confirmed.
          {result.guidance && (
            <p className="mt-1">
              <b>Resolution guidance:</b> {result.guidance}
            </p>
          )}
        </Callout>
      )}
      {result.overall === "Warning" && (
        <Callout tone="warning" title="Acknowledgement required">
          {result.guidance && <p className="mb-2">{result.guidance}</p>}
          <label className="flex items-center gap-2 font-medium">
            <Checkbox checked={ack} onCheckedChange={(v) => setAck(!!v)} /> I have reviewed the
            warnings and accept responsibility for proceeding.
          </label>
        </Callout>
      )}
      {result.overall === "Safe" && (
        <Callout tone="success" title="No issues found">
          You may proceed to confirm. Final confirmation is still a human decision.
        </Callout>
      )}
      {result.overall === "Info" && (
        <Callout tone="info" title="Informational notes only">
          Review the notes above, then proceed.
        </Callout>
      )}
      <p className="text-xs text-muted-foreground">
        AI checks support review only. The AI cannot resolve, approve, or finalize schedules.
      </p>
    </div>
  );
}

export const impactBlocks = (r: ImpactResult | null, ack: boolean) =>
  !r || r.overall === "Conflict" || (r.overall === "Warning" && !ack);
