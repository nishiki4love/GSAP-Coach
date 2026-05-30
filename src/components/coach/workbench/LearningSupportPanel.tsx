import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { TutorialChapter } from "@/data/gsapApiCatalog";
import { useI18n } from "@/lib/i18n";
import { ArrowRight, Gauge, Puzzle } from "lucide-react";
import { NavLink } from "react-router";
import type { UtilitySnapshot } from "../types";

interface LearningSupportPanelProps {
  snapshot: UtilitySnapshot;
  selectedChapter: TutorialChapter;
}

const pluginNames = ["Flip", "Draggable + Inertia", "Observer", "SplitText", "DrawSVG / MorphSVG", "MotionPath / Physics"];

/** 工作台学习辅助区：把插件入口、教程步骤和 Utils 数据组织成连续教学面板。 */
export function LearningSupportPanel({ snapshot, selectedChapter }: LearningSupportPanelProps) {
  const { t } = useI18n();
  const meters = [
    ["normalize / clamp", snapshot.normalized],
    ["snap / mapRange", snapshot.snapped / 360],
    ["wrapYoyo", snapshot.yoyo / 100],
  ] as const;

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <CardTitle>{t("workbench.assistantTitle")}</CardTitle>
            <CardDescription className="mt-1 max-w-2xl leading-6">{t("workbench.assistantDescription")}</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            render={<NavLink to="/plugins" />}
            nativeButton={false}
          >
            {t("workbench.openPluginLab")}
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <section className="rounded-lg border bg-background p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold">{t("workbench.chapterChecklist")}</h2>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{selectedChapter.intro}</p>
            </div>
            <Badge variant="secondary" className="font-mono">{selectedChapter.group}</Badge>
          </div>
          <ol className="grid gap-2">
            {selectedChapter.steps.slice(0, 3).map((step, index) => (
              <li key={step} className="grid grid-cols-[auto_1fr] gap-3 rounded-md bg-muted/50 p-3 text-sm leading-6">
                <span className="grid size-6 place-items-center rounded-md bg-background font-mono text-xs">{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="grid gap-4 rounded-lg border bg-background p-4 md:grid-cols-[0.85fr_1fr]">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Puzzle />
              <h2 className="text-sm font-semibold">{t("workbench.pluginTitle")}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {pluginNames.map((name) => (
                <Badge key={name} variant="outline" className="plugin-tile">
                  {name}
                </Badge>
              ))}
            </div>
            <p className="text-xs leading-5 text-muted-foreground">{t("workbench.pluginDescription")}</p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Gauge />
              <h2 className="text-sm font-semibold">{t("workbench.utilsTitle")}</h2>
            </div>
            {meters.map(([label, value]) => (
              <div key={label} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{label}</span>
                  <span>{Math.round(value * 100)}%</span>
                </div>
                <Progress value={value * 100} />
              </div>
            ))}
            <dl className="grid grid-cols-2 gap-2 text-xs">
              <div><dt className="text-muted-foreground">raw</dt><dd className="font-mono">{snapshot.raw}</dd></div>
              <div><dt className="text-muted-foreground">unitize</dt><dd className="font-mono">{snapshot.unitized}</dd></div>
              <div><dt className="text-muted-foreground">color HSL</dt><dd className="font-mono">{snapshot.colorHsl.join(",")}</dd></div>
              <div><dt className="text-muted-foreground">random</dt><dd className="font-mono">{snapshot.randomPick}</dd></div>
            </dl>
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
