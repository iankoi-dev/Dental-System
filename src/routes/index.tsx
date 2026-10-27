import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  Brain,
  CalendarCheck2,
  ClipboardCheck,
  Lock,
  Network,
  ScanLine,
  ShieldCheck,
  Smile,
  TrendingUp,
  UserRoundCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/app/Logo";
import { AIBadge, Callout } from "@/components/app/kit";
import clinic from "@/assets/clinic.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dentriq — AI-Assisted Dental Clinic System | Cruz Nery Dental Clinic" },
      {
        name: "description",
        content:
          "Dentriq centralizes patient records, OCR registration, a 3D odontogram, walk-in queue, follow-ups, and FIFO inventory for Cruz Nery Dental Clinic.",
      },
      { property: "og:title", content: "Dentriq — Cruz Nery Dental Clinic" },
      {
        property: "og:description",
        content:
          "AI-Assisted Dental Clinic Information System with 3D Odontogram and Intelligent Workflow Automation.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    icon: ScanLine,
    t: "OCR-Assisted Patient Registration",
    d: "Scan paper forms; staff verify every field before saving.",
  },
  {
    icon: Smile,
    t: "3D Interactive Digital Odontogram",
    d: "Rotate, zoom and document tooth-level history.",
  },
  {
    icon: UserRoundCheck,
    t: "Walk-In Queue Management",
    d: "Walk-in-first flow with a controlled one-time overlap rule.",
  },
  {
    icon: CalendarCheck2,
    t: "Dentist-Arranged Follow-Ups",
    d: "Only dentists and authorized staff schedule follow-ups.",
  },
  {
    icon: Brain,
    t: "AI Workflow Assistance",
    d: "Find records and prepare drafts — never diagnose.",
  },
  {
    icon: Network,
    t: "AI Change-Impact Analysis",
    d: "Ten checks before any schedule change is confirmed.",
  },
  {
    icon: Boxes,
    t: "FIFO Inventory Management",
    d: "Deduct from the earliest eligible batch automatically.",
  },
  {
    icon: TrendingUp,
    t: "AI Inventory Forecasting",
    d: "Advisory shortage and expiry risk estimates.",
  },
  {
    icon: Lock,
    t: "Information-Only Patient Portal",
    d: "Patients view their own records and schedules.",
  },
  {
    icon: ShieldCheck,
    t: "Reports, Audit Logs & Security",
    d: "Role-based access, MFA and full audit trail.",
  },
];
const STEPS = [
  "Patient arrives and completes a paper registration form.",
  "Receptionist scans or photographs the form.",
  "OCR extracts available information.",
  "Receptionist verifies, corrects, and completes required fields.",
  "Verified patient record is saved.",
  "Patient may be given an information-only Patient Portal account.",
];

function Landing() {
  return (
    <div className="min-h-screen bg-hero">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <Logo />
        <div className="flex gap-2">
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link to="/login" search={{ mode: "patient" }}>
              Patient Portal
            </Link>
          </Button>
          <Button asChild>
            <Link to="/login" search={{ mode: "staff" }}>
              Staff Login
            </Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-8 lg:grid-cols-2 lg:pt-14">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-xs font-semibold text-primary">
            For Cruz Nery Dental Clinic
          </p>
          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight md:text-6xl">
            Dentriq
          </h1>
          <p className="mt-4 text-xl font-semibold text-foreground/80 md:text-2xl">
            AI-Assisted Dental Clinic Information System with 3D Odontogram and Intelligent Workflow
            Automation
          </p>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Centralized patient records, OCR-assisted registration, a walk-in-first workflow,
            dentist-arranged follow-ups, FIFO inventory, AI forecasting and secure information-only
            patient access — in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/login" search={{ mode: "staff" }}>
                Staff Login <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/login" search={{ mode: "patient" }}>
                Patient Portal
              </Link>
            </Button>
          </div>
        </div>
        <div className="relative">
          <img
            src={clinic}
            alt="Bright treatment room at Cruz Nery Dental Clinic"
            width={1280}
            height={896}
            className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lift"
          />
          <div className="absolute -bottom-6 left-4 right-4 rounded-2xl border bg-card/95 p-4 shadow-lift backdrop-blur sm:left-auto sm:w-80">
            <AIBadge label="Change-Impact Review" />
            <p className="mt-2 text-sm font-semibold">9 checks passed · 1 warning</p>
            <p className="text-xs text-muted-foreground">
              Root canal stage 2 — interval acknowledged by Dr. Cruz
            </p>
          </div>
        </div>
      </section>

      <section className="bg-card/70 py-16">
        <div className="mx-auto max-w-7xl px-5">
          <h2 className="text-2xl font-bold md:text-3xl">Everything the clinic runs on</h2>
          <p className="mt-2 text-muted-foreground">Ten modules, one consistent workspace.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {FEATURES.map((f) => (
              <div
                key={f.t}
                className="rounded-2xl border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
              >
                <span className="inline-flex rounded-xl bg-primary-soft p-2 text-primary">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3 text-sm font-semibold">{f.t}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold md:text-3xl">How it works</h2>
          <p className="mt-2 text-muted-foreground">
            A walk-in-first workflow with human verification at every step.
          </p>
          <ol className="mt-6 space-y-3">
            {STEPS.map((s, i) => (
              <li key={s} className="flex gap-4 rounded-xl border bg-card p-4 shadow-soft">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="text-sm">{s}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="space-y-4 lg:pt-16">
          <Callout tone="primary" title="Patients don't book follow-ups">
            Follow-up schedules are arranged by your dentist or authorized clinic staff. Patients
            cannot book, cancel, or reschedule schedules through the portal — they see their own
            schedules and instructions.
          </Callout>
          <Callout tone="info" title="AI is decision support only">
            AI organizes authorized information and flags scheduling or inventory risks. It never
            diagnoses, prescribes, or finalizes changes.
          </Callout>
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { i: ClipboardCheck, l: "Verified records" },
              { i: BarChart3, l: "Operational reports" },
              { i: ShieldCheck, l: "Audit trail" },
            ].map((x) => (
              <div key={x.l} className="rounded-xl border bg-card p-4 text-center shadow-soft">
                <x.i className="mx-auto h-5 w-5 text-primary" />
                <p className="mt-2 text-xs font-semibold">{x.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t bg-card/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold">Cruz Nery Dental Clinic</p>
            <p className="text-muted-foreground">
              Developed by Team SmartSmile Tech · Capstone project
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Front-end prototype. Data shown is for demonstration purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
}
