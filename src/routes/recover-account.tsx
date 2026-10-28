import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/app/Logo";
import { Field } from "@/components/app/kit";

export const Route = createFileRoute("/recover-account")({
  head: () => ({
    meta: [
      { title: "Account recovery — Dentriq" },
      { name: "description", content: "Request recovery instructions for your Dentriq account." },
      { property: "og:title", content: "Account recovery — Dentriq" },
      { property: "og:description", content: "Recover access to your Dentriq account." },
    ],
  }),
  component: Recover,
});

function Recover() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "sent">("idle");
  const [err, setErr] = useState("");
  return (
    <div className="flex min-h-screen items-center justify-center bg-hero p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex justify-center">
          <Logo />
        </Link>
        <div className="rounded-3xl border bg-card p-6 shadow-lift md:p-8">
          {state === "sent" ? (
            <div className="text-center">
              <MailCheck className="mx-auto h-10 w-10 text-success" />
              <h1 className="mt-3 text-xl font-bold">Check your email</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                If an account exists for {email}, recovery instructions have been sent. Clinic staff
                may need to verify your identity in person.
              </p>
              <Button asChild className="mt-6 w-full">
                <Link to="/login" search={{ mode: "staff" }}>
                  Back to sign in
                </Link>
              </Button>
            </div>
          ) : (
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!email.includes("@"))
                  return setErr("Please enter the email linked to your account.");
                setErr("");
                setState("busy");
                await new Promise((r) => setTimeout(r, 900));
                setState("sent");
              }}
            >
              <div>
                <h1 className="text-xl font-bold">Recover your account</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  We'll send instructions to reset your password.
                </p>
              </div>
              <Field label="Email address" required error={err}>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                />
              </Field>
              <Button type="submit" className="w-full" disabled={state === "busy"}>
                {state === "busy" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Send recovery
                instructions
              </Button>
              <Link
                to="/login"
                search={{ mode: "staff" }}
                className="block text-center text-sm font-medium text-primary hover:underline"
              >
                Back to sign in
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
