import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getApisByGroup, type ApiItem } from "@/data/gsapApiCatalog";
import { localizeApi, localizeCoverageMode, useI18n } from "@/lib/i18n";
import { ArrowLeft } from "lucide-react";
import { NavLink } from "react-router";

const modeVariant: Record<ApiItem["mode"], "default" | "secondary" | "outline"> = {
  互动演示: "default",
  教程覆盖: "secondary",
  开发专用: "outline",
};

const learningStageKeyByMode: Record<ApiItem["mode"], "plugins.stage.recommended" | "plugins.stage.advanced" | "plugins.stage.dev"> = {
  互动演示: "plugins.stage.recommended",
  教程覆盖: "plugins.stage.advanced",
  开发专用: "plugins.stage.dev",
};

interface PluginsPageProps {
  onApiSelect: (api: ApiItem) => void;
}

/** 插件实验室页：集中展示插件说明和详情入口。 */
export function PluginsPage({ onApiSelect }: PluginsPageProps) {
  const { locale, t } = useI18n();
  const pluginApis = getApisByGroup("plugins");

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("plugins.title")}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            {t("plugins.description")}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-medium">{t("plugins.courseContextTitle")}</div>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{t("plugins.courseContextDescription")}</p>
          </div>
          <Button variant="outline" render={<NavLink to="/tutorials/plugin-lab" />} nativeButton={false}>
            <ArrowLeft data-icon="inline-start" />
            {t("plugins.backToCourse")}
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {pluginApis.map((rawApi) => {
          const api = localizeApi(rawApi, locale);
          return (
            <Card key={api.id} className="plugin-tile">
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <CardTitle>{api.name}</CardTitle>
                  <div className="flex flex-wrap gap-2 sm:shrink-0 sm:justify-end">
                    <Badge variant={api.mode === "互动演示" ? "default" : "secondary"}>
                      {t(learningStageKeyByMode[api.mode])}
                    </Badge>
                    <Badge variant={modeVariant[api.mode]}>
                      {localizeCoverageMode(api.mode, locale, t)}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="font-mono">{api.signature}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className="text-sm leading-6 text-muted-foreground">{api.summary}</p>
                <Button variant="outline" size="sm" onClick={() => onApiSelect(rawApi)}>
                  {t("plugins.viewDetails")}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
