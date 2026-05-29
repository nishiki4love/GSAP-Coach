import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getApisByGroup, type ApiItem } from "@/data/gsapApiCatalog";
import { Shuffle } from "lucide-react";

interface PluginsPageProps {
  pluginLayout: "grid" | "list";
  onToggleLayout: () => void;
  onApiSelect: (api: ApiItem) => void;
}

/** 插件实验室页：把插件说明和 Flip 布局演示从主工作台中拆出来。 */
export function PluginsPage({ pluginLayout, onToggleLayout, onApiSelect }: PluginsPageProps) {
  const pluginApis = getApisByGroup("plugins");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">插件实验室</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Flip、Draggable、SplitText、SVG、物理和开发辅助插件集中在这里，主工作台只保留运行入口。
          </p>
        </div>
        <Button variant="outline" onClick={onToggleLayout}>
          <Shuffle data-icon="inline-start" />
          Flip 布局切换
        </Button>
      </div>

      <div className={pluginLayout === "grid" ? "grid gap-3 md:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-3"}>
        {pluginApis.map((api) => (
          <Card key={api.id} className="plugin-tile">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle>{api.name}</CardTitle>
                <Badge variant={api.mode === "互动演示" ? "default" : "secondary"}>{api.mode}</Badge>
              </div>
              <CardDescription className="font-mono">{api.signature}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-sm leading-6 text-muted-foreground">{api.summary}</p>
              <Button variant="outline" size="sm" onClick={() => onApiSelect(api)}>
                查看教程
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
