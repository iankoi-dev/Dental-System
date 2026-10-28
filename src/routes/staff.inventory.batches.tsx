import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, PackageCheck, PackagePlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Callout,
  DataTable,
  Field,
  PageHeader,
  Restricted,
  StatusBadge,
  Td,
  selectCls,
} from "@/components/app/kit";
import { ITEMS, PROCEDURES } from "@/lib/mock-data";
import { confirmMaterialConsumption, DEMO_TODAY, fifoPlan, itemName } from "@/lib/mock-service";
import { useStore } from "@/lib/store";
import { can } from "@/lib/permissions";

export const Route = createFileRoute("/staff/inventory/batches")({
  head: () => ({
    meta: [
      { title: "Batches & FIFO — Dentriq" },
      { name: "description", content: "Batch management, stock receipt and FIFO consumption." },
      { property: "og:title", content: "Batches & FIFO — Dentriq" },
      { property: "og:description", content: "Batch management and FIFO consumption." },
    ],
  }),
  component: Batches,
});

const BAD = ["Expired", "Damaged", "Recalled", "Unavailable"];

function Batches() {
  const { role, batches, setBatches, log } = useStore();
  const [item, setItem] = useState("");
  const [recv, setRecv] = useState(false);
  const [r, setR] = useState({ itemId: ITEMS[0].id, qty: 10, expiry: "2027-10-01" });
  const [cons, setCons] = useState(false);
  const [proc, setProc] = useState("Root canal (stage 2)");
  const [done, setDone] = useState<ReturnType<typeof fifoPlan> | null>(null);
  if (!can(role, "batches")) return <Restricted what="batch management" />;

  const fifoPos = new Map<string, number>();
  ITEMS.forEach((i) =>
    batches
      .filter((b) => b.itemId === i.id && !BAD.includes(b.status) && b.remaining > 0)
      .sort((a, b) => a.received.localeCompare(b.received))
      .forEach((b, k) => fifoPos.set(b.id, k + 1)),
  );
  const plan = fifoPlan(batches, proc);
  const rows = batches
    .filter((b) => !item || b.itemId === item)
    .sort((a, b) => a.itemId.localeCompare(b.itemId) || a.received.localeCompare(b.received));

  return (
    <>
      <PageHeader
        title="Batches & FIFO"
        description="Batches are consumed in order of receipt. Expired, damaged, recalled and unavailable batches are excluded automatically."
        crumbs={[{ label: "Inventory", to: "/staff/inventory" }, { label: "Batches & FIFO" }]}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setDone(null);
                setCons(true);
              }}
            >
              <PackageCheck className="mr-1.5 h-4 w-4" />
              Record consumption
            </Button>
            <Button onClick={() => setRecv(true)}>
              <PackagePlus className="mr-1.5 h-4 w-4" />
              Receive stock
            </Button>
          </>
        }
      />
      <select
        className={selectCls + " mb-3 max-w-xs"}
        value={item}
        onChange={(e) => setItem(e.target.value)}
        aria-label="Filter by item"
      >
        <option value="">All items</option>
        {ITEMS.map((i) => (
          <option key={i.id} value={i.id}>
            {i.name}
          </option>
        ))}
      </select>
      <DataTable
        head={[
          "Batch ID",
          "Item",
          "Received",
          "Expiry",
          "Quantity",
          "Remaining",
          "Reserved",
          "Status",
          "FIFO position",
        ]}
      >
        {rows.map((b) => (
          <tr key={b.id}>
            <Td className="font-mono text-xs">{b.id}</Td>
            <Td className="font-medium">{itemName(b.itemId)}</Td>
            <Td>{b.received}</Td>
            <Td>{b.expiry}</Td>
            <Td>{b.qty}</Td>
            <Td className="font-semibold">{b.remaining}</Td>
            <Td>{b.reserved}</Td>
            <Td>
              <StatusBadge status={b.status} />
            </Td>
            <Td>
              {fifoPos.get(b.id) ? (
                <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs font-bold text-primary">
                  #{fifoPos.get(b.id)}
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">Excluded</span>
              )}
            </Td>
          </tr>
        ))}
      </DataTable>

      <Dialog open={recv} onOpenChange={setRecv}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Receive stock</DialogTitle>
            <DialogDescription>
              Creates a new batch placed last in FIFO order for its item.
            </DialogDescription>
          </DialogHeader>
          <Field label="Item" required>
            <select
              className={selectCls}
              value={r.itemId}
              onChange={(e) => setR({ ...r, itemId: e.target.value })}
            >
              {ITEMS.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Quantity"
              required
              error={r.qty < 1 ? "Quantity must be at least 1." : undefined}
            >
              <Input
                type="number"
                min={1}
                value={r.qty}
                onChange={(e) => setR({ ...r, qty: +e.target.value })}
              />
            </Field>
            <Field
              label="Expiry date"
              required
              error={r.expiry <= DEMO_TODAY ? "Expiry must be in the future." : undefined}
            >
              <Input
                type="date"
                value={r.expiry}
                onChange={(e) => setR({ ...r, expiry: e.target.value })}
              />
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRecv(false)}>
              Cancel
            </Button>
            <Button
              disabled={r.qty < 1 || r.expiry <= DEMO_TODAY}
              onClick={() => {
                const id = `B-${2000 + batches.length}`;
                setBatches((all) => [
                  ...all,
                  {
                    id,
                    itemId: r.itemId,
                    received: "2026-10-19",
                    expiry: r.expiry,
                    qty: r.qty,
                    remaining: r.qty,
                    status: "Available",
                    reserved: 0,
                  },
                ]);
                log("Stock receipt", "Inventory", id, `${r.qty} × ${itemName(r.itemId)}`);
                toast.success("Inventory batch received.");
                setRecv(false);
              }}
            >
              Receive stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={cons} onOpenChange={setCons}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Confirm material consumption</DialogTitle>
            <DialogDescription>
              Quantities are deducted from the earliest received eligible batch.
            </DialogDescription>
          </DialogHeader>
          {done ? (
            <div className="space-y-3">
              <Callout tone="success" title="Material consumption recorded using FIFO" />
              <ul className="space-y-1 text-sm">
                {done.flatMap((p) =>
                  p.picks.map((pk) => (
                    <li key={pk.batchId} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      {itemName(p.itemId)} — {pk.batchId}: {pk.before} → <b>{pk.before - pk.qty}</b>
                    </li>
                  )),
                )}
              </ul>
            </div>
          ) : (
            <>
              <Field label="Completed procedure" required>
                <select
                  className={selectCls}
                  value={proc}
                  onChange={(e) => setProc(e.target.value)}
                >
                  {PROCEDURES.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </Field>
              <DataTable head={["Material", "Needed", "FIFO batch selection", "Excluded"]}>
                {plan.map((p) => (
                  <tr key={p.itemId}>
                    <Td className="font-medium">{itemName(p.itemId)}</Td>
                    <Td>{p.qty}</Td>
                    <Td>
                      {p.picks.map((pk) => `${pk.batchId} (−${pk.qty})`).join(", ")}
                      {p.shortfall > 0 && (
                        <span className="ml-1 text-danger">Short {p.shortfall}</span>
                      )}
                    </Td>
                    <Td className="text-xs text-muted-foreground">
                      {p.excluded.join(", ") || "—"}
                    </Td>
                  </tr>
                ))}
              </DataTable>
              {plan.some((p) => p.shortfall > 0) && (
                <Callout tone="danger">
                  Insufficient eligible stock. Receive stock before confirming.
                </Callout>
              )}
            </>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCons(false)}>
              {done ? "Close" : "Cancel"}
            </Button>
            {!done && (
              <Button
                disabled={plan.some((p) => p.shortfall > 0)}
                onClick={() => {
                  setBatches(confirmMaterialConsumption(batches, plan));
                  log(
                    "FIFO deduction",
                    "Inventory",
                    proc,
                    plan.map((p) => p.picks.map((x) => x.batchId).join("/")).join(", "),
                  );
                  setDone(plan);
                  toast.success("Material consumption recorded using FIFO.");
                }}
              >
                Confirm consumption
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
