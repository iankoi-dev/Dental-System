import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Search, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DataTable,
  Empty,
  PageHeader,
  Restricted,
  StatusBadge,
  Td,
  selectCls,
} from "@/components/app/kit";
import { useStore } from "@/lib/store";
import { can } from "@/lib/permissions";

export const Route = createFileRoute("/staff/patients/")({
  head: () => ({
    meta: [
      { title: "Patients — Dentriq" },
      { name: "description", content: "Search and manage patient records." },
      { property: "og:title", content: "Patients — Dentriq" },
      { property: "og:description", content: "Search and manage patient records." },
    ],
  }),
  component: Patients,
});

function Patients() {
  const { patients, role } = useStore();
  const [q, setQ] = useState("");
  const [portal, setPortal] = useState("all");
  const [alerts, setAlerts] = useState("all");
  const [recent, setRecent] = useState(false);
  const rows = useMemo(
    () =>
      patients.filter(
        (p) =>
          (p.name + p.id).toLowerCase().includes(q.toLowerCase()) &&
          (portal === "all" || p.portal === portal) &&
          (alerts === "all" || (alerts === "yes" ? p.alerts.length > 0 : p.alerts.length === 0)) &&
          (!recent || p.lastVisit >= "2026-10-12"),
      ),
    [patients, q, portal, alerts, recent],
  );
  if (!can(role, "patients")) return <Restricted what="patient records" />;
  return (
    <>
      <PageHeader
        title="Patients"
        description="Verified patient records. Select a patient to view details, tooth history and schedules."
        crumbs={[{ label: "Patients" }]}
        actions={
          can(role, "registration") && (
            <Button asChild>
              <Link to="/staff/registration">
                <UserPlus className="mr-1.5 h-4 w-4" />
                Register new patient
              </Link>
            </Button>
          )
        }
      />
      <div className="mb-4 grid gap-3 rounded-2xl border bg-card p-4 shadow-soft md:grid-cols-[1fr_auto_auto_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by name or patient ID"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search patients"
          />
        </div>
        <select
          className={selectCls}
          value={portal}
          onChange={(e) => setPortal(e.target.value)}
          aria-label="Portal status"
        >
          <option value="all">All portal statuses</option>
          <option>Active</option>
          <option>None</option>
          <option>Deactivated</option>
        </select>
        <select
          className={selectCls}
          value={alerts}
          onChange={(e) => setAlerts(e.target.value)}
          aria-label="Alerts"
        >
          <option value="all">All alert statuses</option>
          <option value="yes">Has alerts</option>
          <option value="no">No alerts</option>
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={recent}
            onChange={(e) => setRecent(e.target.checked)}
            className="accent-[var(--primary)]"
          />{" "}
          Visited last 7 days
        </label>
      </div>
      {rows.length === 0 ? (
        <div className="rounded-2xl border bg-card">
          <Empty
            icon={Users}
            title="No patients match your filters"
            body="Try a different name or clear the filters."
          />
        </div>
      ) : (
        <DataTable
          head={[
            "Patient ID",
            "Name",
            "Age",
            "Sex",
            "Contact",
            "Portal",
            "Last visit",
            "Alerts",
            "",
          ]}
        >
          {rows.map((p) => (
            <tr key={p.id}>
              <Td className="font-mono text-xs">{p.id}</Td>
              <Td className="font-semibold">{p.name}</Td>
              <Td>{p.age}</Td>
              <Td>{p.sex}</Td>
              <Td>{p.contact}</Td>
              <Td>
                <StatusBadge
                  status={p.portal === "None" ? "No account" : p.portal}
                  tone={p.portal === "Active" ? "success" : "neutral"}
                />
              </Td>
              <Td>{p.lastVisit}</Td>
              <Td>
                {p.alerts.length ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-warning">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {p.alerts[0]}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </Td>
              <Td>
                <Button asChild size="sm" variant="outline">
                  <Link to="/staff/patients/$id" params={{ id: p.id }}>
                    View
                  </Link>
                </Button>
              </Td>
            </tr>
          ))}
        </DataTable>
      )}
      <p className="mt-3 text-xs text-muted-foreground">
        Showing {rows.length} of {patients.length} patients
      </p>
    </>
  );
}
