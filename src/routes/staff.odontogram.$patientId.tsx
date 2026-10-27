import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { OdontogramWorkspace } from "@/components/app/OdontogramWorkspace";
import { Callout, PageHeader, Restricted, selectCls } from "@/components/app/kit";
import { useStore } from "@/lib/store";
import { can } from "@/lib/permissions";

export const Route = createFileRoute("/staff/odontogram/$patientId")({
  head: () => ({
    meta: [
      { title: "3D Odontogram — Dentriq" },
      { name: "description", content: "Interactive 3D dental chart with tooth-level history." },
      { property: "og:title", content: "3D Odontogram — Dentriq" },
      { property: "og:description", content: "Interactive 3D dental chart." },
    ],
  }),
  component: Page,
});

function Page() {
  const { patientId } = Route.useParams();
  const { role, patients } = useStore();
  const nav = useNavigate();
  const p = patients.find((x) => x.id === patientId);
  if (!can(role, "odontogram") && !can(role, "patients"))
    return <Restricted what="the odontogram" />;
  return (
    <>
      <PageHeader
        title="3D Odontogram"
        description="Rotate, zoom and select a tooth to review or document tooth-level records."
        crumbs={[
          { label: "Patients", to: "/staff/patients" },
          { label: p?.name ?? patientId },
          { label: "Odontogram" },
        ]}
        actions={
          <select
            aria-label="Select patient"
            className={selectCls + " w-64"}
            value={patientId}
            onChange={(e) =>
              nav({ to: "/staff/odontogram/$patientId", params: { patientId: e.target.value } })
            }
          >
            {patients.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        }
      />
      <Callout tone="info" className="mb-4">
        The odontogram records dentist findings. No automated diagnosis is performed.
      </Callout>
      <OdontogramWorkspace key={patientId} patientId={patientId} />
    </>
  );
}
