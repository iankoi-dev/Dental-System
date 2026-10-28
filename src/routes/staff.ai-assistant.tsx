import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { AIChat } from "@/components/app/AIChat";
import { AIBadge, Callout, PageHeader, Panel, Restricted } from "@/components/app/kit";
import { useStore } from "@/lib/store";
import { can } from "@/lib/permissions";
import { ROLE_LABELS } from "@/lib/mock-data";

export const Route = createFileRoute("/staff/ai-assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant — Dentriq" },
      { name: "description", content: "Role-aware AI workflow assistant for clinic staff." },
      { property: "og:title", content: "AI Assistant — Dentriq" },
      { property: "og:description", content: "Role-aware AI workflow assistant." },
    ],
  }),
  component: Page,
});

function Page() {
  const { role } = useStore();
  if (!can(role, "ai")) return <Restricted what="the AI assistant" />;
  return (
    <>
      <PageHeader
        title="AI Workflow Assistant"
        description="Find records, list follow-ups, prepare drafts and check resources. The assistant never diagnoses, prescribes or finalizes."
        crumbs={[{ label: "AI Assistant" }]}
        actions={<AIBadge />}
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Panel className="h-[640px] overflow-hidden [&>div]:h-full [&>div]:p-0">
          <AIChat />
        </Panel>
        <div className="space-y-4">
          <Panel title="Your access">
            <p className="flex items-center gap-2 text-sm">
              <ShieldCheck className="h-4 w-4 text-primary" />
              {ROLE_LABELS[role!]}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Responses only include information your role is authorized to see.
            </p>
          </Panel>
          <Callout tone="warning" title="The assistant will not">
            <ul className="mt-1 list-disc pl-4">
              <li>Diagnose conditions</li>
              <li>Prescribe treatment</li>
              <li>Finalize or approve schedules</li>
              <li>Expose unauthorized records</li>
            </ul>
          </Callout>
        </div>
      </div>
    </>
  );
}
