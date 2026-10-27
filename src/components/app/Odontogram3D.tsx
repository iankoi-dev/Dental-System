import { useRef, useState } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CONDITION_META,
  LOWER,
  UPPER,
  type ToothCondition,
  type ToothRecord,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const FILL: Record<ToothCondition, string> = {
  healthy: "from-card to-success-soft border-success/50",
  review: "from-warning-soft to-warning/40 border-warning",
  treated: "from-info-soft to-info/40 border-info",
  attention: "from-danger-soft to-danger/45 border-danger",
  missing: "from-muted to-muted border-dashed border-neutral/50 opacity-60",
};
const SIZE: Record<number, number> = { 8: 34, 7: 36, 6: 38, 5: 28, 4: 28, 3: 26, 2: 24, 1: 28 };

export function Legend() {
  return (
    <div className="flex flex-wrap gap-3 text-xs">
      {(Object.keys(CONDITION_META) as ToothCondition[]).map((c) => (
        <span key={c} className="flex items-center gap-1.5">
          <span className={cn("h-3 w-3 rounded border bg-gradient-to-b", FILL[c])} />
          {CONDITION_META[c].label}
        </span>
      ))}
    </div>
  );
}

export function Odontogram3D({
  teeth,
  selected,
  onSelect,
  simple,
}: {
  teeth: Record<number, ToothRecord>;
  selected?: number;
  onSelect: (n: number) => void;
  simple?: boolean;
}) {
  const [rx, setRx] = useState(simple ? 0 : 48);
  const [rz, setRz] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; shift: boolean; moved: boolean } | null>(null);

  const reset = () => {
    setRx(simple ? 0 : 48);
    setRz(0);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  function place(list: number[], upper: boolean) {
    return list.map((n, i) => {
      const a = Math.PI * (0.06 + (0.88 * i) / (list.length - 1));
      const x = -Math.cos(a) * 190;
      const y = (upper ? -1 : 1) * (Math.sin(a) * 120 + 22);
      const s = SIZE[n % 10];
      const t = teeth[n];
      return (
        <button
          key={n}
          type="button"
          onClick={() => !drag.current?.moved && onSelect(n)}
          aria-label={`Tooth ${n}, ${CONDITION_META[t.condition].label}`}
          aria-pressed={selected === n}
          className="absolute left-1/2 top-1/2 preserve-3d focus-visible:outline-none"
          style={{
            transform: `translate3d(${x - s / 2}px, ${y - s / 2}px, 0) rotateZ(${-rz}deg) rotateX(${-rx}deg)`,
          }}
        >
          <span
            className={cn(
              "flex items-center justify-center border-2 bg-gradient-to-b text-[10px] font-bold text-foreground/80 shadow-soft transition-transform hover:scale-110",
              FILL[t.condition],
              selected === n && "scale-125 ring-4 ring-primary/40",
            )}
            style={{
              width: s,
              height: s * 1.15,
              borderRadius: upper
                ? `${s / 2.2}px ${s / 2.2}px ${s / 3}px ${s / 3}px`
                : `${s / 3}px ${s / 3}px ${s / 2.2}px ${s / 2.2}px`,
            }}
          >
            {n}
          </span>
        </button>
      );
    });
  }

  return (
    <div className="relative">
      <div
        className="relative h-[440px] touch-none select-none overflow-hidden rounded-2xl border bg-gradient-to-b from-primary-soft/60 to-card dot-grid"
        style={{ perspective: "1100px", cursor: drag.current ? "grabbing" : "grab" }}
        onPointerDown={(e) => {
          drag.current = {
            x: e.clientX,
            y: e.clientY,
            shift: e.shiftKey || e.button === 2,
            moved: false,
          };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          const dx = e.clientX - d.x,
            dy = e.clientY - d.y;
          if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true;
          if (d.shift) setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
          else {
            setRz((r) => r + dx * 0.4);
            setRx((r) => Math.max(0, Math.min(75, r - dy * 0.3)));
          }
          d.x = e.clientX;
          d.y = e.clientY;
        }}
        onPointerUp={() => setTimeout(() => (drag.current = null), 0)}
        onPointerLeave={() => (drag.current = null)}
        onWheel={(e) => setZoom((z) => Math.max(0.6, Math.min(1.8, z - e.deltaY * 0.001)))}
        onContextMenu={(e) => e.preventDefault()}
      >
        <div
          className="absolute inset-0 preserve-3d"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotateX(${rx}deg) rotateZ(${rz}deg)`,
          }}
        >
          <div className="absolute left-1/2 top-1/2 h-[290px] w-[440px] -translate-x-1/2 -translate-y-[calc(50%+18px)] rounded-[50%_50%_10%_10%] border-[14px] border-b-0 border-danger-soft opacity-80" />
          <div className="absolute left-1/2 top-1/2 h-[290px] w-[440px] -translate-x-1/2 -translate-y-[calc(50%-18px)] rounded-[10%_10%_50%_50%] border-[14px] border-t-0 border-danger-soft opacity-80" />
          {place(UPPER, true)}
          {place(LOWER, false)}
        </div>
        <span className="absolute left-3 top-3 rounded-md bg-card/80 px-2 py-1 text-[11px] font-semibold text-muted-foreground">
          Upper arch
        </span>
        <span className="absolute bottom-3 left-3 rounded-md bg-card/80 px-2 py-1 text-[11px] font-semibold text-muted-foreground">
          Lower arch
        </span>
        <div className="absolute right-3 top-3 flex flex-col gap-1">
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8"
            aria-label="Zoom in"
            onClick={() => setZoom((z) => Math.min(1.8, z + 0.15))}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8"
            aria-label="Zoom out"
            onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8"
            aria-label="Reset view"
            onClick={reset}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        <p className="absolute bottom-3 right-3 hidden rounded-md bg-card/80 px-2 py-1 text-[11px] text-muted-foreground sm:block">
          Drag to rotate · Shift/right-drag to pan · Scroll to zoom
        </p>
      </div>
    </div>
  );
}
