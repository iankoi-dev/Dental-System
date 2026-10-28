import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { History, Info, ShieldCheck } from "lucide-react";
import { PatientPortalShell } from "@/components/app/PatientPortalShell";
import { Empty, Panel, StatusBadge } from "@/components/app/kit";
import { CONDITION_META, getTeethFor, UPPER, LOWER } from "@/lib/mock-data";

export const Route = createFileRoute("/patient/tooth-history")({
  head: () => ({
    meta: [
      { title: "Tooth History — Dentriq" },
      { name: "description", content: "Information-only tooth history." },
    ],
  }),
  component: ToothHistory,
});

const TEETH = [
  {
    number: "16",
    name: "Upper right first molar",
    condition: "Treated",
    tone: "info" as const,
    note: "Filling completed during the last visit.",
  },
  {
    number: "26",
    name: "Upper left first molar",
    condition: "For review",
    tone: "warning" as const,
    note: "Discuss sensitivity with your dentist at the next visit.",
  },
  {
    number: "36",
    name: "Lower left first molar",
    condition: "Healthy",
    tone: "success" as const,
    note: "No treatment recorded.",
  },
];

function ToothHistory() {
  const teeth = getTeethFor("P-1001");
  const [selected, setSelected] = useState(26);
  const tooth = teeth[selected];
  return (
    <PatientPortalShell
      title="Tooth history"
      description="Select a tooth to review the clinical information shared by your care team."
    >
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Panel title="Tooth map">
          <div className="mb-4 flex flex-wrap gap-2" aria-label="Tooth condition legend">
            {Object.entries(CONDITION_META).map(([key, meta]) => (
              <StatusBadge key={key} status={meta.label} tone={meta.tone} />
            ))}
          </div>
          <div className="space-y-3" role="group" aria-label="Selectable teeth">
            {[UPPER, LOWER].map((row) => (
              <div key={row[0]} className="grid grid-cols-8 gap-1.5">
                {row.map((number) => {
                  const record = teeth[number];
                  const meta = CONDITION_META[record.condition];
                  return (
                    <button
                      key={number}
                      type="button"
                      onClick={() => setSelected(number)}
                      aria-pressed={selected === number}
                      aria-label={`Tooth ${number}, ${meta.label}`}
                      className={`rounded-lg border p-2 text-center text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${selected === number ? "border-primary bg-primary-soft text-primary" : "bg-card hover:bg-muted"}`}
                    >
                      <span className="block text-sm">{number}</span>
                      <span className="sr-only">{meta.label}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            The diagram is simplified for portal viewing. Labels accompany every color-coded
            condition.
          </p>
        </Panel>
        {tooth ? (
          <Panel
            title={
              <span className="flex items-center gap-2">
                <History className="h-4 w-4 text-primary" /> Tooth {tooth.number}
              </span>
            }
          >
            <StatusBadge
              status={CONDITION_META[tooth.condition].label}
              tone={CONDITION_META[tooth.condition].tone}
            />
            <h2 className="mt-3 font-semibold">{tooth.diagnosis}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{tooth.notes}</p>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Plan</dt>
                <dd>{tooth.plan}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Recommendation</dt>
                <dd>{tooth.recommendation}</dd>
              </div>
            </dl>
            {tooth.history.length ? (
              <div className="mt-5 space-y-3 border-t pt-4">
                {tooth.history.map((event) => (
                  <div key={`${event.date}-${event.type}`}>
                    <p className="text-sm font-medium">
                      {event.type} · {event.date}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {event.note} · {event.by}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <Empty
                icon={History}
                title="No tooth-specific history"
                body="No treatment event has been recorded for this tooth."
              />
            )}
          </Panel>
        ) : (
          <Empty icon={History} title="No tooth record" />
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-muted/50 p-4">
          <Info className="h-4 w-4 text-primary" />
          <p className="mt-2 text-sm">Follow the care instructions provided by your clinic.</p>
        </div>
        <div className="rounded-xl bg-muted/50 p-4">
          <ShieldCheck className="h-4 w-4 text-success" />
          <p className="mt-2 text-sm">Only authorized clinic staff can update this history.</p>
        </div>
      </div>
    </PatientPortalShell>
  );
}
