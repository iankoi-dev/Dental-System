import { useState } from "react";
import { Copy, Loader2, Send, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AI_PROMPTS } from "@/lib/mock-data";
import { askAssistant, type AIReply } from "@/lib/mock-service";
import { useStore } from "@/lib/store";
import { AIBadge } from "./kit";

type Msg = { from: "user"; text: string } | { from: "ai"; reply: AIReply };

export function AIChat({ compact }: { compact?: boolean }) {
  const { role, log } = useStore();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  async function send(q: string) {
    if (!q.trim() || busy) return;
    setMsgs((m) => [...m, { from: "user", text: q }]);
    setText("");
    setBusy(true);
    const reply = await askAssistant(q, role ?? "");
    setMsgs((m) => [...m, { from: "ai", reply }]);
    setBusy(false);
    log("AI assistant query", "AI Assistant", "—", `Prompt: '${q}'`);
  }

  return (
    <div className="flex h-full flex-col">
      <div
        className={
          compact ? "flex-1 space-y-3 overflow-y-auto p-4" : "flex-1 space-y-3 overflow-y-auto p-5"
        }
        aria-live="polite"
      >
        {msgs.length === 0 && (
          <div>
            <p className="mb-2 text-sm text-muted-foreground">Try a suggested prompt:</p>
            <div className="flex flex-wrap gap-2">
              {AI_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="rounded-full border bg-card px-3 py-1.5 text-left text-xs font-medium transition hover:border-primary hover:text-primary"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
        {msgs.map((m, i) =>
          m.from === "user" ? (
            <div
              key={i}
              className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-sm text-primary-foreground"
            >
              {m.text}
            </div>
          ) : (
            <div
              key={i}
              className="max-w-[92%] rounded-2xl rounded-bl-sm border border-ai/20 bg-ai-soft p-3.5 text-sm"
            >
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <AIBadge />
                <div className="flex gap-1">
                  <button
                    aria-label="Copy summary"
                    className="rounded p-1 text-muted-foreground hover:bg-card"
                    onClick={() => {
                      navigator.clipboard?.writeText(
                        [m.reply.title, ...m.reply.bullets].join("\n"),
                      );
                      toast.success("Summary copied");
                    }}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button
                    aria-label="Dismiss"
                    className="rounded p-1 text-muted-foreground hover:bg-card"
                    onClick={() => setMsgs((all) => all.filter((_, j) => j !== i))}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <p className="font-semibold">{m.reply.title}</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-4">
                {m.reply.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <p className="mt-2 text-xs italic text-ai">{m.reply.source}</p>
            </div>
          ),
        )}
        {busy && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Preparing a response…
          </div>
        )}
      </div>
      <div className="border-t p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(text);
          }}
          className="flex gap-2"
        >
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ask about records, schedules, resources…"
            aria-label="Message the AI assistant"
          />
          <Button type="submit" size="icon" disabled={!text.trim() || busy} aria-label="Send">
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <p className="mt-2 flex gap-1.5 text-[11px] leading-snug text-muted-foreground">
          <Sparkles className="h-3 w-3 shrink-0 text-ai" />
          AI assistance supports authorized workflow preparation. Clinical decisions and final
          schedule changes require authorized human confirmation.
        </p>
      </div>
    </div>
  );
}
