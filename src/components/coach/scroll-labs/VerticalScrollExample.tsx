import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsapSetup";
import { useRef } from "react";
import { getLocalizedCopy, verticalSteps } from "./data";

interface VerticalScrollExampleProps {
  onStageStatusChange: (status: string) => void;
}

/** Pin + scrub 垂直示例：只创建本示例需要的 ScrollTrigger，并在路由切换时清理。 */
export function VerticalScrollExample({ onStageStatusChange }: VerticalScrollExampleProps) {
  const { locale, t } = useI18n();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const lastPercentRef = useRef(-1);

  useGSAP(
    () => {
      const q = gsap.utils.selector(rootRef);
      const lab = q(".vertical-scroll-lab")[0] as HTMLElement | undefined;
      const rail = q(".vertical-rail")[0] as HTMLElement | undefined;
      const runner = q(".vertical-runner")[0] as HTMLElement | undefined;
      if (!lab || !rail) return;

      const cards = q(".vertical-step-card");
      const markers = q(".vertical-step-marker");
      lastPercentRef.current = -1;

      gsap.set(cards, { autoAlpha: 0.58, y: 22, scale: 0.98 });
      gsap.set(markers, { scale: 0.8 });
      gsap.set(q(".vertical-scroll-copy"), { autoAlpha: 0.55, y: 14 });

      const verticalTl = gsap.timeline({
        defaults: { duration: 1, ease: "none" },
        scrollTrigger: {
          trigger: lab,
          start: "top top",
          end: "+=1500",
          scrub: 1,
          pin: true,
          pinSpacing: "margin",
          id: "vertical-track",
          refreshPriority: 1,
          onUpdate: (self) => {
            const percent = Math.round(self.progress * 100);
            if (percent !== lastPercentRef.current) {
              lastPercentRef.current = percent;
              if (runner) runner.textContent = `${percent}%`;
              onStageStatusChange(`${t("scroll.vertical")} scrub: ${percent}%`);
            }
          },
        },
      });

      verticalTl
        .to(q(".vertical-scroll-copy"), { y: -6, autoAlpha: 1, duration: 0.35 }, 0)
        .to(q(".vertical-progress-fill"), { scaleY: 1, transformOrigin: "center top" }, 0)
        .to(runner ?? [], { y: () => Math.max(260, rail.clientHeight - 120) }, 0)
        .to(cards, { autoAlpha: 1, y: 0, scale: 1, duration: 0.72, stagger: 0.14 }, 0.08)
        .to(
          markers,
          {
            backgroundColor: "#a8ff04",
            borderColor: "#a8ff04",
            scale: 1.35,
            duration: 0.72,
            stagger: 0.14,
          },
          0.08,
        )
        .to(markers, { scale: 1, duration: 0.36, stagger: 0.14 }, 0.42);

      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { scope: rootRef, dependencies: [locale, onStageStatusChange, t], revertOnUpdate: true },
  );

  return (
    <div ref={rootRef}>
      <section className="vertical-scroll-lab min-h-[100svh] overflow-hidden rounded-xl border bg-primary p-4 text-primary-foreground md:p-8">
        <div className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-6xl flex-col justify-center gap-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <Badge variant="secondary" className="mb-3 font-mono">{t("scroll.vertical")}</Badge>
              <h2 className="text-3xl font-semibold">{t("scroll.verticalTitle")}</h2>
              <p className="vertical-scroll-copy mt-2 max-w-2xl text-sm leading-6 text-primary-foreground/70">
                {t("scroll.verticalCopy")}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {["pin", "scrub", "refresh"].map((item) => (
                <div key={item} className="rounded-md border border-primary-foreground/20 px-3 py-2">
                  <div className="font-mono text-primary-foreground">{item}</div>
                  <div className="mt-1 text-primary-foreground/55">{t("scroll.vertical")}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(220px,0.55fr)_minmax(0,1fr)]">
            <div className="vertical-rail relative min-h-[500px] rounded-lg border border-primary-foreground/20 bg-primary-foreground/6 p-6">
              <div className="absolute bottom-10 left-1/2 top-10 w-px -translate-x-1/2 bg-primary-foreground/20" />
              <div className="vertical-progress-fill absolute bottom-10 left-1/2 top-10 w-px -translate-x-1/2 origin-top scale-y-0 bg-cyanline" />
              <div className="vertical-runner absolute left-1/2 top-10 grid size-10 -translate-x-1/2 place-items-center rounded-full bg-limebeam font-mono text-xs font-semibold text-ink shadow-sm">
                0%
              </div>
              <div className="absolute bottom-10 left-6 right-6 top-10 flex flex-col justify-between">
                {verticalSteps.map((step) => (
                  <div key={step.label} className="flex items-center justify-between gap-4">
                    <span className="font-mono text-xs text-primary-foreground/60">{step.label}</span>
                    <span className="vertical-step-marker size-3 rounded-full border border-primary-foreground/35 bg-primary" />
                    <span className="max-w-24 truncate text-right text-xs text-primary-foreground/60">{step.api}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              {verticalSteps.map((step) => (
                <Card key={step.label} className="vertical-step-card shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                      <Badge variant="outline" className="font-mono">{step.label}</Badge>
                      <span className="truncate font-mono text-xs text-muted-foreground">{step.api}</span>
                    </div>
                    <CardTitle className="text-xl">{getLocalizedCopy(step.title, locale)}</CardTitle>
                    <CardDescription className="leading-6">{getLocalizedCopy(step.copy, locale)}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
