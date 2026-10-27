import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Info,
  Lock,
  Sparkles,
  XCircle,
  Circle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tone } from "@/lib/mock-data";

const TONE: Record<Tone, string> = {
  success: "bg-success-soft text-success",
  info: "bg-info-soft text-info",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  neutral: "bg-neutral-soft text-neutral",
  primary: "bg-primary-soft text-primary",
};
const ICON: Record<Tone, LucideIcon> = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  danger: XCircle,
  neutral: Circle,
  primary: Info,
};

export function toneFor(status: string): Tone {
  const s = status.toLowerCase();
  if (/(completed|available|active|success|verified|safe|healthy|confirmed|low$|pass)/.test(s))
    return "success";
  if (/(in service|reserved|scheduled|info|treated|called|in use)/.test(s)) return "info";
  if (
    /(waiting|near expiry|low stock|warning|review|moderate|on leave|maintenance|pending|rescheduled|high)/.test(
      s,
    )
  )
    return "warning";
  if (/(expired|conflict|failed|critical|damaged|recalled|attention|blocked)/.test(s))
    return "danger";
  return "neutral";
}

export function StatusBadge({
  status,
  tone,
  className,
}: {
  status: string;
  tone?: Tone;
  className?: string;
}) {
  const t = tone ?? toneFor(status);
  const Icon = ICON[t];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold",
        TONE[t],
        className,
      )}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {status}
    </span>
  );
}

export function Callout({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: Tone;
  title?: string;
  children?: ReactNode;
  className?: string;
}) {
  const Icon = ICON[tone];
  return (
    <div
      role="note"
      className={cn(
        "flex gap-3 rounded-xl border border-transparent p-4 text-sm",
        TONE[tone],
        className,
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <div className="text-foreground/85">
        {title && <p className="font-semibold text-foreground">{title}</p>}
        {children}
      </div>
    </div>
  );
}

export function AIBadge({ label = "AI decision support" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-ai-soft px-2.5 py-0.5 text-xs font-semibold text-ai">
      <Sparkles className="h-3 w-3" aria-hidden /> {label}
    </span>
  );
}

export function PageHeader({
  title,
  description,
  crumbs,
  actions,
}: {
  title: string;
  description?: string;
  crumbs?: { label: string; to?: string }[];
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <nav
          aria-label="Breadcrumb"
          className="mb-2 flex flex-wrap items-center gap-1 text-xs text-muted-foreground"
        >
          <Link to="/staff/dashboard" className="hover:text-primary">
            Dashboard
          </Link>
          {crumbs?.map((c) => (
            <span key={c.label} className="flex items-center gap-1">
              <ChevronRight className="h-3 w-3" aria-hidden />
              {c.to ? (
                <Link to={c.to} className="hover:text-primary">
                  {c.label}
                </Link>
              ) : (
                <span className="text-foreground">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="text-2xl font-bold tracking-tight md:text-[28px]">{title}</h1>
        {description && (
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
  hint,
}: {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  tone?: Tone;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-soft">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <span className={cn("rounded-lg p-1.5", TONE[tone])}>
          <Icon className="h-4 w-4" aria-hidden />
        </span>
      </div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
  className,
}: {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border bg-card shadow-soft", className)}>
      {title && (
        <header className="flex items-center justify-between gap-2 border-b px-5 py-3.5">
          <h2 className="text-base font-semibold">{title}</h2>
          {action}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Restricted({ what = "this page" }: { what?: string }) {
  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border bg-card p-8 text-center shadow-soft">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-soft">
        <Lock className="h-5 w-5 text-neutral" />
      </div>
      <h1 className="text-lg font-semibold">Access restricted</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Your current role doesn't have permission to view {what}. Switch roles from your profile
        menu or contact an administrator.
      </p>
      <Link
        to="/staff/dashboard"
        className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
      >
        Back to dashboard
      </Link>
    </div>
  );
}

export function Empty({
  icon: Icon,
  title,
  body,
}: {
  icon: LucideIcon;
  title: string;
  body?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="mb-3 rounded-full bg-muted p-3">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="font-semibold">{title}</p>
      {body && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{body}</p>}
    </div>
  );
}

export function DataTable({
  head,
  children,
  className,
}: {
  head: string[];
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("overflow-x-auto rounded-xl border", className)}>
      <table className="w-full text-sm">
        <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="whitespace-nowrap px-4 py-2.5 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y [&>tr:nth-child(even)]:bg-muted/25 [&>tr:hover]:bg-accent/40">
          {children}
        </tbody>
      </table>
    </div>
  );
}
export const Td = ({ children, className }: { children?: ReactNode; className?: string }) => (
  <td className={cn("whitespace-nowrap px-4 py-3", className)}>{children}</td>
);

export function Field({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">
        {label}
        {required && <span className="text-danger"> *</span>}
      </span>
      {children}
      {error ? (
        <span className="block text-xs text-danger">{error}</span>
      ) : hint ? (
        <span className="block text-xs text-muted-foreground">{hint}</span>
      ) : null}
    </label>
  );
}

export const selectCls =
  "flex h-9 w-full rounded-md border border-input bg-card px-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function Disclaimer({ className }: { className?: string }) {
  return (
    <p className={cn("text-xs text-muted-foreground", className)}>
      Front-end prototype. Data shown is for demonstration purposes only.
    </p>
  );
}
