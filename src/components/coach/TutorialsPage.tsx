import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { findApiItem, skillGroups, tutorialChapters, type ApiItem } from "@/data/gsapApiCatalog";
import { getLocalizedTutorialChapters, localizeApi, localizeSkillGroup, useI18n, type MessageKey } from "@/lib/i18n";
import { ArrowRight, Clock3, ListChecks } from "lucide-react";
import { NavLink } from "react-router";
import { getChapterDifficulty, getChapterDurationMinutes, getTotalChapterDurationMinutes, type LessonDifficulty } from "./tutorialMeta";

interface TutorialsPageProps {
  completedChapterIds: string[];
  onApiSelect: (api: ApiItem) => void;
}

const difficultyMessageKeyByLevel: Record<LessonDifficulty, MessageKey> = {
  beginner: "tutorials.difficulty.beginner",
  practice: "tutorials.difficulty.practice",
  advanced: "tutorials.difficulty.advanced",
};

/** 教程页：把学习路径从工作台中拆出来，按章节阅读。 */
export function TutorialsPage({ completedChapterIds, onApiSelect }: TutorialsPageProps) {
  const { locale, t } = useI18n();
  const localizedChapters = getLocalizedTutorialChapters(locale);
  const completedChapterIdSet = new Set(completedChapterIds);
  const totalDurationMinutes = getTotalChapterDurationMinutes(tutorialChapters.map((chapter) => chapter.id));
  const nextChapter = localizedChapters.find((chapter) => !completedChapterIdSet.has(chapter.id));

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("tutorials.title")}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          {t("tutorials.description")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("tutorials.overviewTitle")}</CardTitle>
          <CardDescription>{t("tutorials.overviewDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border bg-muted/45 p-3 text-sm leading-6">
            <div className="flex items-center gap-2 font-medium">
              <Clock3 />
              {t("tutorials.totalDuration", { minutes: totalDurationMinutes })}
            </div>
          </div>
          <div className="rounded-lg border bg-muted/45 p-3 text-sm leading-6">
            <div className="flex items-center gap-2 font-medium">
              <ListChecks />
              {t("tutorials.progressSummary", { completed: completedChapterIdSet.size, total: localizedChapters.length })}
            </div>
          </div>
          <div className="rounded-lg border bg-muted/45 p-3 text-sm leading-6">
            <div className="font-medium">
              {nextChapter
                ? t("tutorials.nextRecommended", { title: nextChapter.title })
                : t("tutorials.allCompleted")}
            </div>
            {nextChapter ? (
              <Button className="mt-2 w-fit" size="sm" render={<NavLink to={`/tutorials/${nextChapter.id}`} />} nativeButton={false}>
                {t("workbench.continueLesson")}
                <ArrowRight data-icon="inline-end" />
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {localizedChapters.map((chapter, index) => {
          const isCompleted = completedChapterIdSet.has(chapter.id);
          const difficulty = getChapterDifficulty(chapter.id);

          return (
            <Card key={chapter.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="mb-2 flex flex-wrap gap-2">
                      <Badge variant="outline">
                        {t("tutorials.chapterOrder", { current: index + 1, total: localizedChapters.length })}
                      </Badge>
                      <Badge variant="secondary">
                        {t("tutorials.chapterDuration", { minutes: getChapterDurationMinutes(chapter.id) })}
                      </Badge>
                      <Badge variant="secondary">{t(difficultyMessageKeyByLevel[difficulty])}</Badge>
                      {isCompleted ? <Badge>{t("tutorials.completed")}</Badge> : null}
                    </div>
                    <CardTitle>{chapter.title}</CardTitle>
                    <CardDescription className="mt-2 leading-6">{chapter.intro}</CardDescription>
                  </div>
                  <Badge variant="secondary">{localizeSkillGroup(skillGroups.find((group) => group.id === chapter.group) ?? skillGroups[0], locale).source}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="rounded-lg border bg-muted/45 p-3 text-sm leading-6">
                  <span className="font-medium">{t("tutorials.chapterGoalLabel")}</span>
                  <span className="text-muted-foreground"> {t("tutorials.chapterGoal")}</span>
                </div>
                <Button className="w-fit" render={<NavLink to={`/tutorials/${chapter.id}`} />} nativeButton={false}>
                  {isCompleted ? t("tutorials.reviewLesson") : t("tutorials.openLesson")}
                  <ArrowRight data-icon="inline-end" />
                </Button>
                <ol className="flex flex-col gap-2 text-sm leading-6">
                  {chapter.steps.map((step) => (
                    <li key={step} className="flex gap-2">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-amberline" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                <div className="flex flex-wrap gap-2">
                  {chapter.apiIds.slice(0, 8).map((apiId) => {
                    const rawApi = findApiItem(apiId);
                    if (!rawApi) return null;
                    const api = localizeApi(rawApi, locale);
                    return (
                      <Button key={api.id} variant="outline" size="sm" onClick={() => onApiSelect(rawApi)}>
                        {api.name}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
