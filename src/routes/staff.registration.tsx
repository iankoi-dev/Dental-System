import { useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Camera,
  CheckCircle2,
  FileImage,
  KeyRound,
  Loader2,
  RefreshCw,
  ScanLine,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Callout, PageHeader, Panel, Restricted, StatusBadge } from "@/components/app/kit";
import { extractOCRFields, uploadRegistrationForm, type OcrField } from "@/lib/mock-service";
import { useStore } from "@/lib/store";
import { can } from "@/lib/permissions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/staff/registration")({
  head: () => ({
    meta: [
      { title: "Patient Registration — Dentriq" },
      {
        name: "description",
        content: "OCR-assisted patient registration with staff verification.",
      },
      { property: "og:title", content: "Patient Registration — Dentriq" },
      { property: "og:description", content: "OCR-assisted patient registration." },
    ],
  }),
  component: Registration,
});

type Stage = "upload" | "processing" | "review" | "done";

function Registration() {
  const { role, setPatients, patients, log } = useStore();
  const [stage, setStage] = useState<Stage>("upload");
  const [file, setFile] = useState<{ name: string; url?: string } | null>(null);
  const [progress, setProgress] = useState(0);
  const [fields, setFields] = useState<OcrField[]>([]);
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const [orig, setOrig] = useState<Record<string, string>>({});
  const [discard, setDiscard] = useState(false);
  const [savedId, setSavedId] = useState("");
  const [drag, setDrag] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  if (!can(role, "registration")) return <Restricted what="patient registration" />;

  async function start(f: File | null) {
    const up = await uploadRegistrationForm(f);
    setFile({
      name: up.fileName,
      url: f && f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
    });
    setStage("processing");
    setProgress(0);
    for (let i = 1; i <= 10; i++) {
      await new Promise((r) => setTimeout(r, 160));
      setProgress(i * 10);
    }
    const fs = await extractOCRFields();
    setFields(fs);
    setOrig(Object.fromEntries(fs.map((x) => [x.key, x.value])));
    setReviewed(Object.fromEntries(fs.map((x) => [x.key, x.confidence >= 85])));
    setStage("review");
  }
  const problem = (f: OcrField) => (f.required && !f.value.trim()) || /[?_]/.test(f.value);
  const pending = fields.filter((f) => problem(f) || !reviewed[f.key]);
  const canSave = fields.length > 0 && pending.length === 0;

  function save() {
    const v = Object.fromEntries(fields.map((f) => [f.key, f.value]));
    const id = `P-${1001 + patients.length}`;
    setPatients((all) => [
      {
        id,
        name: v.name,
        dob: v.dob,
        age: 2026 - +v.dob.slice(0, 4),
        sex: v.sex as "Male",
        contact: v.contact,
        email: v.email,
        address: v.address,
        portal: "None",
        lastVisit: "2026-10-19",
        alerts: v.allergies && v.allergies !== "None" ? [`Allergy: ${v.allergies}`] : [],
        medicalHistory: v.medicalHistory,
        allergies: v.allergies,
        conditions: v.conditions,
        emergencyContact: v.emergencyContact,
      },
      ...all,
    ]);
    log(
      "OCR verification",
      "Registration",
      id,
      `${fields.filter((f) => f.value !== orig[f.key]).length} fields corrected before save.`,
    );
    setSavedId(id);
    setStage("done");
    toast.success("Patient record saved successfully.");
  }
  const reset = () => {
    setStage("upload");
    setFile(null);
    setFields([]);
  };

  return (
    <>
      <PageHeader
        title="Patient Registration"
        description="Upload a completed paper form. OCR extracts what it can; you verify every field before saving."
        crumbs={[{ label: "Patient Registration" }]}
      />
      <ol className="mb-6 flex flex-wrap gap-2 text-xs font-semibold">
        {["Upload form", "OCR processing", "Verify fields", "Saved"].map((s, i) => {
          const idx = ["upload", "processing", "review", "done"].indexOf(stage);
          return (
            <li
              key={s}
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-1.5",
                i < idx
                  ? "bg-success-soft text-success"
                  : i === idx
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
              )}
            >
              {i + 1}. {s}
            </li>
          );
        })}
      </ol>

      {stage === "upload" && (
        <Panel>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              start(e.dataTransfer.files[0] ?? null);
            }}
            className={cn(
              "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-16 text-center transition",
              drag ? "border-primary bg-primary-soft" : "border-border",
            )}
          >
            <span className="rounded-2xl bg-primary-soft p-4 text-primary">
              <ScanLine className="h-8 w-8" />
            </span>
            <h2 className="mt-4 text-lg font-semibold">Drop the scanned registration form here</h2>
            <p className="mt-1 text-sm text-muted-foreground">JPG, PNG or PDF · up to 10 MB</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button onClick={() => input.current?.click()}>
                <Upload className="mr-1.5 h-4 w-4" />
                Browse files
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  toast.info("Camera capture simulated");
                  start(null);
                }}
              >
                <Camera className="mr-1.5 h-4 w-4" />
                Use camera
              </Button>
              <Button variant="ghost" onClick={() => start(null)}>
                Use sample form
              </Button>
            </div>
            <input
              ref={input}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => start(e.target.files?.[0] ?? null)}
            />
          </div>
        </Panel>
      )}

      {stage === "processing" && (
        <Panel>
          <div className="mx-auto max-w-md py-12 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 font-semibold">Extracting information from {file?.name}…</p>
            <Progress value={progress} className="mt-4" />
            <p className="mt-2 text-xs text-muted-foreground">
              {progress < 40
                ? "Detecting form layout"
                : progress < 80
                  ? "Reading handwritten fields"
                  : "Scoring confidence"}{" "}
              · {progress}%
            </p>
          </div>
        </Panel>
      )}

      {stage === "review" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel
            title={
              <span className="flex items-center gap-2">
                <FileImage className="h-4 w-4" />
                {file?.name}
              </span>
            }
          >
            {file?.url ? (
              <img
                src={file.url}
                alt="Uploaded registration form"
                className="w-full rounded-lg border"
              />
            ) : (
              <div className="aspect-[3/4] space-y-3 rounded-lg border bg-muted/40 p-6 font-mono text-xs text-muted-foreground">
                <p className="text-center text-sm font-bold text-foreground">
                  CRUZ NERY DENTAL CLINIC — PATIENT REGISTRATION
                </p>
                {fields.map((f) => (
                  <p key={f.key} className="border-b border-dashed pb-1">
                    {f.label}:{" "}
                    <span className="italic text-foreground/70">{orig[f.key] || "__________"}</span>
                  </p>
                ))}
              </div>
            )}
          </Panel>
          <Panel
            title="Extracted fields"
            action={<span className="text-xs text-muted-foreground">Draft autosaved</span>}
          >
            <Callout
              tone={canSave ? "success" : "warning"}
              className="mb-4"
              title={
                canSave ? "All fields reviewed" : `${pending.length} field(s) need your review`
              }
            >
              Low-confidence, missing or unclear values are highlighted. Tick each field once
              verified.
            </Callout>
            <div className="space-y-3">
              {fields.map((f) => {
                const bad = problem(f);
                const tone =
                  f.confidence >= 85 ? "success" : f.confidence >= 65 ? "warning" : "danger";
                const corrected = f.value !== orig[f.key];
                return (
                  <div
                    key={f.key}
                    className={cn(
                      "rounded-xl border p-3",
                      bad
                        ? "border-danger/50 bg-danger-soft/40"
                        : !reviewed[f.key]
                          ? "border-warning/50 bg-warning-soft/40"
                          : "",
                    )}
                  >
                    <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                      <label htmlFor={f.key} className="text-sm font-medium">
                        {f.label}
                        {f.required && <span className="text-danger"> *</span>}
                      </label>
                      <div className="flex items-center gap-2">
                        {corrected && <StatusBadge status="Corrected" tone="info" />}
                        <StatusBadge
                          status={f.confidence ? `${f.confidence}% confidence` : "Missing"}
                          tone={f.confidence ? tone : "danger"}
                        />
                      </div>
                    </div>
                    <Input
                      id={f.key}
                      type={f.type === "date" && !bad ? "date" : "text"}
                      value={f.value}
                      onChange={(e) =>
                        setFields((all) =>
                          all.map((x) => (x.key === f.key ? { ...x, value: e.target.value } : x)),
                        )
                      }
                      placeholder={f.key === "dob" ? "YYYY-MM-DD" : undefined}
                    />
                    {bad && (
                      <p className="mt-1 text-xs text-danger">
                        {!f.value.trim()
                          ? `Please enter the patient's ${f.label.toLowerCase()} (or "None").`
                          : "Unclear characters detected — please correct."}
                      </p>
                    )}
                    <label className="mt-2 flex items-center gap-2 text-xs">
                      <Checkbox
                        checked={!!reviewed[f.key]}
                        disabled={bad}
                        onCheckedChange={(v) => setReviewed((r) => ({ ...r, [f.key]: !!v }))}
                      />{" "}
                      Verified by receptionist
                    </label>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 flex flex-wrap justify-end gap-2 border-t pt-4">
              <Button variant="ghost" className="text-danger" onClick={() => setDiscard(true)}>
                <Trash2 className="mr-1.5 h-4 w-4" />
                Discard draft
              </Button>
              <Button variant="outline" onClick={() => start(null)}>
                <RefreshCw className="mr-1.5 h-4 w-4" />
                Reprocess OCR
              </Button>
              <Button disabled={!canSave} onClick={save}>
                Save verified record
              </Button>
            </div>
          </Panel>
        </div>
      )}

      {stage === "done" && (
        <Panel>
          <div className="mx-auto max-w-lg py-8 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
            <h2 className="mt-3 text-xl font-bold">Verified record saved</h2>
            <p className="text-sm text-muted-foreground">
              {fields[0]?.value} · {savedId}
            </p>
            <dl className="mt-6 grid grid-cols-2 gap-3 rounded-xl border p-4 text-left text-sm">
              {fields.slice(1, 7).map((f) => (
                <div key={f.key}>
                  <dt className="text-xs text-muted-foreground">{f.label}</dt>
                  <dd className="font-medium">{f.value || "—"}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button asChild variant="outline">
                <Link to="/staff/patients/$id" params={{ id: savedId }}>
                  Open patient profile
                </Link>
              </Button>
              <Button
                onClick={() => {
                  setPatients((all) =>
                    all.map((p) => (p.id === savedId ? { ...p, portal: "Active" } : p)),
                  );
                  toast.success("Patient Portal account created");
                }}
              >
                <KeyRound className="mr-1.5 h-4 w-4" />
                Create linked portal account
              </Button>
              <Button variant="ghost" onClick={reset}>
                Register another
              </Button>
            </div>
          </div>
        </Panel>
      )}

      <AlertDialog open={discard} onOpenChange={setDiscard}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard this draft?</AlertDialogTitle>
            <AlertDialogDescription>
              Extracted data and your corrections will be removed. This can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep editing</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                reset();
                toast("Draft discarded");
              }}
            >
              Discard draft
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
