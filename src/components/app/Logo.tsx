import { cn } from "@/lib/utils";

export function ToothMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-8 w-8", className)} aria-hidden>
      <rect width="32" height="32" rx="9" className="fill-primary" />
      <path
        d="M10.5 8.5c-2.4 0-4 1.9-4 4.6 0 2.4 1 4 1.6 6.2.6 2.3.9 5.2 2.6 5.2 1.5 0 1.6-2.4 2.3-4.3.4-1.1 1-1.6 3-1.6s2.6.5 3 1.6c.7 1.9.8 4.3 2.3 4.3 1.7 0 2-2.9 2.6-5.2.6-2.2 1.6-3.8 1.6-6.2 0-2.7-1.6-4.6-4-4.6-2.1 0-3 1.2-5.5 1.2s-3.4-1.2-5.5-1.2Z"
        className="fill-primary-foreground"
      />
    </svg>
  );
}

export function Logo({ compact }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <ToothMark />
      {!compact && (
        <div className="leading-tight">
          <p className="text-base font-bold tracking-tight">Dentriq</p>
          <p className="text-[11px] text-muted-foreground">Cruz Nery Dental Clinic</p>
        </div>
      )}
    </div>
  );
}
