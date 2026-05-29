import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { findApiItem, skillGroups, tutorialChapters, type ApiItem } from "@/data/gsapApiCatalog";

interface TutorialsPageProps {
  onApiSelect: (api: ApiItem) => void;
}

/** 教程页：把学习路径从工作台中拆出来，按章节阅读。 */
export function TutorialsPage({ onApiSelect }: TutorialsPageProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">详细使用教程</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          按 Core、Timeline、ScrollTrigger、Plugins、Utils、框架集成和性能优化逐步阅读，避免在同一个长页面里迷路。
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {tutorialChapters.map((chapter) => (
          <Card key={chapter.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>{chapter.title}</CardTitle>
                  <CardDescription className="mt-2 leading-6">{chapter.intro}</CardDescription>
                </div>
                <Badge variant="secondary">{skillGroups.find((group) => group.id === chapter.group)?.source}</Badge>
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
                  const api = findApiItem(apiId);
                  if (!api) return null;
                  return (
                    <Button key={api.id} variant="outline" size="sm" onClick={() => onApiSelect(api)}>
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
