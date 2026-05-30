import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getApisByGroup } from "@/data/gsapApiCatalog";
import { localizeApi, localizeCoverageMode, useI18n } from "@/lib/i18n";

/** 性能指南页：集中展示 gsap-performance skill 的实践规则。 */
export function PerformancePage() {
  const { locale, t } = useI18n();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("performance.title")}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          {t("performance.description")}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {getApisByGroup("performance").map((rawApi) => {
          const api = localizeApi(rawApi, locale);
          return (
            <Card key={api.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle>{api.name}</CardTitle>
                  <Badge variant="secondary">{localizeCoverageMode(api.mode, locale, t)}</Badge>
                </div>
                <CardDescription className="font-mono">{api.signature}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className="text-sm leading-6">{api.summary}</p>
                <p className="text-sm leading-6 text-muted-foreground">{api.usage}</p>
                <pre className="overflow-auto rounded-lg bg-primary p-3 text-xs leading-5 text-primary-foreground">
                  <code>{api.snippet}</code>
                </pre>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
