import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getApisByGroup } from "@/data/gsapApiCatalog";
import { localizeApi, localizeCoverageMode, useI18n, type MessageKey } from "@/lib/i18n";
import { ArrowLeft, CheckCircle2, ListChecks } from "lucide-react";
import { NavLink } from "react-router";

const auditGroups: Array<{ titleKey: MessageKey; itemKeys: MessageKey[] }> = [
  {
    titleKey: "performance.audit.stage.title",
    itemKeys: ["performance.audit.stage.item1", "performance.audit.stage.item2", "performance.audit.stage.item3"],
  },
  {
    titleKey: "performance.audit.prereq.title",
    itemKeys: ["performance.audit.prereq.item1", "performance.audit.prereq.item2", "performance.audit.prereq.item3"],
  },
  {
    titleKey: "performance.audit.action.title",
    itemKeys: ["performance.audit.action.item1", "performance.audit.action.item2", "performance.audit.action.item3"],
  },
];

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

      <Card>
        <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-medium">{t("performance.courseContextTitle")}</div>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{t("performance.courseContextDescription")}</p>
          </div>
          <Button variant="outline" render={<NavLink to="/tutorials/performance-loop" />} nativeButton={false}>
            <ArrowLeft data-icon="inline-start" />
            {t("performance.backToCourse")}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex min-w-0 items-center gap-2">
            <ListChecks className="shrink-0" />
            <span>{t("performance.auditTitle")}</span>
          </CardTitle>
          <CardDescription>{t("performance.auditDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-3">
          {auditGroups.map((group) => (
            <div key={group.titleKey} className="min-w-0 rounded-lg border bg-muted/45 p-3">
              <div className="font-medium">{t(group.titleKey)}</div>
              <ol className="mt-3 grid gap-2 text-sm leading-6 text-muted-foreground">
                {group.itemKeys.map((itemKey) => (
                  <li key={itemKey} className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-2">
                    <CheckCircle2 className="mt-1 shrink-0 text-primary" />
                    <span>{t(itemKey)}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </CardContent>
      </Card>

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
