import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { findApiItem, type ApiItem, type DemoTab } from "@/data/gsapApiCatalog";
import { localizeApi, useI18n } from "@/lib/i18n";
import { MousePointer2, Pause, Play, RefreshCw, Repeat2 } from "lucide-react";
import type { DemoControls } from "../types";

interface DemoControlPanelProps {
  controls: DemoControls;
  selectedDemo: DemoTab;
  onApiSelect: (api: ApiItem) => void;
}

/** 演示控制面板：集中处理 Animation 播放、进度和当前 tab 关联 API。 */
export function DemoControlPanel({ controls, selectedDemo, onApiSelect }: DemoControlPanelProps) {
  const { locale, t } = useI18n();
  const {
    activeDemo,
    progress,
    runDemo,
    resetStage,
    controlAnimation,
    seekAnimation,
  } = controls;

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{selectedDemo.label}</CardTitle>
        <CardDescription>{selectedDemo.summary}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Progress value={progress * 100} />
        <div className="grid grid-cols-5 gap-2">
          <Button variant="outline" size="icon" onClick={() => runDemo(activeDemo)} title={t("workbench.run")}>
            <Play />
          </Button>
          <Button variant="outline" size="icon" onClick={() => controlAnimation("pause")} title="pause()">
            <Pause />
          </Button>
          <Button variant="outline" size="icon" onClick={() => controlAnimation("reverse")} title="reverse()">
            <Repeat2 />
          </Button>
          <Button variant="outline" size="icon" onClick={() => controlAnimation("restart")} title="restart()">
            <RefreshCw />
          </Button>
          <Button variant="outline" size="icon" onClick={resetStage} title="reset">
            <MousePointer2 />
          </Button>
        </div>
        <input
          className="w-full accent-primary"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={progress}
          onChange={(event) => seekAnimation(Number(event.target.value))}
          aria-label={t("workbench.progress")}
        />
        <ScrollArea className="h-[260px] pr-3">
          <div className="flex flex-col gap-2">
            {selectedDemo.apiIds.map((apiId) => {
              const rawApi = findApiItem(apiId);
              if (!rawApi) return null;
              const api = localizeApi(rawApi, locale);
              return (
                <Button
                  key={api.id}
                  variant="outline"
                  className="h-auto justify-start px-3 py-2 text-left"
                  onClick={() => onApiSelect(rawApi)}
                >
                  <span className="grid min-w-0 gap-1">
                    <span className="truncate font-medium">{api.name}</span>
                    <span className="truncate font-mono text-xs text-muted-foreground">{api.signature}</span>
                  </span>
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
