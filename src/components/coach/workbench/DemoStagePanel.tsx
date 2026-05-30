import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";

interface DemoStagePanelProps {
  observerHint: string;
  stageStatus: string;
}

/** GSAP 演示舞台：只保留会被动画命中的 DOM，避免和控制面板状态混在一起。 */
export function DemoStagePanel({ observerHint, stageStatus }: DemoStagePanelProps) {
  const { t } = useI18n();

  return (
    <Card>
      <CardContent>
        <div className="demo-stage relative min-h-[440px] overflow-hidden rounded-lg border bg-card p-4 shadow-sm">
          <div className="stage-grid" />
          <div className="cursor-follower stage-animated" />

          <div className="stage-canvas relative min-h-[360px] overflow-hidden rounded-lg border bg-[hsl(var(--stage-hue),42%,97%)] p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <p className="split-demo-title text-lg font-semibold">{t("workbench.brand")}</p>
                <p className="scramble-status text-xs text-muted-foreground">{stageStatus}</p>
              </div>
              <Badge variant="secondary" className="font-mono">{observerHint}</Badge>
            </div>

            <svg className="stage-animated absolute inset-x-6 top-20 h-44 w-[calc(100%-48px)]" viewBox="0 0 520 180" aria-hidden="true">
              <path id="motion-path" d="M24 126 C130 22, 220 154, 332 58 S452 88, 496 28" fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="2" />
              <path id="draw-route" d="M24 126 C130 22, 220 154, 332 58 S452 88, 496 28" fill="none" stroke="#6fb936" strokeWidth="4" strokeLinecap="round" />
              <g className="svg-orbit stage-animated">
                <circle cx="120" cy="72" r="20" fill="#19bfe8" opacity="0.16" />
                <circle cx="145" cy="72" r="5" fill="#19bfe8" />
              </g>
              <path id="morph-start" d="M403 128 L431 76 L459 128 Z" fill="none" stroke="transparent" />
              <path id="morph-target" d="M410 78 C440 42, 484 78, 454 128 C437 154, 393 133, 410 78 Z" fill="none" stroke="transparent" />
              <path id="morph-live" d="M403 128 L431 76 L459 128 Z" fill="#f6b63d" stroke="currentColor" strokeWidth="2" />
            </svg>

            <div className="pulse-row absolute left-8 top-[220px] flex gap-2">
              {Array.from({ length: 13 }).map((_, index) => (
                <span key={index} className="pulse-dot stage-animated size-3 rounded-full bg-foreground/80" />
              ))}
            </div>

            <div className="core-box drag-card stage-animated absolute left-8 top-32 grid size-20 cursor-grab place-items-center rounded-lg border bg-card text-center text-xs font-semibold shadow-sm active:cursor-grabbing">
              drag
            </div>
            <div className="motion-dot stage-animated absolute left-0 top-0 h-4 w-8 rounded-full bg-cyanline shadow-sm" />
            <div className="physics-ball stage-animated absolute bottom-10 left-16 size-8 rounded-full bg-amberline shadow-sm" />
            <div className="physics-prop stage-animated absolute bottom-12 left-24 h-4 w-14 rounded-md bg-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
