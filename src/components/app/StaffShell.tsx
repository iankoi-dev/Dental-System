import { useEffect, useMemo, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  Bell,
  Boxes,
  CalendarClock,
  ClipboardList,
  Database,
  FileBarChart,
  HelpCircle,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Menu,
  Network,
  Package,
  ScanLine,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User,
  Users,
  X,
  Wrench,
  Smile,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { can, type NavKey } from "@/lib/permissions";
import { ITEMS, NOTIFICATIONS, ROLE_LABELS, type Role } from "@/lib/mock-data";
import { Logo } from "./Logo";
import { AIChat } from "./AIChat";
import { Callout } from "./kit";
import { cn } from "@/lib/utils";

const NAV: {
  group: string;
  items: { key: NavKey; label: string; to: string; icon: typeof Users }[];
}[] = [
  {
    group: "Clinic",
    items: [
      { key: "dashboard", label: "Dashboard", to: "/staff/dashboard", icon: LayoutDashboard },
      { key: "patients", label: "Patients", to: "/staff/patients", icon: Users },
      {
        key: "registration",
        label: "Patient Registration",
        to: "/staff/registration",
        icon: ScanLine,
      },
      { key: "odontogram", label: "3D Odontogram", to: "/staff/odontogram/P-1001", icon: Smile },
      { key: "queue", label: "Walk-In Queue", to: "/staff/queue", icon: ListOrdered },
      {
        key: "schedules",
        label: "Follow-Up Schedules",
        to: "/staff/schedules",
        icon: CalendarClock,
      },
    ],
  },
  {
    group: "Intelligence",
    items: [
      { key: "ai", label: "AI Assistant", to: "/staff/ai-assistant", icon: Sparkles },
      { key: "impact", label: "Change-Impact Review", to: "/staff/change-impact", icon: Network },
    ],
  },
  {
    group: "Inventory",
    items: [
      { key: "inventory", label: "Inventory", to: "/staff/inventory", icon: Package },
      { key: "batches", label: "Batches & FIFO", to: "/staff/inventory/batches", icon: Boxes },
      {
        key: "forecast",
        label: "Inventory Forecast",
        to: "/staff/inventory/forecasts",
        icon: TrendingUp,
      },
    ],
  },
  {
    group: "Oversight",
    items: [
      { key: "reports", label: "Reports", to: "/staff/reports", icon: FileBarChart },
      { key: "audit", label: "Audit Logs", to: "/staff/audit-logs", icon: ClipboardList },
    ],
  },
  {
    group: "Administration",
    items: [
      { key: "users", label: "Users and Roles", to: "/admin/users", icon: ShieldCheck },
      { key: "resources", label: "Resources", to: "/admin/resources", icon: Wrench },
      { key: "plans", label: "Treatment Plans", to: "/admin/treatment-plans", icon: Activity },
      { key: "backup", label: "Backup and Recovery", to: "/admin/backup", icon: Database },
    ],
  },
];

function SideNav({ onNav }: { onNav?: () => void }) {
  const { role } = useStore();
  const { pathname } = useLocation();
  return (
    <nav aria-label="Main" className="space-y-5 px-3 py-4">
      {NAV.map((g) => {
        const items = g.items.filter((i) => can(role, i.key));
        if (!items.length) return null;
        return (
          <div key={g.group}>
            <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {g.group}
            </p>
            {items.map((i) => {
              const base = i.to.split("/").slice(0, 3).join("/");
              const active =
                i.key === "inventory"
                  ? pathname === "/staff/inventory"
                  : i.key === "users"
                    ? pathname.startsWith("/admin/users") || pathname.startsWith("/admin/roles")
                    : pathname.startsWith(i.key === "odontogram" ? base : i.to);
              return (
                <Link
                  key={i.key}
                  to={i.to}
                  onClick={onNav}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-muted",
                  )}
                >
                  <i.icon className={cn("h-4 w-4", active && "text-primary")} aria-hidden />{" "}
                  {i.label}
                </Link>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
}

function GlobalSearch() {
  const { patients, schedules } = useStore();
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const results = useMemo(() => {
    if (q.trim().length < 2) return [];
    const s = q.toLowerCase();
    return [
      ...patients
        .filter((p) => (p.name + p.id).toLowerCase().includes(s))
        .map((p) => ({
          k: "Patient",
          label: `${p.name} · ${p.id}`,
          go: () => nav({ to: "/staff/patients/$id", params: { id: p.id } }),
        })),
      ...schedules
        .filter((x) => (x.patient + x.procedure + x.id).toLowerCase().includes(s))
        .map((x) => ({
          k: "Schedule",
          label: `${x.id} · ${x.procedure} · ${x.date}`,
          go: () => nav({ to: "/staff/schedules" }),
        })),
      ...ITEMS.filter((i) => i.name.toLowerCase().includes(s)).map((i) => ({
        k: "Inventory",
        label: i.name,
        go: () => nav({ to: "/staff/inventory" }),
      })),
    ].slice(0, 8);
  }, [q, patients, schedules, nav]);
  return (
    <div className="relative hidden w-full max-w-md md:block">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search patients, schedules, inventory…"
        aria-label="Global search"
        className="h-9 w-full rounded-lg border bg-muted/50 pl-9 pr-3 text-sm focus:bg-card focus:outline-none focus:ring-2 focus:ring-ring"
      />
      {q.length >= 2 && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border bg-popover shadow-lift">
          {results.length === 0 ? (
            <p className="p-3 text-sm text-muted-foreground">No matches for “{q}”.</p>
          ) : (
            results.map((r) => (
              <button
                key={r.label}
                onClick={() => {
                  r.go();
                  setQ("");
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent"
              >
                <span className="w-16 shrink-0 text-[11px] font-semibold uppercase text-muted-foreground">
                  {r.k}
                </span>
                {r.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export function StaffShell() {
  const { hydrated, role, setRole, user } = useStore();
  const nav = useNavigate();
  const [mobile, setMobile] = useState(false);
  const [ai, setAi] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    if (!hydrated) return;
    if (!role) {
      nav({ to: "/login", search: { mode: "staff" } });
      return;
    }
    if (role === "patient") {
      nav({ to: "/patient/dashboard" });
      return;
    }

    const protectedRoute = [
      { prefix: "/admin/users", key: "users" as NavKey },
      { prefix: "/admin/roles", key: "roles" as NavKey },
      { prefix: "/admin/resources", key: "resources" as NavKey },
      { prefix: "/admin/treatment-plans", key: "plans" as NavKey },
      { prefix: "/admin/backup", key: "backup" as NavKey },
      { prefix: "/staff/registration", key: "registration" as NavKey },
      { prefix: "/staff/odontogram", key: "odontogram" as NavKey },
      { prefix: "/staff/queue", key: "queue" as NavKey },
      { prefix: "/staff/schedules", key: "schedules" as NavKey },
      { prefix: "/staff/ai-assistant", key: "ai" as NavKey },
      { prefix: "/staff/change-impact", key: "impact" as NavKey },
      { prefix: "/staff/inventory/batches", key: "batches" as NavKey },
      { prefix: "/staff/inventory/forecasts", key: "forecast" as NavKey },
      { prefix: "/staff/inventory", key: "inventory" as NavKey },
      { prefix: "/staff/reports", key: "reports" as NavKey },
      { prefix: "/staff/audit-logs", key: "audit" as NavKey },
      { prefix: "/staff/patients", key: "patients" as NavKey },
    ].find((route) => pathname.startsWith(route.prefix));

    if (protectedRoute && !can(role, protectedRoute.key)) {
      toast.error("You do not have access to that workspace.");
      nav({ to: "/staff/dashboard" });
    }
  }, [hydrated, role, nav, pathname]);

  if (!hydrated || !role || role === "patient")
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading workspace…
      </div>
    );

  const logout = () => {
    setRole(null);
    toast.success("Signed out");
    nav({ to: "/login", search: { mode: "staff" } });
  };
  const switchRole = (r: Role) => {
    setRole(r);
    toast.success(`Viewing as ${ROLE_LABELS[r]}`);
    nav({ to: r === "patient" ? "/patient/dashboard" : "/staff/dashboard" });
  };

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-sidebar lg:flex">
        <div className="flex h-16 items-center border-b px-5">
          <Link to="/staff/dashboard">
            <Logo />
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SideNav />
        </div>
        <p className="border-t px-5 py-3 text-[11px] leading-snug text-muted-foreground">
          AI-Assisted Dental Clinic Information System · Prototype
        </p>
      </aside>
      <Sheet open={mobile} onOpenChange={setMobile}>
        <SheetContent side="left" className="w-72 overflow-y-auto p-0">
          <SheetHeader className="border-b p-4">
            <SheetTitle>
              <Logo />
            </SheetTitle>
          </SheetHeader>
          <SideNav onNav={() => setMobile(false)} />
        </SheetContent>
      </Sheet>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-card/90 px-4 backdrop-blur md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobile(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="lg:hidden">
            <Logo compact />
          </div>
          <p className="hidden text-sm font-semibold xl:block">Cruz Nery Dental Clinic</p>
          <div className="flex flex-1 justify-center">
            <GlobalSearch />
          </div>
          <span className="hidden rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary sm:inline">
            {ROLE_LABELS[role]}
          </span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-96 max-w-[92vw] p-0">
              <div className="border-b px-4 py-3 font-semibold">Notifications</div>
              <div className="max-h-96 space-y-2 overflow-y-auto p-3">
                {NOTIFICATIONS.map((n) => (
                  <Callout key={n.id} tone={n.tone} title={n.title}>
                    <p>{n.body}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{n.time}</p>
                  </Callout>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-2 rounded-full p-0.5 pr-2 hover:bg-muted"
                aria-label="Profile menu"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {user!.name
                    .replace("Dr. ", "")
                    .split(" ")
                    .map((s) => s[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <span className="hidden text-sm font-medium md:block">{user!.name}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel>
                <p>{user!.name}</p>
                <p className="text-xs font-normal text-muted-foreground">{user!.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toast("Profile — prototype screen")}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast("Settings — prototype screen")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast("Help center — prototype screen")}>
                <HelpCircle className="mr-2 h-4 w-4" />
                Help
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Switch demo role</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
                    <DropdownMenuItem key={r} onClick={() => switchRole(r)}>
                      {ROLE_LABELS[r]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-danger">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="mx-auto max-w-[1400px] p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {can(role, "ai") && pathname !== "/staff/ai-assistant" && (
        <>
          {!ai && (
            <button
              onClick={() => setAi(true)}
              aria-label="Open AI assistant"
              className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lift transition hover:scale-105"
            >
              <Sparkles className="h-4 w-4" /> AI Assistant
            </button>
          )}
          {ai && (
            <div
              role="dialog"
              aria-label="AI assistant"
              className="fixed bottom-4 right-4 z-40 flex h-[560px] max-h-[80vh] w-[400px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border bg-card shadow-lift"
            >
              <div className="flex items-center justify-between border-b bg-ai-soft px-4 py-3">
                <p className="flex items-center gap-2 font-semibold">
                  <Sparkles className="h-4 w-4 text-ai" /> Dentriq Assistant
                </p>
                <button
                  onClick={() => setAi(false)}
                  aria-label="Close assistant"
                  className="rounded p-1 hover:bg-card"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <AIChat compact />
            </div>
          )}
        </>
      )}
    </div>
  );
}
