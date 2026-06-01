import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { findApiItem, skillGroups, tutorialChapters, type ApiItem } from "@/data/gsapApiCatalog";
import { getLocalizedTutorialChapters, localizeApi, localizeSkillGroup, useI18n } from "@/lib/i18n";
import { AlertTriangle, ArrowLeft, ArrowRight, BookOpenText, CheckCircle2, Compass, FlaskConical, HelpCircle, Lightbulb, Play } from "lucide-react";
import { useState } from "react";
import { Navigate, NavLink, useParams } from "react-router";
import { getChapterConcepts, getChapterDurationMinutes, getChapterMistakes, getChapterQuiz } from "./tutorialMeta";
import { getChapterExperimentRecommendation, type RecommendedExperimentId } from "./tutorialProgress";

interface TutorialLessonPageProps {
  completedChapterIds: string[];
  onApiSelect: (api: ApiItem) => void;
  onChapterComplete: (chapterId: string) => void;
}

const experimentPathById: Record<RecommendedExperimentId, string> = {
  "scroll-labs": "/scroll-labs/vertical",
  plugins: "/plugins",
  performance: "/performance",
};

/** 章节课堂页：把目录里的章节摘要扩展为目标、概念、练习、检查和下一步。 */
export function TutorialLessonPage({ completedChapterIds, onApiSelect, onChapterComplete }: TutorialLessonPageProps) {
  const { chapterId } = useParams();
  const { locale, t } = useI18n();
  const [quizAnswersByChapter, setQuizAnswersByChapter] = useState<Record<string, string>>({});
  const localizedChapters = getLocalizedTutorialChapters(locale);
  const chapterIndex = tutorialChapters.findIndex((chapter) => chapter.id === chapterId);

  if (chapterIndex < 0) {
    return <Navigate to="/tutorials" replace />;
  }

  const rawChapter = tutorialChapters[chapterIndex];
  const chapter = localizedChapters[chapterIndex];
  const nextChapter = localizedChapters[chapterIndex + 1];
  const nextRawChapter = tutorialChapters[chapterIndex + 1];
  const primaryApi = findApiItem(rawChapter.apiIds[0]);
  const secondaryApi = findApiItem(rawChapter.apiIds[1]);
  const localizedPrimaryApi = primaryApi ? localizeApi(primaryApi, locale) : undefined;
  const localizedSecondaryApi = secondaryApi ? localizeApi(secondaryApi, locale) : undefined;
  const skillGroup = localizeSkillGroup(skillGroups.find((group) => group.id === rawChapter.group) ?? skillGroups[0], locale);
  const isCompleted = completedChapterIds.includes(rawChapter.id);
  const concepts = getChapterConcepts(rawChapter.id, locale);
  const mistakes = getChapterMistakes(rawChapter.id, locale);
  const quiz = getChapterQuiz(rawChapter.id, locale);
  const selectedQuizOptionId = quizAnswersByChapter[rawChapter.id];
  const selectedQuizOption = quiz.options.find((option) => option.id === selectedQuizOptionId);
  const recommendedExperimentId = getChapterExperimentRecommendation(rawChapter.id);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <Button variant="outline" size="sm" className="w-fit" render={<NavLink to="/tutorials" />} nativeButton={false}>
          <ArrowLeft data-icon="inline-start" />
          {t("lesson.backToTutorials")}
        </Button>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">
            {t("tutorials.chapterOrder", { current: chapterIndex + 1, total: localizedChapters.length })}
          </Badge>
          <Badge variant="secondary">
            {t("tutorials.chapterDuration", { minutes: getChapterDurationMinutes(rawChapter.id) })}
          </Badge>
          <Badge variant="secondary">{skillGroup.source}</Badge>
          {isCompleted ? <Badge>{t("tutorials.completed")}</Badge> : null}
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{chapter.title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{chapter.intro}</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb />
                {t("lesson.goalTitle")}
              </CardTitle>
              <CardDescription>{t("lesson.goalDescription", { group: skillGroup.title })}</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="grid gap-2 text-sm leading-6">
                {chapter.steps.map((step, index) => (
                  <li key={step} className="grid grid-cols-[auto_1fr] gap-3 rounded-lg border bg-background p-3">
                    <span className="grid size-6 place-items-center rounded-md bg-muted font-mono text-xs">{index + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpenText />
                {t("lesson.conceptsTitle")}
              </CardTitle>
              <CardDescription>{t("lesson.conceptsDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-3">
                {concepts.map((concept) => (
                  <div key={concept.title} className="rounded-lg border bg-background p-3 text-sm leading-6">
                    <div className="font-medium">{concept.title}</div>
                    <p className="mt-1 text-muted-foreground">{concept.body}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play />
                {t("lesson.demoTitle")}
              </CardTitle>
              <CardDescription>
                {localizedPrimaryApi
                  ? t("lesson.demoDescription", { api: localizedPrimaryApi.name })
                  : t("lesson.demoFallback")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {localizedPrimaryApi ? (
                <div className="rounded-lg border bg-muted/45 p-3">
                  <div className="font-medium">{localizedPrimaryApi.name}</div>
                  <div className="mt-1 font-mono text-xs text-muted-foreground">{localizedPrimaryApi.signature}</div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{localizedPrimaryApi.summary}</p>
                </div>
              ) : null}
              {primaryApi ? (
                <Button className="w-fit" onClick={() => onApiSelect(primaryApi)}>
                  {t("lesson.openWorkbench")}
                  <ArrowRight data-icon="inline-end" />
                </Button>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical />
                {t("lesson.practiceTitle")}
              </CardTitle>
              <CardDescription>{t("lesson.practiceDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="rounded-lg border bg-background p-3 text-sm leading-6">
                <div className="font-medium">{t("lesson.practiceOneTitle")}</div>
                <p className="mt-1 text-muted-foreground">
                  {t("lesson.practiceOneBody", { api: localizedPrimaryApi?.name ?? skillGroup.title })}
                </p>
              </div>
              <div className="rounded-lg border bg-background p-3 text-sm leading-6">
                <div className="font-medium">{t("lesson.practiceTwoTitle")}</div>
                <p className="mt-1 text-muted-foreground">
                  {t("lesson.practiceTwoBody", { api: localizedSecondaryApi?.name ?? localizedPrimaryApi?.name ?? skillGroup.title })}
                </p>
              </div>
              <div className="rounded-lg border bg-muted/45 p-3 text-sm leading-6">
                <span className="font-medium">{t("lesson.referenceAnswerLabel")}</span>
                <span className="text-muted-foreground"> {t("lesson.referenceAnswer")}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle />
                {t("lesson.mistakesTitle")}
              </CardTitle>
              <CardDescription>{t("lesson.mistakesDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {mistakes.map((mistake) => (
                  <div key={mistake.title} className="rounded-lg border bg-background p-3 text-sm leading-6">
                    <div className="font-medium">{mistake.title}</div>
                    <p className="mt-1 text-muted-foreground">{mistake.body}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="flex min-w-0 flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle />
                {t("lesson.quizTitle")}
              </CardTitle>
              <CardDescription>{quiz.question}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {quiz.options.map((option) => (
                <Button
                  key={option.id}
                  variant={selectedQuizOptionId === option.id ? "default" : "outline"}
                  className="h-auto justify-start whitespace-normal text-left leading-5"
                  aria-pressed={selectedQuizOptionId === option.id}
                  onClick={() => setQuizAnswersByChapter((currentAnswers) => ({
                    ...currentAnswers,
                    [rawChapter.id]: option.id,
                  }))}
                >
                  {option.label}
                </Button>
              ))}
              {selectedQuizOption ? (
                <div
                  role="status"
                  className={selectedQuizOption.isCorrect
                    ? "rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm leading-6 text-primary"
                    : "rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm leading-6 text-destructive"}
                >
                  {selectedQuizOption.feedback}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 />
                {t("lesson.checkTitle")}
              </CardTitle>
              <CardDescription>{t("lesson.checkDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="grid gap-2 text-sm leading-6">
                {chapter.steps.slice(0, 3).map((step, index) => (
                  <li key={step} className="grid grid-cols-[auto_1fr] gap-3 rounded-lg bg-muted/50 p-3">
                    <span className="grid size-6 place-items-center rounded-md bg-background font-mono text-xs">{index + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <Button
                className="mt-3 w-full"
                disabled={isCompleted}
                onClick={() => onChapterComplete(rawChapter.id)}
              >
                {isCompleted ? t("lesson.completed") : t("lesson.markComplete")}
              </Button>
            </CardContent>
          </Card>

          {isCompleted && recommendedExperimentId ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Compass />
                  {t("lesson.recommendationTitle")}
                </CardTitle>
                <CardDescription>{t(`lesson.recommendation.${recommendedExperimentId}.description`)}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline" render={<NavLink to={experimentPathById[recommendedExperimentId]} />} nativeButton={false}>
                  {t(`lesson.recommendation.${recommendedExperimentId}.action`)}
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle>{t("lesson.nextTitle")}</CardTitle>
              <CardDescription>{nextChapter ? nextChapter.title : t("lesson.nextDone")}</CardDescription>
            </CardHeader>
            <CardContent>
              {nextRawChapter ? (
                <Button className="w-full" render={<NavLink to={`/tutorials/${nextRawChapter.id}`} />} nativeButton={false}>
                  {t("lesson.nextLesson")}
                  <ArrowRight data-icon="inline-end" />
                </Button>
              ) : (
                <Button className="w-full" render={<NavLink to="/performance" />} nativeButton={false}>
                  {t("lesson.openPerformance")}
                  <ArrowRight data-icon="inline-end" />
                </Button>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
