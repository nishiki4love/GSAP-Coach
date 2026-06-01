import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { demoTabs, findApiItem, type ApiItem, type DemoTab, type TutorialChapter } from "@/data/gsapApiCatalog";
import { getLocalizedDemoTabs, localizeApi, useI18n } from "@/lib/i18n";
import { ArrowRight, Bookmark, BookOpen, Clock3, Compass, Gauge, Layers, Route, SquareMousePointer, Star, Zap } from "lucide-react";
import type { RefObject } from "react";
import { NavLink } from "react-router";
import { ApiDetailCard } from "./ApiDetailCard";
import type { RecommendedExperimentId } from "./tutorialProgress";
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
  apiDetailRef: RefObject<HTMLDivElement | null>;
  completedLessonCount: number;
  totalLessonCount: number;
  nextTutorialChapterId: string;
  recommendedExperimentId: RecommendedExperimentId | null;
  favoriteApiIds: string[];
  favoriteSnippetIds: string[];
  onFavoriteApiToggle: (apiId: string) => void;
  onFavoriteSnippetToggle: (apiId: string) => void;
  returnToPath: string;
}

const experimentPathById: Record<RecommendedExperimentId, string> = {
  "scroll-labs": "/scroll-labs/vertical",
  plugins: "/plugins",
  performance: "/performance",
};

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
  apiDetailRef,
  completedLessonCount,
  totalLessonCount,
  nextTutorialChapterId,
  recommendedExperimentId,
  favoriteApiIds,
  favoriteSnippetIds,
  onFavoriteApiToggle,
  onFavoriteSnippetToggle,
  returnToPath,
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
  const favoriteApis = favoriteApiIds
    .map((apiId) => findApiItem(apiId))
    .filter((api): api is ApiItem => Boolean(api))
    .slice(0, 4);
  const favoriteSnippets = favoriteSnippetIds
    .map((apiId) => findApiItem(apiId))
    .filter((api): api is ApiItem => Boolean(api))
    .slice(0, 4);
  const hasFavorites = favoriteApis.length > 0 || favoriteSnippets.length > 0;

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
              <div className="flex flex-col gap-2 rounded-lg border bg-muted/45 p-3 text-sm 2xl:max-w-[360px]">
                <div className="flex items-center gap-2 font-medium">
                  <BookOpen />
                  {t("workbench.learningPathTitle")}
                </div>
                <p className="leading-6 text-muted-foreground">{t("workbench.learningPathDescription")}</p>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Button render={<NavLink to={`/tutorials/${nextTutorialChapterId}`} />} nativeButton={false}>
                    {completedLessonCount > 0 ? t("workbench.continueLesson") : t("workbench.startLesson")}
                    <ArrowRight data-icon="inline-end" />
                  </Button>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock3 />
                    {t("workbench.learningPathProgress", { completed: completedLessonCount, total: totalLessonCount })}
                  </span>
                </div>
                {recommendedExperimentId ? (
                  <div className="rounded-lg border bg-background p-3">
                    <div className="flex items-center gap-2 font-medium">
                      <Compass />
                      {t(`workbench.recommendation.${recommendedExperimentId}.title`)}
                    </div>
                    <p className="mt-1 leading-6 text-muted-foreground">{t(`workbench.recommendation.${recommendedExperimentId}.description`)}</p>
                    <Button className="mt-2 w-fit" variant="outline" size="sm" render={<NavLink to={experimentPathById[recommendedExperimentId]} />} nativeButton={false}>
                      {t("workbench.openRecommendation")}
                      <ArrowRight data-icon="inline-end" />
                    </Button>
                  </div>
                ) : null}
              </div>
            <Tabs
                value={activeDemo}
                onValueChange={(value) => {
                  const nextDemo = value as DemoTab["id"];
                  const nextApi = findApiItem(demoTabs.find((demo) => demo.id === nextDemo)?.apiIds[0] ?? "");
                  setActiveDemo(nextDemo);
                  if (nextApi) onApiSelect(nextApi);
                  runDemo(nextDemo, nextApi?.id);
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
            <DemoStagePanel selectedApi={selectedApi} parameterValues={demoControls.parameterValues} observerHint={observerHint} stageStatus={stageStatus} />
            <DemoControlPanel controls={demoControls} selectedDemo={selectedDemo} selectedApi={selectedApi} snapshot={utilsSnapshot} onApiSelect={onApiSelect} />
          </CardContent>
        </Card>
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        <div ref={apiDetailRef} className="flex scroll-mt-20 flex-col gap-4">
          <ApiDetailCard
            api={selectedApi}
            chapter={selectedChapter}
            isApiFavorite={selectedApi ? favoriteApiIds.includes(selectedApi.id) : false}
            isSnippetFavorite={selectedApi ? favoriteSnippetIds.includes(selectedApi.id) : false}
            onFavoriteApiToggle={onFavoriteApiToggle}
            onFavoriteSnippetToggle={onFavoriteSnippetToggle}
            returnToPath={returnToPath}
          />
        </div>
        {hasFavorites ? (
          <Card>
            <CardHeader>
              <CardTitle>{t("workbench.favoritesTitle")}</CardTitle>
              <CardDescription>{t("workbench.favoritesDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {favoriteApis.length > 0 ? (
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Star />
                    {t("workbench.favoriteApis")}
                    <Badge variant="secondary">{favoriteApiIds.length}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {favoriteApis.map((api) => (
                      <Button key={api.id} variant="outline" size="sm" onClick={() => onApiSelect(api)}>
                        {localizeApi(api, locale).name}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : null}
              {favoriteSnippets.length > 0 ? (
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Bookmark />
                    {t("workbench.favoriteSnippets")}
                    <Badge variant="secondary">{favoriteSnippetIds.length}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {favoriteSnippets.map((api) => (
                      <Button key={api.id} variant="outline" size="sm" onClick={() => onApiSelect(api)}>
                        {localizeApi(api, locale).name}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        ) : null}
        <LearningSupportPanel selectedChapter={selectedChapter} />
      </div>
    </div>
  );
}
