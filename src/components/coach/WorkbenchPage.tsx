import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { demoTabs, type ApiItem, type DemoTab, type TutorialChapter } from "@/data/gsapApiCatalog";
import { getLocalizedDemoTabs, useI18n } from "@/lib/i18n";
import { Gauge, Layers, Route, SquareMousePointer, Zap } from "lucide-react";
import { ApiDetailCard } from "./ApiDetailCard";
import type { DemoControls, UtilitySnapshot } from "./types";
import { DemoControlPanel } from "./workbench/DemoControlPanel";
import { DemoStagePanel } from "./workbench/DemoStagePanel";
import { LearningSupportPanel } from "./workbench/LearningSupportPanel";

interface WorkbenchPageProps {
  selectedApi?: ApiItem;
  selectedChapter: TutorialChapter;
  demoControls: DemoControls;
  utilsSnapshot: UtilitySnapshot;
  onApiSelect: (api: ApiItem) => void;
}

const demoIcons: Record<DemoTab["id"], typeof Zap> = {
  core: Zap,
  timeline: Layers,
  scroll: Route,
  plugins: SquareMousePointer,
  utils: Gauge,
};

/** 主演示工作台：保留所有可运行 GSAP 舞台和控制按钮。 */
export function WorkbenchPage({
  selectedApi,
  selectedChapter,
  demoControls,
  utilsSnapshot,
  onApiSelect,
}: WorkbenchPageProps) {
  const { locale, t } = useI18n();
  const {
    activeDemo,
    observerHint,
    stageStatus,
    setActiveDemo,
    runDemo,
  } = demoControls;
  const localizedDemoTabs = getLocalizedDemoTabs(locale);
  const selectedDemo = localizedDemoTabs.find((demo) => demo.id === activeDemo) ?? localizedDemoTabs[0];

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_390px]">
      <div className="flex min-w-0 flex-col gap-4">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-start 2xl:justify-between">
              <div>
                <CardTitle>
                  <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{t("workbench.title")}</h1>
                </CardTitle>
                <CardDescription className="mt-2 max-w-2xl leading-6">
                  {t("workbench.description")}
                </CardDescription>
              </div>
              <Tabs
                value={activeDemo}
                onValueChange={(value) => {
                  const nextDemo = value as DemoTab["id"];
                  setActiveDemo(nextDemo);
                  runDemo(nextDemo);
                }}
              >
                <TabsList className="grid !h-auto w-full grid-cols-2 gap-1 md:w-fit md:flex">
                  {localizedDemoTabs.map((demo) => {
                    const Icon = demoIcons[demo.id];
                    return (
                      <TabsTrigger key={demo.id} value={demo.id}>
                        <Icon data-icon="inline-start" />
                        {demo.label}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,1fr)_280px]">
            <DemoStagePanel observerHint={observerHint} stageStatus={stageStatus} />
            <DemoControlPanel controls={demoControls} selectedDemo={selectedDemo} onApiSelect={onApiSelect} />
          </CardContent>
        </Card>
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        <ApiDetailCard api={selectedApi} chapter={selectedChapter} />
        <LearningSupportPanel snapshot={utilsSnapshot} selectedChapter={selectedChapter} />
      </div>
    </div>
  );
}
