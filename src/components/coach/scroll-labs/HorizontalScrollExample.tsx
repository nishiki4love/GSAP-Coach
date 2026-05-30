import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsapSetup";
import { useRef } from "react";
import { getLocalizedCopy, horizontalPanels } from "./data";

interface HorizontalScrollExampleProps {
  onStageStatusChange: (status: string) => void;
}

/** 横向 containerAnimation 示例：顶层横向 tween 独立于垂直示例，便于单独学习和调试。 */
export function HorizontalScrollExample({ onStageStatusChange }: HorizontalScrollExampleProps) {
  const { locale, t } = useI18n();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const lastPercentRef = useRef(-1);

  useGSAP(
    () => {
      const q = gsap.utils.selector(rootRef);
      const lab = q(".horizontal-scroll-lab")[0] as HTMLElement | undefined;
      const track = q(".horizontal-track")[0] as HTMLElement | undefined;
      if (!lab || !track) return;

      const horizontalProgress = q(".horizontal-progress-fill");
      const panels = q(".horizontal-panel") as HTMLElement[];
      const getHorizontalTravel = () => Math.max(0, track.scrollWidth - lab.clientWidth + 40);
      lastPercentRef.current = -1;

      gsap.set(panels, { autoAlpha: 0.72, scale: 0.96 });

      const scrollTween = gsap.to(track, {
        x: () => -getHorizontalTravel(),
        ease: "none",
        scrollTrigger: {
          trigger: lab,
          start: "top top",
          end: () => `+=${Math.max(1200, getHorizontalTravel() + 700)}`,
          scrub: true,
          pin: true,
          pinSpacing: "margin",
          id: "horizontal-container",
          refreshPriority: 1,
          onUpdate: (self) => {
            const percent = Math.round(self.progress * 100);
            gsap.set(horizontalProgress, { scaleX: self.progress, transformOrigin: "left center" });
            if (percent !== lastPercentRef.current) {
              lastPercentRef.current = percent;
              onStageStatusChange(`${t("scroll.horizontal")} containerAnimation: ${percent}%`);
            }
          },
        },
      });

      panels.forEach((panel) => {
        const copy = panel.querySelector(".horizontal-panel-copy");
        const meter = panel.querySelector(".horizontal-panel-meter");
        const dot = panel.querySelector(".horizontal-panel-dot");

        gsap.to(panel, {
          autoAlpha: 1,
          scale: 1,
          scrollTrigger: {
            containerAnimation: scrollTween,
            trigger: panel,
            start: "left 78%",
            end: "center center",
            scrub: true,
          },
        });

        gsap.fromTo(
          copy,
          { y: 30, autoAlpha: 0.45 },
          {
            y: 0,
            autoAlpha: 1,
            scrollTrigger: {
              containerAnimation: scrollTween,
              trigger: panel,
              start: "left 72%",
              end: "center center",
              scrub: true,
            },
          },
        );

        gsap.fromTo(
          meter,
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: "left center",
            scrollTrigger: {
              containerAnimation: scrollTween,
              trigger: panel,
              start: "left 68%",
              end: "right 62%",
              scrub: true,
            },
          },
        );

        gsap.to(dot, {
          x: () => Math.min(280, panel.clientWidth * 0.42),
          rotation: 180,
          scrollTrigger: {
            containerAnimation: scrollTween,
            trigger: panel,
            start: "left 72%",
            end: "right 62%",
            scrub: true,
          },
        });
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { scope: rootRef, dependencies: [locale, onStageStatusChange, t], revertOnUpdate: true },
  );

  return (
    <div ref={rootRef} className="w-full min-w-0 max-w-full overflow-hidden">
      <section className="horizontal-scroll-lab min-h-[100svh] w-full max-w-full overflow-hidden rounded-xl border bg-card">
        <div className="flex min-h-[100svh] min-w-0 flex-col">
          <div className="flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-end lg:justify-between lg:p-5">
            <div className="min-w-0">
              <Badge variant="secondary" className="mb-3 font-mono">{t("scroll.horizontal")}</Badge>
              <h2 className="text-3xl font-semibold tracking-tight">{t("scroll.horizontalTitle")}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                {t("scroll.horizontalCopy")}
              </p>
            </div>
            <div className="w-full min-w-0 lg:max-w-sm">
              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>horizontal progress</span>
                <span className="font-mono">ease: none</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="horizontal-progress-fill h-full origin-left scale-x-0 rounded-full bg-primary" />
              </div>
            </div>
          </div>

          <div className="horizontal-track flex w-max max-w-none flex-1 items-center gap-4 px-4 py-4 lg:px-5 lg:py-5">
            {horizontalPanels.map((panel) => (
              <Card
                key={panel.label}
                className="horizontal-panel flex h-[68svh] w-[calc(100vw-5rem)] max-w-[720px] shrink-0 flex-col justify-between overflow-hidden sm:w-[72vw] lg:max-w-[760px]"
              >
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <Badge className="horizontal-panel-index font-mono">{panel.label}</Badge>
                    <span className="truncate font-mono text-xs text-muted-foreground">{panel.api}</span>
                  </div>
                  <CardTitle className="text-3xl">{getLocalizedCopy(panel.title, locale)}</CardTitle>
                  <CardDescription className="horizontal-panel-copy max-w-xl leading-6">
                    {getLocalizedCopy(panel.copy, locale)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-[0.65fr_1fr]">
                    <div className="rounded-lg bg-muted p-4">
                      <div className="text-xs font-medium text-muted-foreground">{t("scroll.panelMeter")}</div>
                      <div className="mt-8 h-2 overflow-hidden rounded-full bg-background">
                        <div className="horizontal-panel-meter h-full origin-left scale-x-0 rounded-full bg-limebeam" />
                      </div>
                    </div>
                    <div className="relative min-h-36 overflow-hidden rounded-lg border bg-background p-4">
                      <div className="absolute left-4 right-4 top-1/2 h-px bg-border" />
                      <div className="horizontal-panel-dot absolute left-4 top-1/2 size-8 -translate-y-1/2 rounded-md bg-primary" />
                      <div className="relative z-10 ml-auto max-w-44 text-right text-xs leading-5 text-muted-foreground">
                        {t("scroll.panelHint")}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
