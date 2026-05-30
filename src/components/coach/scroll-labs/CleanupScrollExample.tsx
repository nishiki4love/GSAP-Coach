import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsapSetup";
import { RefreshCw } from "lucide-react";
import { useRef, useState } from "react";
import { cleanupCards, getLocalizedCopy } from "./data";

interface CleanupScrollExampleProps {
  onStageStatusChange: (status: string) => void;
}

/** refresh 与 cleanup 示例：演示 batch 创建、内容变化后的 refresh，以及路由切换时的自动清理。 */
export function CleanupScrollExample({ onStageStatusChange }: CleanupScrollExampleProps) {
  const { locale, t } = useI18n();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [cycle, setCycle] = useState(0);
  const visibleCards = cleanupCards.slice(0, cycle % 2 === 0 ? 4 : 3);

  useGSAP(
    () => {
      const q = gsap.utils.selector(rootRef);
      const cards = q(".cleanup-trigger-card");
      gsap.set(cards, { autoAlpha: 0, y: 28 });

      ScrollTrigger.batch(cards, {
        interval: 0.08,
        batchMax: 3,
        start: "top 88%",
        onEnter: (batch) => {
          gsap.to(batch, { autoAlpha: 1, y: 0, stagger: 0.06, overwrite: true });
          onStageStatusChange(`ScrollTrigger.batch(): ${batch.length}`);
        },
        onLeaveBack: (batch) => gsap.set(batch, { autoAlpha: 0.5, y: 16, overwrite: true }),
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { scope: rootRef, dependencies: [cycle, locale, onStageStatusChange], revertOnUpdate: true },
  );

  return (
    <section ref={rootRef} className="rounded-xl border bg-card p-4 md:p-6">
      <div className="grid gap-5 lg:grid-cols-[0.7fr_1fr] lg:items-start">
        <div className="sticky top-24 flex flex-col gap-4">
          <Badge variant="secondary" className="w-fit font-mono">{t("scroll.cleanup")}</Badge>
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">{t("scroll.cleanupTitle")}</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{t("scroll.cleanupCopy")}</p>
          </div>
          <Button
            variant="outline"
            className="w-fit"
            onClick={() => {
              setCycle((current) => current + 1);
              onStageStatusChange(t("scroll.cleanupRefresh"));
            }}
          >
            <RefreshCw data-icon="inline-start" />
            {t("scroll.cleanupRefresh")}
          </Button>
        </div>

        <div className="grid min-h-[960px] content-start gap-4">
          {visibleCards.map((item, index) => (
            <Card key={`${item.api}-${cycle}`} className="cleanup-trigger-card">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <Badge variant="outline" className="font-mono">{String(index + 1).padStart(2, "0")}</Badge>
                  <span className="truncate font-mono text-xs text-muted-foreground">{item.api}</span>
                </div>
                <CardTitle>{getLocalizedCopy(item.title, locale)}</CardTitle>
                <CardDescription className="leading-6">{getLocalizedCopy(item.copy, locale)}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-muted-foreground">
                {t("scroll.cleanupCardBody")}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
