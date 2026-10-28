import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  FileText,
  Home,
  LogOut,
  MessageSquare,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { Logo } from "@/components/app/Logo";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/app/kit";
import { useStore } from "@/lib/store";

const NAV = [
  { to: "/patient/dashboard", label: "Home", icon: Home },
  { to: "/patient/records", label: "My records", icon: FileText },
  { to: "/patient/tooth-history", label: "Tooth history", icon: UserRound },
  { to: "/patient/schedules", label: "Follow-up schedules", icon: MessageSquare },
  { to: "/patient/notifications", label: "Notifications", icon: MessageSquare },
  { to: "/patient/instructions", label: "Instructions", icon: BookOpen },
  { to: "/patient/profile", label: "Profile", icon: ShieldCheck },
] as const;

export function PatientPortalShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const { role, setRole } = useStore();
  const location = useLocation();
  const nav = useNavigate();

  useEffect(() => {
    if (role !== "patient") nav({ to: "/login", search: { mode: "patient" } });
  }, [nav, role]);

  if (role !== "patient") return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <Logo />
          <Button
            variant="ghost"
            size="sm"
            data-testid="patient-logout"
            aria-label="Log out of patient portal"
            onClick={() => {
              setRole(null);
              nav({ to: "/login", search: { mode: "patient", signedOut: true } });
            }}
          >
            <LogOut className="mr-1.5 h-4 w-4" /> Log out
          </Button>
        </div>
        <nav
          aria-label="Patient portal"
          className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-5 pb-3"
        >
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium ${location.pathname === to ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            >
              <Icon className="h-4 w-4" /> {label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl space-y-6 p-5">
        <div>
          <p className="text-sm font-medium text-primary">Maria L. Santos · P-1001</p>
          <h1 className="mt-1 text-2xl font-bold">{title}</h1>
          <p className="mt-1 text-muted-foreground">{description}</p>
        </div>
        <Callout tone="info" title="Information-only portal">
          Your dentist or authorized clinic staff arrange follow-up schedules. You cannot book,
          cancel, or reschedule appointments here.
        </Callout>
        {children}
        <p className="border-t pt-5 text-xs text-muted-foreground">
          Front-end prototype. Data shown is for demonstration purposes only.
        </p>
      </main>
    </div>
  );
}
