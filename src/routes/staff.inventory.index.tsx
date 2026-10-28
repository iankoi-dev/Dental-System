import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Boxes,
  CalendarClock,
  Package,
  PackageX,
  Plus,
  Search,
  Timer,
  TrendingDown,
} from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Callout,
  DataTable,
  Field,
  PageHeader,
  Restricted,
  StatCard,
  StatusBadge,
  Td,
  selectCls,
} from "@/components/app/kit";
import { ITEMS, MOVEMENTS, PROCEDURE_MATERIALS } from "@/lib/mock-data";
import { itemName } from "@/lib/mock-service";
import { useStore } from "@/lib/store";
import { can } from "@/lib/permissions";

export const Route = createFileRoute("/staff/inventory/")({
  head: () => ({
    meta: [
      { title: "Inventory — Dentriq" },
      { name: "description", content: "FIFO inventory items, alerts, mapping and movements." },
      { property: "og:title", content: "Inventory — Dentriq" },
      { property: "og:description", content: "FIFO inventory management." },
    ],
  }),
  component: Inventory,
});

const BAD = ["Expired", "Damaged", "Recalled", "Unavailable"];

function Inventory() {
  const { role, batches, schedules, log } = useStore();
  const [q, setQ] = useState("");
  const [mtype, setMtype] = useState("");
  const [add, setAdd] = useState(false);
  const [name, setName] = useState("");
  if (!can(role, "inventory")) return <Restricted what="inventory" />;
  const editable = role === "inventory" || role === "admin";
  const rows = ITEMS.filter((i) => i.name.toLowerCase().includes(q.toLowerCase())).map((i) => {
    const bs = batches.filter((b) => b.itemId === i.id);
    const ok = bs.filter((b) => !BAD.includes(b.status));
    const qty = ok.reduce((a, b) => a + b.remaining, 0);
    const nearest = ok.map((b) => b.expiry).sort()[0] ?? "—";
    const status =
      qty === 0
        ? "Unavailable"
        : qty <= i.reorder
          ? "Low Stock"
          : ok.some((b) => b.status === "Near Expiry")
            ? "Near Expiry"
            : "Available";
    return { ...i, bs: bs.length, qty, nearest, status };
  });

  return (
    <>
      <PageHeader
        title="Inventory"
        description="Stock levels across all batches. Deductions follow FIFO from the earliest received eligible batch."
        crumbs={[{ label: "Inventory" }]}
        actions={
          <>
            {editable && (
              <Button variant="outline" onClick={() => setAdd(true)}>
                <Plus className="mr-1.5 h-4 w-4" />
                Add item
              </Button>
            )}
            <Button asChild>
              <Link to="/staff/inventory/batches">
                <Boxes className="mr-1.5 h-4 w-4" />
                Batches & FIFO
              </Link>
            </Button>
          </>
        }
      />
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-8">
        <StatCard label="Items" value={ITEMS.length} icon={Package} />
        <StatCard label="Batches" value={batches.length} icon={Boxes} />
        <StatCard
          label="Low stock"
          value={rows.filter((r) => r.status === "Low Stock").length}
          icon={AlertTriangle}
          tone="warning"
        />
        <StatCard
          label="Near expiry"
          value={batches.filter((b) => b.status === "Near Expiry").length}
          icon={Timer}
          tone="warning"
        />
        <StatCard
          label="Expired"
          value={batches.filter((b) => b.status === "Expired").length}
          icon={PackageX}
          tone="danger"
        />
        <StatCard
          label="Damaged / unavail."
          value={
            batches.filter((b) => ["Damaged", "Recalled", "Unavailable"].includes(b.status)).length
          }
          icon={PackageX}
          tone="neutral"
        />
        <StatCard
          label="Reserved units"
          value={batches.reduce((a, b) => a + b.reserved, 0)}
          icon={CalendarClock}
          tone="info"
        />
        <StatCard label="Projected shortages" value={2} icon={TrendingDown} tone="danger" />
      </div>
      <Tabs defaultValue="items">
        <TabsList className="mb-4 flex h-auto flex-wrap justify-start">
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="mapping">Procedure materials</TabsTrigger>
          <TabsTrigger value="res">Reservations</TabsTrigger>
          <TabsTrigger value="mov">Stock movements</TabsTrigger>
        </TabsList>
        <TabsContent value="items">
          <div className="relative mb-3 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search items"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search items"
            />
          </div>
          <DataTable
            head={[
              "Item",
              "Category",
              "Unit",
              "Quantity",
              "Reorder level",
              "Batches",
              "Nearest expiry",
              "Status",
            ]}
          >
            {rows.map((r) => (
              <tr key={r.id}>
                <Td className="font-medium">{r.name}</Td>
                <Td>{r.category}</Td>
                <Td>{r.unit}</Td>
                <Td className="font-semibold">{r.qty}</Td>
                <Td>{r.reorder}</Td>
                <Td>{r.bs}</Td>
                <Td>{r.nearest}</Td>
                <Td>
                  <StatusBadge status={r.status} />
                </Td>
              </tr>
            ))}
          </DataTable>
        </TabsContent>
        <TabsContent value="alerts" className="space-y-2">
          {batches
            .filter((b) => b.status !== "Available" && b.status !== "Reserved")
            .map((b) => (
              <Callout
                key={b.id}
                tone={["Expired", "Damaged", "Recalled"].includes(b.status) ? "danger" : "warning"}
                title={`${b.status}: ${itemName(b.itemId)} (${b.id})`}
              >
                Remaining {b.remaining} · expires {b.expiry}
                {BAD.includes(b.status) && " · excluded from FIFO deductions"}
              </Callout>
            ))}
        </TabsContent>
        <TabsContent value="mapping">
          <DataTable head={["Procedure", "Required materials", "Linked follow-ups"]}>
            {Object.entries(PROCEDURE_MATERIALS).map(([p, ms]) => (
              <tr key={p}>
                <Td className="font-medium">{p}</Td>
                <Td className="whitespace-normal">
                  {ms.map((m) => `${itemName(m.itemId)} × ${m.qty}`).join(", ")}
                </Td>
                <Td>
                  {schedules
                    .filter((s) => s.procedure === p && s.status !== "Cancelled")
                    .map((s) => s.id)
                    .join(", ") || "—"}
                </Td>
              </tr>
            ))}
          </DataTable>
        </TabsContent>
        <TabsContent value="res">
          <DataTable head={["Batch", "Item", "Reserved", "Linked schedule", ""]}>
            {batches
              .filter((b) => b.reserved > 0)
              .map((b, i) => {
                const s = schedules.filter((x) => !["Cancelled", "Completed"].includes(x.status))[
                  i % 6
                ];
                return (
                  <tr key={b.id}>
                    <Td className="font-mono text-xs">{b.id}</Td>
                    <Td>{itemName(b.itemId)}</Td>
                    <Td>{b.reserved}</Td>
                    <Td>
                      {s?.id} · {s?.patient}
                    </Td>
                    <Td>
                      {editable && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            log("Reservation released", "Inventory", b.id, `${b.reserved} units`);
                            toast.success("Reservation released");
                          }}
                        >
                          Release
                        </Button>
                      )}
                    </Td>
                  </tr>
                );
              })}
          </DataTable>
        </TabsContent>
        <TabsContent value="mov">
          <select
            className={selectCls + " mb-3 max-w-xs"}
            value={mtype}
            onChange={(e) => setMtype(e.target.value)}
            aria-label="Movement type"
          >
            <option value="">All movement types</option>
            {["Receipt", "Consumption", "Reservation", "Damaged", "Recall"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <DataTable head={["Date", "Item", "Batch", "Type", "Qty", "By"]}>
            {MOVEMENTS.filter((m) => !mtype || m.type === mtype).map((m) => (
              <tr key={m.id}>
                <Td>{m.date}</Td>
                <Td>{m.item}</Td>
                <Td className="font-mono text-xs">{m.batch}</Td>
                <Td>
                  <StatusBadge status={m.type} tone={m.qty > 0 ? "success" : "neutral"} />
                </Td>
                <Td className="font-semibold">{m.qty > 0 ? `+${m.qty}` : m.qty}</Td>
                <Td>{m.by}</Td>
              </tr>
            ))}
          </DataTable>
        </TabsContent>
      </Tabs>
      <Dialog open={add} onOpenChange={setAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add inventory item</DialogTitle>
          </DialogHeader>
          <Field label="Item name" required>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category" required>
              <select className={selectCls}>
                {["Restoratives", "Endodontics", "Surgical", "PPE", "Preventive"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Reorder level" required>
              <Input type="number" defaultValue={10} />
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdd(false)}>
              Cancel
            </Button>
            <Button
              disabled={!name}
              onClick={() => {
                toast.success("Inventory item added");
                setAdd(false);
                setName("");
              }}
            >
              Add item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
