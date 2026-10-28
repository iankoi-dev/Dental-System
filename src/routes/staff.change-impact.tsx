import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Play } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader, Panel, Restricted, StatusBadge } from "@/components/app/kit";
import { ImpactReview, impactBlocks } from "@/components/app/ImpactReview";
import { IMPACT_SCENARIOS, wait } from "@/lib/mock-service";
import { useStore } from "@/lib/store";
import { can } from "@/lib/permissions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/staff/change-impact")({
  head: () => ({
    meta: [
      { title: "Change-Impact Review — Dentriq" },
      {
        name: "description",
        content: "AI change-impact analysis before schedule changes are finalized.",
      },
      { property: "og:title", content: "Change-Impact Review — Dentriq" },
      { property: "og:description", content: "AI change-impact analysis." },
    ],
  }),
  component: Page,
});

function Page() {
  const { role, log } = useStore();
  const [sel, setSel] = useState(IMPACT_SCENARIOS[3].id);
  const [running, setRunning] = useState(false);
  const [shown, setShown] = useState<string | null>(null);
  const [ack, setAck] = useState(false);
  if (!can(role, "impact")) return <Restricted what="change-impact review" />;
  const sc = IMPACT_SCENARIOS.find((s) => s.id === sel)!;
  const tone = { Safe: "success", Info: "info", Warning: "warning", Conflict: "danger" } as const;

  return (
    <>
      <PageHeader
        title="Change-Impact Review"
        description="Every new or modified follow-up is checked against ten scheduling factors before a human confirms it."
        crumbs={[{ label: "Change-Impact Review" }]}
      />
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <Panel title="Pending schedule changes">
          <ul className="space-y-2">
            {IMPACT_SCENARIOS.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => {
                    setSel(s.id);
                    setShown(null);
                    setAck(false);
                  }}
                  aria-pressed={sel === s.id}
                  className={cn(
                    "w-full rounded-xl border p-3 text-left transition hover:border-primary",
                    sel === s.id && "border-primary bg-primary-soft",
                  )}
                >
                  <div className="flex justify-between gap-2">
                    <p className="text-sm font-semibold">{s.title}</p>
                    <StatusBadge status={s.result.overall} tone={tone[s.result.overall]} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {s.draft.date} {s.draft.start} · {s.draft.dentist} · {s.draft.chair}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel
          title={sc.title}
          action={
            <Button
              size="sm"
              onClick={async () => {
                setRunning(true);
                setShown(null);
                await wait(1200);
                setRunning(false);
                setShown(sc.id);
              }}
              disabled={running}
            >
              {running ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Play className="mr-1.5 h-4 w-4" />
              )}
              Run review
            </Button>
          }
        >
          <dl className="mb-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            {(["procedure", "date", "dentist", "chair"] as const).map((k) => (
              <div key={k}>
                <dt className="text-xs capitalize text-muted-foreground">{k}</dt>
                <dd className="font-medium">{sc.draft[k]}</dd>
              </div>
            ))}
          </dl>
          {running && (
            <div className="flex items-center gap-2 rounded-xl bg-ai-soft p-4 text-sm">
              <Loader2 className="h-4 w-4 animate-spin text-ai" />
              Checking patient, staff, chairs, rooms, equipment, dependencies, inventory and
              capacity…
            </div>
          )}
          {shown === sc.id && (
            <>
              <ImpactReview result={sc.result} ack={ack} setAck={setAck} />
              <div className="mt-4 flex justify-end gap-2 border-t pt-4">
                <Button variant="outline" onClick={() => toast("Returned to schedule editor")}>
                  Edit schedule
                </Button>
                <Button
                  disabled={impactBlocks(sc.result, ack)}
                  onClick={() => {
                    log(
                      "Schedule confirmed",
                      "Schedules",
                      sc.id,
                      `Change-impact: ${sc.result.overall}`,
                    );
                    toast.success("Schedule change confirmed");
                  }}
                >
                  Confirm schedule change
                </Button>
              </div>
            </>
          )}
          {!running && shown !== sc.id && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Run the review to see each check.
            </p>
          )}
        </Panel>
      </div>
    </>
  );
}
