import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getApisByGroup, type ApiItem } from "@/data/gsapApiCatalog";
import { localizeApi, localizeCoverageMode, useI18n } from "@/lib/i18n";
import { Shuffle } from "lucide-react";

interface PluginsPageProps {
  pluginLayout: "grid" | "list";
  onToggleLayout: () => void;
  onApiSelect: (api: ApiItem) => void;
}

/** 插件实验室页：把插件说明和 Flip 布局演示从主工作台中拆出来。 */
export function PluginsPage({ pluginLayout, onToggleLayout, onApiSelect }: PluginsPageProps) {
  const { locale, t } = useI18n();
  const pluginApis = getApisByGroup("plugins");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("plugins.title")}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            {t("plugins.description")}
          </p>
        </div>
        <Button variant="outline" onClick={onToggleLayout}>
          <Shuffle data-icon="inline-start" />
          {t("plugins.flipToggle")}
        </Button>
      </div>

      <div className={pluginLayout === "grid" ? "grid gap-3 md:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-3"}>
        {pluginApis.map((rawApi) => {
          const api = localizeApi(rawApi, locale);
          return (
            <Card key={api.id} className="plugin-tile">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle>{api.name}</CardTitle>
                  <Badge variant={api.mode === "互动演示" ? "default" : "secondary"}>
                    {localizeCoverageMode(api.mode, locale, t)}
                  </Badge>
                </div>
                <CardDescription className="font-mono">{api.signature}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className="text-sm leading-6 text-muted-foreground">{api.summary}</p>
                <Button variant="outline" size="sm" onClick={() => onApiSelect(rawApi)}>
                  {t("plugins.viewTutorial")}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
