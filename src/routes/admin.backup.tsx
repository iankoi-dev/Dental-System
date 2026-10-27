import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DatabaseBackup, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
import {
  Callout,
  DataTable,
  PageHeader,
  Restricted,
  StatCard,
  StatusBadge,
  Td,
} from "@/components/app/kit";
import { BACKUPS } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { can } from "@/lib/permissions";

export const Route = createFileRoute("/admin/backup")({
  head: () => ({
    meta: [
      { title: "Backup and Recovery — Dentriq" },
      { name: "description", content: "Backup history and restore." },
      { property: "og:title", content: "Backup and Recovery — Dentriq" },
      { property: "og:description", content: "Backup and recovery." },
    ],
  }),
  component: Backup,
});

function Backup() {
  const { role, log } = useStore();
  const [list, setList] = useState(BACKUPS);
  const [pct, setPct] = useState<number | null>(null);
  const [restore, setRestore] = useState<string | null>(null);
  if (!can(role, "backup")) return <Restricted what="backup and recovery" />;
  async function run() {
    setPct(0);
    for (let i = 1; i <= 20; i++) {
      await new Promise((r) => setTimeout(r, 90));
      setPct(i * 5);
    }
    const id = `BK-0${420 + list.length - 5}`;
    setList((l) => [
      { id, ts: "2026-10-19 10:12", size: "1.43 GB", type: "Manual", status: "Verified" },
      ...l,
    ]);
    log("Backup", "Backup", id, "Manual backup verified.");
    toast.success("Backup completed and verified");
    setPct(null);
  }
  return (
    <>
      <PageHeader
        title="Backup and Recovery"
        description="Automatic nightly backups with manual backup and restore."
        crumbs={[{ label: "Backup and Recovery" }]}
        actions={
          <Button onClick={run} disabled={pct !== null}>
            {pct !== null ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <DatabaseBackup className="mr-1.5 h-4 w-4" />
            )}
            Create backup
          </Button>
        }
      />
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        <StatCard
          label="Last backup"
          value={list[0].ts.slice(5)}
          icon={DatabaseBackup}
          tone="success"
          hint={list[0].status}
        />
        <StatCard label="Schedule" value="Daily 02:00" icon={DatabaseBackup} />
        <StatCard label="Retention" value="30 days" icon={DatabaseBackup} tone="info" />
      </div>
      {pct !== null && (
        <div className="mb-6 rounded-2xl border bg-card p-4">
          <p className="mb-2 text-sm font-medium">Creating backup… {pct}%</p>
          <Progress value={pct} />
        </div>
      )}
      <DataTable head={["Backup ID", "Timestamp", "Size", "Type", "Status", ""]}>
        {list.map((b) => (
          <tr key={b.id}>
            <Td className="font-mono text-xs">{b.id}</Td>
            <Td>{b.ts}</Td>
            <Td>{b.size}</Td>
            <Td>{b.type}</Td>
            <Td>
              <StatusBadge status={b.status} />
            </Td>
            <Td>
              {b.status === "Verified" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-danger"
                  onClick={() => setRestore(b.id)}
                >
                  Restore
                </Button>
              )}
            </Td>
          </tr>
        ))}
      </DataTable>
      <AlertDialog open={!!restore} onOpenChange={(v) => !v && setRestore(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore from {restore}?</AlertDialogTitle>
            <AlertDialogDescription>
              All changes made after this backup will be replaced. Staff will be signed out during
              the restore.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Callout tone="danger">
            This is a sensitive operation and will be recorded in the audit log.
          </Callout>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                log("Restore", "Backup", restore!, "Restore simulated.");
                toast.success(`Restore from ${restore} completed (simulated)`);
              }}
            >
              Restore backup
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
