import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download, FileText, Loader2, Printer, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DataTable,
  PageHeader,
  Panel,
  Restricted,
  StatCard,
  Td,
  selectCls,
} from "@/components/app/kit";
import { FLOW_TREND } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { can } from "@/lib/permissions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/staff/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Dentriq" },
      { name: "description", content: "Operational reports with export." },
      { property: "og:title", content: "Reports — Dentriq" },
      { property: "og:description", content: "Operational reports." },
    ],
  }),
  component: Reports,
});

const CATS = [
  "Patient Flow",
  "Walk-In Queue",
  "Follow-Up Schedules",
  "Resource Utilization",
  "Inventory Stock",
  "Inventory Expiry",
  "Material Consumption",
  "Inventory Forecast",
  "User Activity",
  "Audit Summary",
];
const VIS: Record<string, string[]> = {
  admin: CATS,
  management: CATS.slice(0, 8),
  dentist: ["Patient Flow", "Follow-Up Schedules", "Resource Utilization", "Material Consumption"],
  inventory: ["Inventory Stock", "Inventory Expiry", "Material Consumption", "Inventory Forecast"],
};

function Reports() {
  const { role } = useStore();
  const allowed = VIS[role ?? ""] ?? [];
  const [cat, setCat] = useState(allowed[0]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  if (!can(role, "reports")) return <Restricted what="reports" />;
  const rows = FLOW_TREND.map((d, i) => ({
    ...d,
    date: `2026-10-${13 + i}`,
    avgWait: 12 + ((i * 7) % 11),
    completed: d.walkIns + d.followUps - (i % 3),
  })).filter((r) => r.date.includes(q) || r.day.toLowerCase().includes(q.toLowerCase()));
  const exp = async (k: string) => {
    setBusy(k);
    await new Promise((r) => setTimeout(r, 900));
    setBusy(null);
    toast.success(`Report exported successfully (${k}).`);
  };

  return (
    <>
      <PageHeader
        title="Reports"
        description="Generate, preview and export operational reports. Only reports permitted for your role are shown."
        crumbs={[{ label: "Reports" }]}
      />
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <nav aria-label="Report categories" className="space-y-1">
          {CATS.map((c) => {
            const ok = allowed.includes(c);
            return (
              <button
                key={c}
                disabled={!ok}
                onClick={() => setCat(c)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium",
                  cat === c
                    ? "bg-primary-soft text-primary"
                    : ok
                      ? "hover:bg-muted"
                      : "cursor-not-allowed text-muted-foreground/50",
                )}
                title={ok ? undefined : "Not available for your role"}
              >
                <FileText className="h-4 w-4" />
                {c}
              </button>
            );
          })}
        </nav>
        <div className="space-y-4">
          <div className="flex flex-wrap items-end gap-2 rounded-2xl border bg-card p-3">
            <label className="text-xs font-medium">
              From
              <Input type="date" defaultValue="2026-10-13" className="mt-1" />
            </label>
            <label className="text-xs font-medium">
              To
              <Input type="date" defaultValue="2026-10-19" className="mt-1" />
            </label>
            <label className="text-xs font-medium">
              Role
              <select className={selectCls + " mt-1"}>
                <option>All roles</option>
                <option>Dentist</option>
                <option>Receptionist</option>
              </select>
            </label>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search report rows"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Search report"
              />
            </div>
            <Button onClick={() => toast.success("Report generated")}>Generate report</Button>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard label="Total walk-ins" value={92} icon={FileText} />
            <StatCard label="Follow-ups" value={39} icon={FileText} tone="info" />
            <StatCard label="Avg. wait" value="16 min" icon={FileText} tone="warning" />
            <StatCard label="Completion rate" value="94%" icon={FileText} tone="success" />
          </div>
          <Panel
            title={`${cat} — preview`}
            action={
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => window.print()}>
                  <Printer className="mr-1 h-3.5 w-3.5" />
                  Print
                </Button>
                <Button size="sm" variant="outline" onClick={() => exp("CSV")}>
                  {busy === "CSV" ? (
                    <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Download className="mr-1 h-3.5 w-3.5" />
                  )}
                  CSV
                </Button>
                <Button size="sm" onClick={() => exp("PDF")}>
                  {busy === "PDF" ? (
                    <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Download className="mr-1 h-3.5 w-3.5" />
                  )}
                  PDF
                </Button>
              </div>
            }
          >
            <div className="mb-4 h-56">
              <ResponsiveContainer>
                <BarChart data={rows}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar
                    dataKey="walkIns"
                    name="Walk-ins"
                    fill="var(--chart-1)"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="followUps"
                    name="Follow-ups"
                    fill="var(--chart-2)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <DataTable
              head={["Date", "Day", "Walk-ins", "Follow-ups", "Completed", "Avg wait (min)"]}
            >
              {rows.map((r) => (
                <tr key={r.date}>
                  <Td>{r.date}</Td>
                  <Td>{r.day}</Td>
                  <Td>{r.walkIns}</Td>
                  <Td>{r.followUps}</Td>
                  <Td>{r.completed}</Td>
                  <Td>{r.avgWait}</Td>
                </tr>
              ))}
            </DataTable>
          </Panel>
        </div>
      </div>
    </>
  );
}
