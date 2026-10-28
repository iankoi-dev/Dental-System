import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
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
  Boxes,
  CalendarClock,
  ClipboardList,
  Database,
  FileBarChart,
  ListOrdered,
  Package,
  PackageX,
  ScanLine,
  ShieldCheck,
  Smile,
  Timer,
  TrendingUp,
  UserPlus,
  Users,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Callout,
  DataTable,
  PageHeader,
  Panel,
  StatCard,
  StatusBadge,
  Td,
  AIBadge,
} from "@/components/app/kit";
import { ScheduleDialog } from "@/components/app/ScheduleDialog";
import { useStore } from "@/lib/store";
import {
  AUDIT,
  DEMAND_TREND,
  FLOW_TREND,
  MOVEMENTS,
  RESOURCES,
  ROLE_LABELS,
} from "@/lib/mock-data";
import { getInventoryForecast, itemName } from "@/lib/mock-service";

export const Route = createFileRoute("/staff/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Dentriq" },
      { name: "description", content: "Role-based clinic dashboard." },
      { property: "og:title", content: "Dashboard — Dentriq" },
      { property: "og:description", content: "Role-based clinic dashboard." },
    ],
  }),
  component: Dashboard,
});

function useStats() {
  const { patients, queue, schedules, batches } = useStore();
  const upcoming = schedules.filter(
    (s) => s.date >= "2026-10-19" && !["Completed", "Cancelled"].includes(s.status),
  );
  return {
    active: patients.filter((p) => p.portal !== "Deactivated").length,
    walkIns: queue.filter((q) => q.type === "Walk-in").length,
    activeQueue: queue.filter((q) => ["Waiting", "Called", "In Service"].includes(q.status)).length,
    upcoming,
    low: batches.filter((b) => b.status === "Low Stock").length,
    near: batches.filter((b) => b.status === "Near Expiry").length,
    expired: batches.filter((b) => b.status === "Expired").length,
    unavailable: batches.filter((b) => ["Damaged", "Recalled", "Unavailable"].includes(b.status))
      .length,
    reserved: batches.reduce((a, b) => a + b.reserved, 0),
    batches,
  };
}

function Dashboard() {
  const { role, user } = useStore();
  const [sched, setSched] = useState(false);
  return (
    <>
      <PageHeader
        title={`Good morning, ${user!.name.split(" ").slice(0, 2).join(" ")}`}
        description={`${ROLE_LABELS[role!]} dashboard · Monday, October 19, 2026`}
        crumbs={[{ label: ROLE_LABELS[role!] }]}
      />
      {role === "admin" && <Admin />}
      {role === "dentist" && <Dentist onSchedule={() => setSched(true)} />}
      {role === "receptionist" && <Reception onSchedule={() => setSched(true)} />}
      {role === "inventory" && <Inventory />}
      {role === "management" && <Management />}
      {sched && <ScheduleDialog open={sched} onOpenChange={setSched} />}
    </>
  );
}

function QuickActions({
  items,
}: {
  items: { label: string; to: string; icon: typeof Users; onClick?: () => void }[];
}) {
  return (
    <Panel title="Quick actions">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((i) =>
          i.onClick ? (
            <button
              key={i.label}
              onClick={i.onClick}
              className="flex flex-col items-start gap-2 rounded-xl border p-3 text-left text-sm font-medium transition hover:border-primary hover:bg-primary-soft"
            >
              <i.icon className="h-4 w-4 text-primary" />
              {i.label}
            </button>
          ) : (
            <Link
              key={i.label}
              to={i.to}
              className="flex flex-col items-start gap-2 rounded-xl border p-3 text-sm font-medium transition hover:border-primary hover:bg-primary-soft"
            >
              <i.icon className="h-4 w-4 text-primary" />
              {i.label}
            </Link>
          ),
        )}
      </div>
    </Panel>
  );
}

function UpcomingTable() {
  const { upcoming } = useStats();
  return (
    <DataTable head={["Date", "Time", "Patient", "Procedure", "Dentist", "Status"]}>
      {upcoming.slice(0, 6).map((s) => (
        <tr key={s.id}>
          <Td>{s.date}</Td>
          <Td>{s.start}</Td>
          <Td className="font-medium">{s.patient}</Td>
          <Td>{s.procedure}</Td>
          <Td>{s.dentist}</Td>
          <Td>
            <StatusBadge status={s.status} />
          </Td>
        </tr>
      ))}
    </DataTable>
  );
}

