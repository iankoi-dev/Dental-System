import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DataTable,
  Field,
  PageHeader,
  Restricted,
  StatusBadge,
  Td,
  selectCls,
} from "@/components/app/kit";
import { ROLE_LABELS, STAFF, type Role } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { can } from "@/lib/permissions";

export const Route = createFileRoute("/admin/users")({
  head: () => ({
    meta: [
      { title: "Users and Roles — Dentriq" },
      { name: "description", content: "Manage staff accounts and patient portal accounts." },
      { property: "og:title", content: "Users and Roles — Dentriq" },
      { property: "og:description", content: "Staff and portal account management." },
    ],
  }),
  component: Users,
});

function Users() {
  const { role, patients, setPatients, log } = useStore();
  const [staff, setStaff] = useState(STAFF);
  const [edit, setEdit] = useState<(typeof STAFF)[number] | "new" | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "receptionist" as Role });
  const [deact, setDeact] = useState<(typeof STAFF)[number] | null>(null);
  if (!can(role, "users")) return <Restricted what="user management" />;
  const open = (u: (typeof STAFF)[number] | "new") => {
    setForm(
      u === "new"
        ? { name: "", email: "", role: "receptionist" }
        : { name: u.name, email: u.email, role: u.role },
    );
    setEdit(u);
  };

  return (
    <>
      <PageHeader
        title="Users and Roles"
        description="Create staff accounts, assign roles and manage patient portal access."
        crumbs={[{ label: "Users and Roles" }]}
        actions={
          <>
            <Button asChild variant="outline">
              <Link to="/admin/roles">Roles & permissions</Link>
            </Button>
            <Button onClick={() => open("new")}>
              <UserPlus className="mr-1.5 h-4 w-4" />
              Add staff account
            </Button>
          </>
        }
      />
      <Tabs defaultValue="staff">
        <TabsList className="mb-4">
          <TabsTrigger value="staff">Staff accounts</TabsTrigger>
          <TabsTrigger value="portal">Patient portal accounts</TabsTrigger>
        </TabsList>
        <TabsContent value="staff">
          <DataTable head={["Name", "Email", "Role", "Status", "Last login", ""]}>
            {staff.map((u) => (
              <tr key={u.id}>
                <Td className="font-medium">{u.name}</Td>
                <Td>{u.email}</Td>
                <Td>{ROLE_LABELS[u.role]}</Td>
                <Td>
                  <StatusBadge status={u.status} />
                </Td>
                <Td>{u.lastLogin}</Td>
                <Td>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => open(u)}>
                      Edit / role
                    </Button>
                    {u.status !== "Deactivated" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-danger"
                        onClick={() => setDeact(u)}
                      >
                        Deactivate
                      </Button>
                    )}
                  </div>
                </Td>
              </tr>
            ))}
          </DataTable>
        </TabsContent>
        <TabsContent value="portal">
          <DataTable head={["Patient", "Patient ID", "Email", "Portal status", ""]}>
            {patients.map((p) => (
              <tr key={p.id}>
                <Td className="font-medium">{p.name}</Td>
                <Td className="font-mono text-xs">{p.id}</Td>
                <Td>{p.email}</Td>
                <Td>
                  <StatusBadge
                    status={p.portal === "None" ? "No account" : p.portal}
                    tone={p.portal === "Active" ? "success" : "neutral"}
                  />
                </Td>
                <Td>
                  {p.portal === "Active" ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-danger"
                      onClick={() => {
                        setPatients((a) =>
                          a.map((x) => (x.id === p.id ? { ...x, portal: "Deactivated" } : x)),
                        );
                        log("Portal deactivated", "Portal", p.id, "");
                        toast.success("Portal account deactivated");
                      }}
                    >
                      Deactivate
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setPatients((a) =>
                          a.map((x) => (x.id === p.id ? { ...x, portal: "Active" } : x)),
                        );
                        log("Portal account created", "Portal", p.id, "");
                        toast.success("Portal account activated");
                      }}
                    >
                      {p.portal === "None" ? "Create" : "Reactivate"}
                    </Button>
                  )}
                </Td>
              </tr>
            ))}
          </DataTable>
        </TabsContent>
      </Tabs>

      <Dialog open={!!edit} onOpenChange={(v) => !v && setEdit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {edit === "new" ? "Add staff account" : "Edit account & role"}
            </DialogTitle>
          </DialogHeader>
          <Field label="Full name" required>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field
            label="Email"
            required
            error={form.email && !form.email.includes("@") ? "Enter a valid email." : undefined}
          >
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <Field label="Role" required>
            <select
              className={selectCls}
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
            >
              {(Object.keys(ROLE_LABELS) as Role[])
                .filter((r) => r !== "patient")
                .map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r]}
                  </option>
                ))}
            </select>
          </Field>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEdit(null)}>
              Cancel
            </Button>
            <Button
              disabled={!form.name || !form.email.includes("@")}
              onClick={() => {
                if (edit === "new")
                  setStaff((s) => [
                    ...s,
                    { id: `U-${s.length + 1}`, ...form, status: "Active", lastLogin: "—" },
                  ]);
                else
                  setStaff((s) =>
                    s.map((u) =>
                      u.id === (edit as (typeof STAFF)[number]).id ? { ...u, ...form } : u,
                    ),
                  );
                log(
                  edit === "new" ? "Account created" : "Role change",
                  "Users",
                  form.email,
                  ROLE_LABELS[form.role],
                );
                toast.success("Account saved");
                setEdit(null);
              }}
            >
              Save account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={!!deact} onOpenChange={(v) => !v && setDeact(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate {deact?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              They will be signed out and lose access immediately. You can reactivate later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                setStaff((s) =>
                  s.map((u) => (u.id === deact!.id ? { ...u, status: "Deactivated" } : u)),
                );
                log("Account deactivated", "Users", deact!.id, "");
                toast.success("Account deactivated");
              }}
            >
              Deactivate account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
