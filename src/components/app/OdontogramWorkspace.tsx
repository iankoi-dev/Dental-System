import { useState } from "react";
import { Odontogram3D, Legend } from "@/components/app/Odontogram3D";
import { ToothPanel } from "@/components/app/ToothPanel";
import { Panel } from "@/components/app/kit";
import { getTeethFor } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { canEditClinical } from "@/lib/permissions";

export function OdontogramWorkspace({ patientId }: { patientId: string }) {
  const { role, schedules, log } = useStore();
  const [teeth, setTeeth] = useState(() => getTeethFor(patientId));
  const [sel, setSel] = useState(26);
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
      <div className="space-y-3">
        <Odontogram3D teeth={teeth} selected={sel} onSelect={setSel} />
        <Legend />
      </div>
      <Panel>
        <ToothPanel
          key={sel + teeth[sel].condition + teeth[sel].history.length}
          tooth={teeth[sel]}
          schedules={schedules.filter((s) => s.patientId === patientId)}
          editable={canEditClinical(role)}
          onSave={(t) => {
            setTeeth((all) => ({ ...all, [t.number]: t }));
            log(
              "Tooth record update",
              "Odontogram",
              `${patientId} / ${t.number}`,
              "Tooth-level documentation updated.",
            );
          }}
        />
      </Panel>
    </div>
  );
}
