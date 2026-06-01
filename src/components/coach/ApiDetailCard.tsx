import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ApiItem, TutorialChapter } from "@/data/gsapApiCatalog";
import { localizeCoverageMode, useI18n } from "@/lib/i18n";
import { ArrowLeft, Bookmark, Code2, Star } from "lucide-react";
import { NavLink } from "react-router";

const modeVariant: Record<ApiItem["mode"], "default" | "secondary" | "outline"> = {
  互动演示: "default",
  教程覆盖: "secondary",
  开发专用: "outline",
};

interface ApiDetailCardProps {
  api?: ApiItem;
  chapter: TutorialChapter;
  isApiFavorite: boolean;
  isSnippetFavorite: boolean;
  onFavoriteApiToggle: (apiId: string) => void;
  onFavoriteSnippetToggle: (apiId: string) => void;
  returnToPath: string;
}

/** API 详情面板：展示当前选中 API 的说明、代码和学习步骤。 */
export function ApiDetailCard({
  api,
  chapter,
  isApiFavorite,
  isSnippetFavorite,
  onFavoriteApiToggle,
  onFavoriteSnippetToggle,
  returnToPath,
}: ApiDetailCardProps) {
  const { locale, t } = useI18n();

  if (!api) return null;

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-3">
            <Badge variant={modeVariant[api.mode]}>{localizeCoverageMode(api.mode, locale, t)}</Badge>
            <CardTitle className="text-xl">{api.name}</CardTitle>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant={isApiFavorite ? "default" : "outline"}
              size="sm"
              aria-pressed={isApiFavorite}
              onClick={() => onFavoriteApiToggle(api.id)}
            >
              <Star data-icon="inline-start" />
              {isApiFavorite ? t("api.favoriteApiSaved") : t("api.favoriteApi")}
            </Button>
            <Code2 className="hidden text-muted-foreground sm:block" />
          </div>
        </div>
        <CardDescription className="font-mono">{api.signature}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {returnToPath ? (
          <Button className="w-fit" variant="outline" size="sm" render={<NavLink to={returnToPath} />} nativeButton={false}>
            <ArrowLeft data-icon="inline-start" />
            {t("api.backToCoverage")}
          </Button>
        ) : null}
        <div className="flex flex-col gap-2 text-sm leading-6">
          <p>{api.summary}</p>
          <p className="text-muted-foreground">{api.usage}</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-medium">{t("api.snippetTitle")}</div>
            <Button
              variant={isSnippetFavorite ? "default" : "outline"}
              size="sm"
              aria-pressed={isSnippetFavorite}
              onClick={() => onFavoriteSnippetToggle(api.id)}
            >
              <Bookmark data-icon="inline-start" />
              {isSnippetFavorite ? t("api.favoriteSnippetSaved") : t("api.favoriteSnippet")}
            </Button>
          </div>
          <pre className="max-h-[260px] overflow-auto rounded-lg bg-primary p-3 text-xs leading-5 text-primary-foreground">
            <code>{api.snippet}</code>
          </pre>
        </div>
        <Separator />
        <div className="flex flex-col gap-3">
          <div>
            <h3 className="text-sm font-semibold">{chapter.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{chapter.intro}</p>
          </div>
          <ol className="flex flex-col gap-2 text-sm leading-6">
            {chapter.steps.map((step) => (
              <li key={step} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-limebeam" />
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
