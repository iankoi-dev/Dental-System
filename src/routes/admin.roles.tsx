import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PageHeader, Restricted } from "@/components/app/kit";
import { ROLE_LABELS } from "@/lib/mock-data";
import { ACCESS, can, type NavKey } from "@/lib/permissions";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/roles")({
  head: () => ({
    meta: [
      { title: "Roles and Permissions — Dentriq" },
      { name: "description", content: "Permission matrix by module and role." },
      { property: "og:title", content: "Roles and Permissions — Dentriq" },
      { property: "og:description", content: "Permission matrix." },
    ],
  }),
  component: Roles,
});

const MODULES: [NavKey, string][] = [
  ["patients", "Patients"],
  ["registration", "Registration"],
  ["odontogram", "Odontogram"],
  ["queue", "Queue"],
  ["schedules", "Schedules"],
  ["ai", "AI Assistant"],
  ["inventory", "Inventory"],
  ["batches", "Batches"],
  ["forecast", "Forecast"],
  ["reports", "Reports"],
  ["audit", "Audit logs"],
  ["users", "Users"],
  ["backup", "Backup"],
];

function Roles() {
  const { role } = useStore();
  const [m, setM] = useState(
    () =>
      Object.fromEntries(Object.entries(ACCESS).map(([r, ks]) => [r, new Set(ks)])) as Record<
        string,
        Set<NavKey>
      >,
  );
  if (!can(role, "roles")) return <Restricted what="roles and permissions" />;
  const roles = Object.keys(ACCESS) as (keyof typeof ACCESS)[];
  return (
    <>
      <PageHeader
        title="Roles and Permissions"
        description="Toggle which modules each role can access. Patients always have information-only portal access."
        crumbs={[{ label: "Users and Roles", to: "/admin/users" }, { label: "Roles" }]}
        actions={
          <Button onClick={() => toast.success("Permissions saved (prototype)")}>
            Save permissions
          </Button>
        }
      />
      <div className="overflow-x-auto rounded-2xl border bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Module</th>
              {roles.map((r) => (
                <th key={r} className="px-4 py-3">
                  {ROLE_LABELS[r]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {MODULES.map(([k, l]) => (
              <tr key={k}>
                <td className="px-4 py-2.5 font-medium">{l}</td>
                {roles.map((r) => (
                  <td key={r} className="px-4 py-2.5 text-center">
                    <Switch
                      aria-label={`${l} for ${ROLE_LABELS[r]}`}
                      disabled={r === "admin"}
                      checked={m[r].has(k)}
                      onCheckedChange={(v) =>
                        setM((x) => {
                          const s = new Set(x[r]);
                          if (v) s.add(k);
                          else s.delete(k);
                          return { ...x, [r]: s };
                        })
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
