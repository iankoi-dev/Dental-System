import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Lock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  DataTable,
  PageHeader,
  Restricted,
  StatusBadge,
  Td,
  selectCls,
} from "@/components/app/kit";
import { useStore } from "@/lib/store";
import { can } from "@/lib/permissions";

export const Route = createFileRoute("/staff/audit-logs")({
  head: () => ({
    meta: [
      { title: "Audit Logs — Dentriq" },
      { name: "description", content: "Read-only audit trail of system activity." },
      { property: "og:title", content: "Audit Logs — Dentriq" },
      { property: "og:description", content: "Read-only audit trail." },
    ],
  }),
  component: Audit,
});

function Audit() {
  const { role, audit } = useStore();
  const [q, setQ] = useState("");
  const [mod, setMod] = useState("");
  const [r, setR] = useState("");
  const [out, setOut] = useState("");
  const [sel, setSel] = useState<(typeof audit)[number] | null>(null);
  if (!can(role, "audit")) return <Restricted what="audit logs" />;
  const uniq = (k: "module" | "role") => [...new Set(audit.map((a) => a[k]))];
  const rows = audit.filter(
    (a) =>
      (a.user + a.action + a.record + a.details).toLowerCase().includes(q.toLowerCase()) &&
      (!mod || a.module === mod) &&
      (!r || a.role === r) &&
      (!out || a.outcome === out),
  );
  return (
    <>
      <PageHeader
        title="Audit Logs"
        description="Every sensitive action is recorded. Entries are read-only."
        crumbs={[{ label: "Audit Logs" }]}
        actions={
          <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            Read-only
          </span>
        }
      />
      <div className="mb-3 grid gap-2 rounded-2xl border bg-card p-3 md:grid-cols-[1fr_auto_auto_auto_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search user, action, record"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search audit"
          />
        </div>
        <select
          className={selectCls}
          value={mod}
          onChange={(e) => setMod(e.target.value)}
          aria-label="Module"
        >
          <option value="">All modules</option>
          {uniq("module").map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
        <select
          className={selectCls}
          value={r}
          onChange={(e) => setR(e.target.value)}
          aria-label="Role"
        >
          <option value="">All roles</option>
          {uniq("role").map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
        <select
          className={selectCls}
          value={out}
          onChange={(e) => setOut(e.target.value)}
          aria-label="Outcome"
        >
          <option value="">All outcomes</option>
          <option>Success</option>
          <option>Failed</option>
        </select>
        <Input type="date" defaultValue="2026-10-19" aria-label="Date" />
      </div>
      <DataTable
        head={[
          "Timestamp",
          "User",
          "Role",
          "Action",
          "Module",
          "Affected record",
          "Outcome",
          "Details",
        ]}
      >
        {rows.map((a) => (
          <tr key={a.id} onClick={() => setSel(a)} className="cursor-pointer">
            <Td>{a.ts}</Td>
            <Td className="font-medium">{a.user}</Td>
            <Td>{a.role}</Td>
            <Td>{a.action}</Td>
            <Td>{a.module}</Td>
            <Td className="font-mono text-xs">{a.record}</Td>
            <Td>
              <StatusBadge status={a.outcome} />
            </Td>
            <Td className="max-w-xs truncate text-xs text-muted-foreground">{a.details}</Td>
          </tr>
        ))}
      </DataTable>
      <Sheet open={!!sel} onOpenChange={(v) => !v && setSel(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Audit entry {sel?.id}</SheetTitle>
          </SheetHeader>
          {sel && (
            <dl className="mt-6 space-y-3 px-4 text-sm">
              {Object.entries(sel).map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs uppercase text-muted-foreground">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
