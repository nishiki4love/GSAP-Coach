import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { TutorialChapter } from "@/data/gsapApiCatalog";
import { useI18n } from "@/lib/i18n";
import { ArrowRight } from "lucide-react";
import { NavLink } from "react-router";

interface LearningSupportPanelProps {
  selectedChapter: TutorialChapter;
}

/** 工作台学习辅助区：展示当前教程章节的核心检查点。 */
export function LearningSupportPanel({ selectedChapter }: LearningSupportPanelProps) {
  const { t } = useI18n();

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
      </CardContent>
    </Card>
  );
}
