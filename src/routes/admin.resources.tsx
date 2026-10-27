import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable, PageHeader, Panel, Restricted, StatusBadge, Td } from "@/components/app/kit";
import { RESOURCES, STAFF, ROLE_LABELS } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { can } from "@/lib/permissions";

export const Route = createFileRoute("/admin/resources")({
  head: () => ({
    meta: [
      { title: "Resources — Dentriq" },
      {
        name: "description",
        content: "Dentists, staff, chairs, rooms and equipment availability.",
      },
      { property: "og:title", content: "Resources — Dentriq" },
      { property: "og:description", content: "Clinic resource management." },
    ],
  }),
  component: Resources,
});

function List({ rows }: { rows: { name: string; status: string; note: string }[] }) {
  const { role } = useStore();
  return (
    <DataTable head={["Resource", "Status", "Availability / maintenance", ""]}>
      {rows.map((r) => (
        <tr key={r.name}>
          <Td className="font-medium">{r.name}</Td>
          <Td>
            <StatusBadge status={r.status} />
          </Td>
          <Td className="text-muted-foreground">{r.note}</Td>
          <Td>
            {role === "admin" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.success(`Blocked period added for ${r.name}`)}
              >
                Add blocked period
              </Button>
            )}
          </Td>
        </tr>
      ))}
    </DataTable>
  );
}

function Resources() {
  const { role } = useStore();
  if (!can(role, "resources")) return <Restricted what="resources" />;
  const people = STAFF.filter((s) => s.role !== "admin" && s.status !== "Deactivated").map((s) => ({
    name: `${s.name} (${ROLE_LABELS[s.role]})`,
    status: s.status === "On leave" ? "On leave" : "Available",
    note: s.status === "On leave" ? "Leave until Oct 23" : "Mon–Sat 08:00–17:00",
  }));
  return (
    <>
      <PageHeader
        title="Resource Management"
        description="Availability schedules, blocked periods and maintenance status used by the change-impact review."
        crumbs={[{ label: "Resources" }]}
      />
      <Tabs defaultValue="chairs">
        <TabsList className="mb-4 flex h-auto flex-wrap justify-start">
          <TabsTrigger value="people">Dentists & staff</TabsTrigger>
          <TabsTrigger value="chairs">Dental chairs</TabsTrigger>
          <TabsTrigger value="rooms">Treatment rooms</TabsTrigger>
          <TabsTrigger value="eq">Equipment</TabsTrigger>
        </TabsList>
        <TabsContent value="people">
          <List rows={people} />
        </TabsContent>
        <TabsContent value="chairs">
          <List rows={RESOURCES.chairs} />
        </TabsContent>
        <TabsContent value="rooms">
          <List rows={RESOURCES.rooms} />
        </TabsContent>
        <TabsContent value="eq">
          <List rows={RESOURCES.equipment} />
        </TabsContent>
      </Tabs>
      <Panel title="Blocked periods this week" className="mt-6">
        <ul className="space-y-2 text-sm">
          <li>Chair 1 — Oct 22, 08:00–10:00 · Preventive maintenance</li>
          <li>Chair 3 — until Oct 22 · Suction unit repair</li>
          <li>Surgery Room — daily 12:00–12:30 · Sterilization cycle</li>
        </ul>
      </Panel>
    </>
  );
}
