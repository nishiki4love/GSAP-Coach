import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { demoTabs, type ApiItem, type DemoTab, type TutorialChapter } from "@/data/gsapApiCatalog";
import { Gauge, Layers, Route, SquareMousePointer, Zap } from "lucide-react";
import { ApiDetailCard } from "./ApiDetailCard";
import type { DemoControls, UtilitySnapshot } from "./types";
import { DemoControlPanel } from "./workbench/DemoControlPanel";
import { DemoStagePanel } from "./workbench/DemoStagePanel";
import { PluginSummaryCard } from "./workbench/PluginSummaryCard";
import { UtilitySnapshotCard } from "./workbench/UtilitySnapshotCard";

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
  const {
    activeDemo,
    observerHint,
    stageStatus,
    setActiveDemo,
    runDemo,
  } = demoControls;
  const selectedDemo = demoTabs.find((demo) => demo.id === activeDemo) ?? demoTabs[0];

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_390px]">
      <div className="flex min-w-0 flex-col gap-4">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-start 2xl:justify-between">
              <div>
                <CardTitle>
                  <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">GSAP 功能演示工作台</h1>
                </CardTitle>
                <CardDescription className="mt-2 max-w-2xl leading-6">
                  运行 API 留在舞台中互动演示；调试工具与外部运行时 API 放入教程和覆盖矩阵。
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
                <TabsList className="grid h-auto grid-cols-2 md:flex">
                  {demoTabs.map((demo) => {
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

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <PluginSummaryCard />
          <UtilitySnapshotCard snapshot={utilsSnapshot} />
        </div>
      </div>

      <ApiDetailCard api={selectedApi} chapter={selectedChapter} />
    </div>
  );
}
