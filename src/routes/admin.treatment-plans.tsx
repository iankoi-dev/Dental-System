import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown } from "lucide-react";
import { PageHeader, Panel, Restricted, StatusBadge } from "@/components/app/kit";
import { TREATMENT_PLANS } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { can } from "@/lib/permissions";

export const Route = createFileRoute("/admin/treatment-plans")({
  head: () => ({
    meta: [
      { title: "Treatment Plans — Dentriq" },
      { name: "description", content: "Treatment stages, dependencies and required intervals." },
      { property: "og:title", content: "Treatment Plans — Dentriq" },
      { property: "og:description", content: "Treatment plan sequencing." },
    ],
  }),
  component: Plans,
});

function Plans() {
  const { role } = useStore();
  if (!can(role, "plans")) return <Restricted what="treatment plans" />;
  return (
    <>
      <PageHeader
        title="Treatment Plans"
        description="Tooth-specific stage sequences with prerequisites and required intervals. Used by the change-impact review."
        crumbs={[{ label: "Treatment Plans" }]}
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {TREATMENT_PLANS.map((p) => (
          <Panel
            key={p.id}
            title={
              <span>
                {p.patient}{" "}
                <span className="text-sm font-normal text-muted-foreground">· tooth {p.tooth}</span>
              </span>
            }
          >
            <ol className="space-y-1">
              {p.stages.map((s, i) => (
                <li key={s.name}>
                  <div className="rounded-xl border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold">
                        {i + 1}. {s.name}
                      </p>
                      <StatusBadge status={s.status} />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Prerequisite: {s.prereq}</p>
                    <p className="text-xs text-muted-foreground">Interval: {s.interval}</p>
                  </div>
                  {i < p.stages.length - 1 && (
                    <ArrowDown className="mx-auto my-1 h-4 w-4 text-muted-foreground" />
                  )}
                </li>
              ))}
            </ol>
          </Panel>
        ))}
      </div>
    </>
  );
}
