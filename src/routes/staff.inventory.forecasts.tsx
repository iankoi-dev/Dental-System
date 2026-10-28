import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  CalendarClock,
  ClipboardList,
  History,
  Package,
  Ticket,
  Timer,
  TrendingDown,
} from "lucide-react";
import {
  AIBadge,
  Callout,
  DataTable,
  PageHeader,
  Panel,
  Restricted,
  StatCard,
  StatusBadge,
  Td,
} from "@/components/app/kit";
import { DEMAND_TREND } from "@/lib/mock-data";
import { getInventoryForecast } from "@/lib/mock-service";
import { useStore } from "@/lib/store";
import { can } from "@/lib/permissions";

export const Route = createFileRoute("/staff/inventory/forecasts")({
  head: () => ({
    meta: [
      { title: "Inventory Forecast — Dentriq" },
      { name: "description", content: "Advisory AI inventory forecasts." },
      { property: "og:title", content: "Inventory Forecast — Dentriq" },
      { property: "og:description", content: "Advisory AI inventory forecasts." },
    ],
  }),
  component: Forecast,
});

function Forecast() {
  const { role, batches } = useStore();
  if (!can(role, "forecast")) return <Restricted what="inventory forecasts" />;
  const fc = getInventoryForecast(batches);
  return (
    <>
      <PageHeader
        title="AI Inventory Forecast"
        description="Advisory estimates of demand and shortage risk for the next 6 weeks."
        crumbs={[{ label: "Inventory", to: "/staff/inventory" }, { label: "Forecast" }]}
        actions={<AIBadge label="Advisory estimate" />}
      />
      <Callout tone="info" className="mb-6">
        Forecast results are decision-support estimates and depend on the accuracy and completeness
        of clinic data.
      </Callout>
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="Shortage risks"
          value={fc.filter((f) => f.risk === "Critical" || f.risk === "High").length}
          icon={TrendingDown}
          tone="danger"
        />
        <StatCard
          label="Likely to run low"
          value={fc.filter((f) => f.risk === "Moderate").length}
          icon={AlertTriangle}
          tone="warning"
        />
        <StatCard
          label="Expiry concerns"
          value={batches.filter((b) => b.status === "Near Expiry").length}
          icon={Timer}
          tone="warning"
        />
        <StatCard label="Review actions" value={fc.length} icon={ClipboardList} />
      </div>
      <Panel title="Forecast inputs" className="mb-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {[
            [CalendarClock, "Upcoming follow-ups", "8"],
            [ClipboardList, "Treatment plans", "3"],
            [History, "Historical usage", "12 wks"],
            [Package, "Current stock", `${batches.length} batches`],
            [Ticket, "Reservations", `${batches.reduce((a, b) => a + b.reserved, 0)} units`],
            [AlertTriangle, "Reorder levels", "15 items"],
            [Timer, "Expiry status", "3 near"],
          ].map(([I, l, v]) => {
            const Icon = I as typeof Package;
            return (
              <div key={l as string} className="rounded-xl border bg-muted/40 p-3">
                <Icon className="h-4 w-4 text-primary" />
                <p className="mt-1 text-xs text-muted-foreground">{l as string}</p>
                <p className="text-sm font-semibold">{v as string}</p>
              </div>
            );
          })}
        </div>
      </Panel>
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Projected stock depletion (all tracked units)">
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={DEMAND_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="week" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Area
                  dataKey="stock"
                  name="Projected stock"
                  stroke="var(--chart-1)"
                  fill="var(--chart-1)"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Upcoming demand by item">
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={fc}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="item"
                  fontSize={10}
                  interval={0}
                  tickFormatter={(v: string) => v.split(" ")[0]}
                />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar
                  dataKey="demand"
                  name="Projected demand"
                  fill="var(--chart-3)"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="current"
                  name="Current stock"
                  fill="var(--chart-1)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
      <DataTable
        head={[
          "Item",
          "Current stock",
          "Reserved",
          "Projected demand",
          "Projected remaining",
          "Risk",
          "Recommended review action",
        ]}
      >
        {fc.map((f) => (
          <tr key={f.itemId}>
            <Td className="font-medium">{f.item}</Td>
            <Td>{f.current}</Td>
            <Td>{f.reserved}</Td>
            <Td>{f.demand}</Td>
            <Td className={f.remaining < 0 ? "font-bold text-danger" : "font-semibold"}>
              {f.remaining}
            </Td>
            <Td>
              <StatusBadge status={f.risk} />
            </Td>
            <Td className="whitespace-normal text-xs">{f.action}</Td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}