function QueueMini() {
  const { queue } = useStore();
  return (
    <ul className="space-y-2">
      {queue
        .filter((q) => !["Completed", "Cancelled"].includes(q.status))
        .map((q) => (
          <li
            key={q.id}
            className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm"
          >
            <span>
              <b className="mr-2 text-primary">#{q.no}</b>
              {q.patient}
              <span className="ml-2 text-xs text-muted-foreground">
                {q.type} · {q.arrival}
              </span>
            </span>
            <StatusBadge status={q.status} />
          </li>
        ))}
    </ul>
  );
}

function Admin() {
  const s = useStats();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Active patients" value={s.active} icon={Users} />
        <StatCard label="Today's walk-ins" value={s.walkIns} icon={UserPlus} tone="info" />
        <StatCard label="Active queue" value={s.activeQueue} icon={ListOrdered} tone="info" />
        <StatCard label="Upcoming follow-ups" value={s.upcoming.length} icon={CalendarClock} />
        <StatCard label="Available chairs" value="2 / 4" icon={Wrench} tone="success" />
        <StatCard label="Low-stock items" value={s.low} icon={Package} tone="warning" />
        <StatCard label="Near-expiry batches" value={s.near} icon={Timer} tone="warning" />
        <StatCard label="System alerts" value={3} icon={AlertTriangle} tone="danger" />
      </div>
      <QuickActions
        items={[
          { label: "Add staff account", to: "/admin/users", icon: UserPlus },
          { label: "Manage roles", to: "/admin/roles", icon: ShieldCheck },
          { label: "View audit logs", to: "/staff/audit-logs", icon: ClipboardList },
          { label: "Backup and recovery", to: "/admin/backup", icon: Database },
          { label: "View reports", to: "/staff/reports", icon: FileBarChart },
        ]}
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Recent activity" className="lg:col-span-2">
          <ul className="space-y-3">
            {AUDIT.slice(0, 7).map((a) => (
              <li key={a.id} className="flex items-start justify-between gap-3 text-sm">
                <div>
                  <p className="font-medium">
                    {a.action} · <span className="text-muted-foreground">{a.module}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {a.user} — {a.details}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{a.ts.slice(5)}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="System status">
          <ul className="space-y-3 text-sm">
            {[
              ["User accounts", "8 total · 6 active", "Active"],
              ["Roles", "6 configured", "Active"],
              ["Active sessions", "4 staff · 1 patient", "Active"],
              ["Last backup", "Today 02:00", "Verified"],
              ["Audit logging", "Recording", "Active"],
            ].map(([a, b, c]) => (
              <li key={a} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{a}</p>
                  <p className="text-xs text-muted-foreground">{b}</p>
                </div>
                <StatusBadge status={c} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

function Dentist({ onSchedule }: { onSchedule: () => void }) {
  const s = useStats();
  const { schedules, patients } = useStore();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="My follow-ups this week"
          value={s.upcoming.filter((x) => x.dentist === "Dr. Andrea Cruz").length}
          icon={CalendarClock}
        />
        <StatCard label="Active queue" value={s.activeQueue} icon={ListOrdered} tone="info" />
        <StatCard
          label="Needs review"
          value={schedules.filter((x) => x.status === "Needs Review").length}
          icon={AlertTriangle}
          tone="warning"
        />
        <StatCard label="Inventory alerts" value={s.low + s.near} icon={Package} tone="warning" />
      </div>
      <QuickActions
        items={[
          { label: "Open patient record", to: "/staff/patients", icon: Users },
          { label: "Open 3D odontogram", to: "/staff/odontogram/P-1001", icon: Smile },
          { label: "Create follow-up", to: "", icon: CalendarClock, onClick: onSchedule },
          { label: "Review schedule change", to: "/staff/change-impact", icon: ShieldCheck },
          { label: "Inventory alerts", to: "/staff/inventory", icon: PackageX },
        ]}
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Today & upcoming follow-ups" className="lg:col-span-2">
          <UpcomingTable />
        </Panel>
        <Panel title="Active queue">
          <QueueMini />
        </Panel>
        <Panel title="Recent patient records">
          <ul className="space-y-2">
            {patients.slice(0, 5).map((p) => (
              <li key={p.id}>
                <Link
                  to="/staff/patients/$id"
                  params={{ id: p.id }}
                  className="flex justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-muted"
                >
                  <span className="font-medium">{p.name}</span>
                  <span className="text-xs text-muted-foreground">{p.lastVisit}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Resource availability">
          <ul className="space-y-2 text-sm">
            {RESOURCES.chairs.map((c) => (
              <li key={c.name} className="flex justify-between">
                <span>{c.name}</span>
                <StatusBadge status={c.status} />
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Inventory alerts for scheduled procedures">
          <div className="space-y-2">
            <Callout tone="warning" title="Gutta-percha points — low">
              Needed for S-2101 (Oct 21). 4 boxes left.
            </Callout>
            <Callout tone="warning" title="Resin cement — low">
              Needed for S-2102 (Oct 21). 2 kits left.
            </Callout>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Reception({ onSchedule }: { onSchedule: () => void }) {
  const s = useStats();
  return (
    <div className="space-y-6">
      <Callout tone="primary" title="Follow-up scheduling policy">
        Follow-up schedules are arranged only by dentists or authorized clinic staff. Patients
        cannot book or change schedules.
      </Callout>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Walk-ins today" value={s.walkIns} icon={UserPlus} />
        <StatCard label="Active queue" value={s.activeQueue} icon={ListOrdered} tone="info" />
        <StatCard label="Pending OCR reviews" value={2} icon={ScanLine} tone="warning" />
        <StatCard label="Upcoming follow-ups" value={s.upcoming.length} icon={CalendarClock} />
      </div>
      <QuickActions
        items={[
          { label: "Register patient", to: "/staff/registration", icon: UserPlus },
          { label: "Upload registration form", to: "/staff/registration", icon: ScanLine },
          { label: "Manage queue", to: "/staff/queue", icon: ListOrdered },
          { label: "Create follow-up", to: "", icon: CalendarClock, onClick: onSchedule },
          { label: "Search patient", to: "/staff/patients", icon: Users },
        ]}
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel
          title="Today's walk-in queue"
          action={
            <Button asChild size="sm" variant="outline">
              <Link to="/staff/queue">Open queue</Link>
            </Button>
          }
        >
          <QueueMini />
        </Panel>
        <Panel title="Pending OCR reviews">
          <ul className="space-y-2 text-sm">
            {[
              "scan_1019_0931.jpg — 3 low-confidence fields",
              "photo_1019_0948.jpg — missing allergies",
            ].map((x) => (
              <li key={x} className="flex items-center justify-between gap-2 rounded-lg border p-3">
                <span>{x}</span>
                <Button asChild size="sm">
                  <Link to="/staff/registration">Review</Link>
                </Button>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Upcoming dentist-arranged follow-ups">
          <ul className="space-y-2 text-sm">
            {s.upcoming.slice(0, 5).map((x) => (
              <li key={x.id} className="flex justify-between gap-2">
                <span>
                  <b>
                    {x.date.slice(5)} {x.start}
                  </b>{" "}
                  {x.patient}
                </span>
                <StatusBadge status={x.status} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

function Inventory() {
  const s = useStats();
  const fc = getInventoryForecast(s.batches);
  const fifo = [...s.batches]
    .filter((b) => !["Expired", "Damaged", "Recalled"].includes(b.status) && b.remaining > 0)
    .sort((a, b) => a.received.localeCompare(b.received))
    .slice(0, 5);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7">
        <StatCard label="Total items" value={15} icon={Package} />
        <StatCard label="Total batches" value={s.batches.length} icon={Boxes} />
        <StatCard label="Low stock" value={s.low} icon={AlertTriangle} tone="warning" />
        <StatCard label="Near expiry" value={s.near} icon={Timer} tone="warning" />
        <StatCard label="Expired" value={s.expired} icon={PackageX} tone="danger" />
        <StatCard label="Unavailable" value={s.unavailable} icon={PackageX} tone="neutral" />
        <StatCard label="Reserved units" value={s.reserved} icon={CalendarClock} tone="info" />
      </div>
      <QuickActions
        items={[
          { label: "Add inventory item", to: "/staff/inventory", icon: Package },
          { label: "Receive stock", to: "/staff/inventory/batches", icon: Boxes },
          { label: "Manage batches", to: "/staff/inventory/batches", icon: Boxes },
          { label: "Record consumption", to: "/staff/inventory/batches", icon: PackageX },
          { label: "View forecast", to: "/staff/inventory/forecasts", icon: TrendingUp },
        ]}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="FIFO batch queue (next to use)">
          <DataTable head={["Pos.", "Batch", "Item", "Received", "Remaining"]}>
            {fifo.map((b, i) => (
              <tr key={b.id}>
                <Td>{i + 1}</Td>
                <Td className="font-mono text-xs">{b.id}</Td>
                <Td>{itemName(b.itemId)}</Td>
                <Td>{b.received}</Td>
                <Td>{b.remaining}</Td>
              </tr>
            ))}
          </DataTable>
        </Panel>
        <Panel title="Recent stock movements">
          <ul className="space-y-2 text-sm">
            {MOVEMENTS.map((m) => (
              <li key={m.id} className="flex justify-between gap-2">
                <span>
                  {m.item} <span className="text-xs text-muted-foreground">({m.batch})</span>
                </span>
                <span className="flex items-center gap-2">
                  <StatusBadge status={m.type} tone={m.qty > 0 ? "success" : "neutral"} />
                  <b>{m.qty > 0 ? `+${m.qty}` : m.qty}</b>
                </span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel
          title={
            <span className="flex items-center gap-2">
              Forecast preview <AIBadge />
            </span>
          }
          className="lg:col-span-2"
        >
          <div className="grid gap-2 md:grid-cols-3">
            {fc.slice(0, 3).map((f) => (
              <div key={f.itemId} className="rounded-xl border p-3">
                <div className="flex justify-between">
                  <p className="text-sm font-semibold">{f.item}</p>
                  <StatusBadge status={f.risk} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{f.action}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Management() {
  const s = useStats();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <StatCard label="Patients this week" value={92} icon={Users} hint="+8% vs last week" />
        <StatCard label="Follow-ups scheduled" value={s.upcoming.length} icon={CalendarClock} />
        <StatCard label="Chair utilization" value="78%" icon={Wrench} tone="info" />
        <StatCard label="Inventory risks" value={4} icon={Package} tone="warning" />
        <StatCard label="Open alerts" value={3} icon={AlertTriangle} tone="danger" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Walk-ins vs follow-ups (this week)">
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={FLOW_TREND}>
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
        </Panel>
        <Panel
          title={
            <span className="flex items-center gap-2">
              Projected stock vs demand <AIBadge label="Advisory" />
            </span>
          }
        >
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
                  fillOpacity={0.15}
                />
                <Area
                  dataKey="demand"
                  name="Demand"
                  stroke="var(--chart-3)"
                  fill="var(--chart-3)"
                  fillOpacity={0.15}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Resource utilization">
          <ul className="space-y-3 text-sm">
            {[
              ["Chair 1", 86],
              ["Chair 2", 91],
              ["Chair 3", 34],
              ["Chair 4", 72],
              ["Surgery Room", 48],
            ].map(([n, v]) => (
              <li key={n}>
                <div className="flex justify-between">
                  <span>{n}</span>
                  <span className="font-semibold">{v}%</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${v}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Authorized reports">
          <div className="grid grid-cols-2 gap-2">
            {[
              "Patient Flow",
              "Follow-Up Schedules",
              "Resource Utilization",
              "Inventory Forecast",
            ].map((r) => (
              <Link
                key={r}
                to="/staff/reports"
                className="rounded-xl border p-3 text-sm font-medium hover:border-primary hover:bg-primary-soft"
              >
                <FileBarChart className="mb-1 h-4 w-4 text-primary" />
                {r}
              </Link>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
