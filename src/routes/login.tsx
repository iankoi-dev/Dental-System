import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/app/Logo";
import { Callout, Disclaimer, Field, selectCls } from "@/components/app/kit";
import { DEMO_USERS, ROLE_LABELS, type Role } from "@/lib/mock-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({
    mode: s.mode === "patient" ? ("patient" as const) : ("staff" as const),
  }),
  head: () => ({
    meta: [
      { title: "Sign in — Dentriq" },
      {
        name: "description",
        content: "Staff and patient portal sign-in for Dentriq at Cruz Nery Dental Clinic.",
      },
      { property: "og:title", content: "Sign in — Dentriq" },
      { property: "og:description", content: "Secure sign-in with multi-factor verification." },
    ],
  }),
  component: Login,
});

const STAFF_ROLES: Role[] = ["admin", "dentist", "receptionist", "inventory", "management"];

function Login() {
  const { mode } = Route.useSearch();
  const nav = useNavigate();
  const { setRole, log } = useStore();
  const [tab, setTab] = useState<"staff" | "patient">(mode);
  const [role, setR] = useState<Role>(mode === "patient" ? "patient" : "dentist");
  const [email, setEmail] = useState(DEMO_USERS[role].email);
  const [pw, setPw] = useState("demo1234");
  const [step, setStep] = useState<"cred" | "mfa">("cred");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const pickRole = (r: Role) => {
    setR(r);
    setEmail(DEMO_USERS[r].email);
  };
  const switchTab = (t: string) => {
    setTab(t as "staff" | "patient");
    pickRole(t === "patient" ? "patient" : "dentist");
    setStep("cred");
    setErr("");
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!email.includes("@")) return setErr("Please enter a valid email address.");
    if (pw.length < 6) return setErr("Password must be at least 6 characters.");
    setBusy(true);
    await new Promise((r) => setTimeout(r, 700));
    setBusy(false);
    setStep("mfa");
    toast.info("Verification code sent (demo code: 123456)");
  }
  async function verify() {
    setBusy(true);
    await new Promise((r) => setTimeout(r, 700));
    setBusy(false);
    if (code !== "123456") {
      setErr("That code doesn't match. Check the code and try again.");
      return;
    }
    setRole(role);
    log("Login + MFA", "Auth", DEMO_USERS[role].email, "MFA code verified.");
    toast.success(`Welcome, ${DEMO_USERS[role].name}`);
    nav({ to: role === "patient" ? "/patient/dashboard" : "/staff/dashboard" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-hero p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex justify-center">
          <Logo />
        </Link>
        <div className="rounded-3xl border bg-card p-6 shadow-lift md:p-8">
          {step === "cred" ? (
            <>
              <Tabs value={tab} onValueChange={switchTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="staff">Staff Login</TabsTrigger>
                  <TabsTrigger value="patient">Patient Portal</TabsTrigger>
                </TabsList>
              </Tabs>
              <form onSubmit={submit} className="mt-6 space-y-4">
                {tab === "staff" && (
                  <Field label="Demo role" hint="Prototype only — choose which role to preview.">
                    <select
                      className={selectCls}
                      value={role}
                      onChange={(e) => pickRole(e.target.value as Role)}
                    >
                      {STAFF_ROLES.map((r) => (
                        <option key={r} value={r}>
                          {ROLE_LABELS[r]}
                        </option>
                      ))}
                    </select>
                  </Field>
                )}
                <Field label="Email or username" required>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                  />
                </Field>
                <Field label="Password" required>
                  <Input
                    type="password"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    autoComplete="current-password"
                  />
                </Field>
                {err && <Callout tone="danger">{err}</Callout>}
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Continue
                </Button>
                <Link
                  to="/recover-account"
                  className="block text-center text-sm font-medium text-primary hover:underline"
                >
                  Forgot password or locked out?
                </Link>
              </form>
            </>
          ) : (
            <div className="space-y-5 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <div>
                <h1 className="text-xl font-bold">Two-step verification</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Enter the 6-digit code sent to {email}. Demo code: <b>123456</b>
                </p>
              </div>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={code}
                  onChange={(v) => {
                    setCode(v);
                    setErr("");
                  }}
                  aria-label="Verification code"
                >
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              {err && <Callout tone="danger">{err}</Callout>}
              <Button className="w-full" disabled={code.length < 6 || busy} onClick={verify}>
                {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Verify and sign in
              </Button>
              <div className="flex justify-between text-sm">
                <button
                  className="font-medium text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setStep("cred");
                    setCode("");
                    setErr("");
                  }}
                >
                  Back
                </button>
                <button
                  className="font-medium text-primary hover:underline"
                  onClick={() => toast.success("A new code was sent (demo: 123456)")}
                >
                  Resend code
                </button>
              </div>
            </div>
          )}
        </div>
        <Disclaimer className="mt-4 text-center" />
      </div>
    </div>
  );
}
