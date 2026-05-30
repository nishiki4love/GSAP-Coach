import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { findApiItem, skillGroups, type ApiItem } from "@/data/gsapApiCatalog";
import { getLocalizedTutorialChapters, localizeApi, localizeSkillGroup, useI18n } from "@/lib/i18n";

interface TutorialsPageProps {
  onApiSelect: (api: ApiItem) => void;
}

/** 教程页：把学习路径从工作台中拆出来，按章节阅读。 */
export function TutorialsPage({ onApiSelect }: TutorialsPageProps) {
  const { locale, t } = useI18n();
  const localizedChapters = getLocalizedTutorialChapters(locale);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("tutorials.title")}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          {t("tutorials.description")}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {localizedChapters.map((chapter) => (
          <Card key={chapter.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>{chapter.title}</CardTitle>
                  <CardDescription className="mt-2 leading-6">{chapter.intro}</CardDescription>
                </div>
                <Badge variant="secondary">{localizeSkillGroup(skillGroups.find((group) => group.id === chapter.group) ?? skillGroups[0], locale).source}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
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
        ))}
      </div>
    </div>
  );
}
