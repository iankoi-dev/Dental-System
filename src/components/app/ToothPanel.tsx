import { useState } from "react";
import { Paperclip, Pencil, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  CONDITION_META,
  toothName,
  type Schedule,
  type ToothCondition,
  type ToothRecord,
} from "@/lib/mock-data";
import { Field, StatusBadge, selectCls, Empty } from "./kit";

export function ToothPanel({
  tooth,
  schedules,
  editable,
  onSave,
  simple,
}: {
  tooth: ToothRecord;
  schedules: Schedule[];
  editable: boolean;
  onSave?: (t: ToothRecord) => void;
  simple?: boolean;
}) {
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState(tooth);
  const meta = CONDITION_META[tooth.condition];
  const related = schedules.filter((s) => s.tooth === String(tooth.number));
  const history = [...tooth.history].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Tooth {tooth.number}
          </p>
          <h3 className="text-lg font-bold capitalize">{toothName(tooth.number)}</h3>
          <StatusBadge status={meta.label} tone={meta.tone} className="mt-1" />
        </div>
        {editable ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setDraft(tooth);
              setEdit(true);
            }}
          >
            <Pencil className="mr-1 h-3.5 w-3.5" />
            Edit record
          </Button>
        ) : (
          !simple && <span className="text-xs text-muted-foreground">View only</span>
        )}
      </div>
      <Tabs defaultValue="overview">
        <TabsList className="flex h-auto flex-wrap justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {!simple && <TabsTrigger value="notes">Clinical notes</TabsTrigger>}
          <TabsTrigger value="treat">Treatments</TabsTrigger>
          {!simple && <TabsTrigger value="files">Attachments</TabsTrigger>}
          <TabsTrigger value="rec">{simple ? "Instructions" : "Recommendations"}</TabsTrigger>
          <TabsTrigger value="hist">History</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-3 pt-2 text-sm">
          <dl className="grid grid-cols-2 gap-3">
            <div>
              <dt className="text-xs text-muted-foreground">Diagnosis (recorded)</dt>
              <dd className="font-medium">{tooth.diagnosis}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Treatment plan</dt>
              <dd className="font-medium">{tooth.plan}</dd>
            </div>
          </dl>
          <div>
            <p className="mb-1 text-xs text-muted-foreground">Related follow-ups</p>
            {related.length ? (
              related.map((s) => (
                <p
                  key={s.id}
                  className="flex items-center justify-between rounded-lg border px-3 py-2"
                >
                  <span>
                    {s.date} · {s.procedure}
                  </span>
                  <StatusBadge status={s.status} />
                </p>
              ))
            ) : (
              <p className="text-muted-foreground">None scheduled.</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="notes" className="pt-2 text-sm">
          {tooth.notes || "No notes."}
        </TabsContent>
        <TabsContent value="treat" className="space-y-2 pt-2 text-sm">
          {history.filter((h) => h.type !== "Examination").length ? (
            history
              .filter((h) => h.type !== "Examination")
              .map((h) => (
                <div key={h.date + h.type} className="rounded-lg border p-3">
                  <p className="font-medium">{h.type}</p>
                  <p className="text-xs text-muted-foreground">
                    {h.date} · {h.by}
                  </p>
                  <p className="mt-1">{h.note}</p>
                </div>
              ))
          ) : (
            <p className="text-muted-foreground">No treatments recorded.</p>
          )}
        </TabsContent>
        <TabsContent value="files" className="pt-2">
          <div className="grid grid-cols-3 gap-2">
            {tooth.history.length > 0 && (
              <div className="flex aspect-square flex-col items-center justify-center rounded-lg border bg-muted text-xs text-muted-foreground">
                <Paperclip className="mb-1 h-4 w-4" />
                periapical_{tooth.number}.jpg
              </div>
            )}
            <button
              onClick={() => toast.success("Attachment uploaded (simulated)")}
              className="flex aspect-square flex-col items-center justify-center rounded-lg border-2 border-dashed text-xs text-muted-foreground hover:border-primary hover:text-primary"
            >
              <Upload className="mb-1 h-4 w-4" />
              Upload image
            </button>
          </div>
        </TabsContent>
        <TabsContent value="rec" className="pt-2 text-sm">
          {tooth.recommendation}
        </TabsContent>
        <TabsContent value="hist" className="pt-2">
          {history.length ? (
            <ol className="relative space-y-4 border-l pl-5">
              {history.map((h) => (
                <li key={h.date + h.type} className="text-sm">
                  <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border-2 border-card bg-primary" />
                  <p className="font-medium">{h.type}</p>
                  <p className="text-xs text-muted-foreground">
                    {h.date} · {h.by}
                  </p>
                  <p>{h.note}</p>
                </li>
              ))}
            </ol>
          ) : (
            <Empty icon={Paperclip} title="No history yet" />
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={edit} onOpenChange={setEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit tooth {tooth.number} record</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Field label="Condition" required>
              <select
                className={selectCls}
                value={draft.condition}
                onChange={(e) =>
                  setDraft({ ...draft, condition: e.target.value as ToothCondition })
                }
              >
                {(Object.keys(CONDITION_META) as ToothCondition[]).map((c) => (
                  <option key={c} value={c}>
                    {CONDITION_META[c].label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Diagnosis (as recorded by dentist)">
              <Textarea
                rows={2}
                value={draft.diagnosis}
                onChange={(e) => setDraft({ ...draft, diagnosis: e.target.value })}
              />
            </Field>
            <Field label="Clinical notes">
              <Textarea
                rows={3}
                value={draft.notes}
                onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              />
            </Field>
            <Field label="Recommendations">
              <Textarea
                rows={2}
                value={draft.recommendation}
                onChange={(e) => setDraft({ ...draft, recommendation: e.target.value })}
              />
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEdit(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onSave?.({
                  ...draft,
                  history: [
                    ...draft.history,
                    {
                      date: "2026-10-19",
                      type: "Record update",
                      note: draft.notes.slice(0, 80),
                      by: "Current user",
                    },
                  ],
                });
                setEdit(false);
                toast.success("Tooth record saved");
              }}
            >
              Save tooth record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
