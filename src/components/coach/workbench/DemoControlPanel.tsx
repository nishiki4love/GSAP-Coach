import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { findApiItem, type ApiItem, type DemoTab } from "@/data/gsapApiCatalog";
import { localizeApi, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { MousePointer2, Pause, Play, RefreshCw, Repeat2 } from "lucide-react";
import type { DemoControls, UtilitySnapshot } from "../types";

interface DemoControlPanelProps {
  controls: DemoControls;
  selectedDemo: DemoTab;
  selectedApi?: ApiItem;
  snapshot: UtilitySnapshot;
  onApiSelect: (api: ApiItem) => void;
}

/** 演示控制面板：集中处理 Animation 播放、进度和当前 tab 关联 API。 */
export function DemoControlPanel({ controls, selectedDemo, selectedApi, snapshot, onApiSelect }: DemoControlPanelProps) {
  const { locale, t } = useI18n();
  const {
    activeDemo,
    progress,
    parameterControls,
    parameterValues,
    runDemo,
    resetStage,
    controlAnimation,
    seekAnimation,
    updateParameterValue,
  } = controls;
  const utilsMeters = [
    ["normalize / clamp", snapshot.normalized],
    ["snap / mapRange", snapshot.snapped / 360],
    ["wrapYoyo", snapshot.yoyo / 100],
  ] as const;

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{selectedDemo.label}</CardTitle>
        <CardDescription>{selectedDemo.summary}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Progress value={progress * 100} />
        <div className="grid grid-cols-5 gap-2">
          <Button variant="outline" size="icon" onClick={() => runDemo(activeDemo, selectedApi?.id)} title={t("workbench.run")}>
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
        {selectedApi ? (
          <section className="grid gap-3 rounded-lg border bg-muted/30 p-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold">当前示例参数</h3>
              <span className="font-mono text-[11px] text-muted-foreground">{selectedApi.id}</span>
            </div>
            <div className="grid gap-3">
              {parameterControls.map((control) => {
                const value = parameterValues[control.id] ?? control.defaultValue;

                if (control.valueType === "select") {
                  return (
                    <label key={control.id} className="grid gap-1.5 text-xs">
                      <span className="flex items-center justify-between gap-2">
                        <span className="font-medium">{control.label}</span>
                        <span className="font-mono text-muted-foreground">{String(value)}</span>
                      </span>
                      <select
                        className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                        value={String(value)}
                        onChange={(event) => updateParameterValue(selectedApi.id, control.id, event.target.value)}
                        aria-label={control.description}
                      >
                        {control.options?.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </label>
                  );
                }

                if (control.valueType === "boolean") {
                  return (
                    <label key={control.id} className="flex items-center justify-between gap-3 rounded-md border bg-background px-3 py-2 text-xs">
                      <span className="grid gap-0.5">
                        <span className="font-medium">{control.label}</span>
                        <span className="text-muted-foreground">{control.description}</span>
                      </span>
                      <input
                        className="size-4 accent-primary"
                        type="checkbox"
                        checked={Boolean(value)}
                        onChange={(event) => updateParameterValue(selectedApi.id, control.id, event.target.checked)}
                        aria-label={control.description}
                      />
                    </label>
                  );
                }

                return (
                  <label key={control.id} className="grid gap-1.5 text-xs">
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-medium">{control.label}</span>
                      <span className="font-mono text-muted-foreground">
                        {Number(value).toFixed(control.step && control.step < 0.01 ? 3 : control.step && control.step < 1 ? 2 : 0)}
                        {control.unit ?? ""}
                      </span>
                    </span>
                    <div className="grid grid-cols-[minmax(0,1fr)_88px] items-center gap-2">
                      <input
                        className="w-full accent-primary"
                        type="range"
                        min={control.min}
                        max={control.max}
                        step={control.step}
                        value={Number(value)}
                        onChange={(event) => updateParameterValue(selectedApi.id, control.id, Number(event.target.value))}
                        aria-label={control.description}
                      />
                      <input
                        className="h-8 rounded-md border border-input bg-background px-2 text-right font-mono text-xs"
                        type="number"
                        min={control.min}
                        max={control.max}
                        step={control.step}
                        value={Number(value)}
                        onChange={(event) => updateParameterValue(selectedApi.id, control.id, Number(event.target.value))}
                        aria-label={`${control.description} 数值`}
                      />
                    </div>
                  </label>
                );
              })}
            </div>
          </section>
        ) : null}
        {activeDemo === "utils" ? (
          <section className="grid gap-3 rounded-lg border bg-muted/30 p-3">
            <h3 className="text-sm font-semibold">{t("workbench.utilsTitle")}</h3>
            {utilsMeters.map(([label, value]) => (
              <div key={label} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{label}</span>
                  <span>{Math.round(value * 100)}%</span>
                </div>
                <Progress value={value * 100} />
              </div>
            ))}
            <dl className="grid grid-cols-2 gap-2 text-xs">
              <div><dt className="text-muted-foreground">raw</dt><dd className="font-mono">{snapshot.raw}</dd></div>
              <div><dt className="text-muted-foreground">unitize</dt><dd className="font-mono">{snapshot.unitized}</dd></div>
              <div><dt className="text-muted-foreground">color HSL</dt><dd className="font-mono">{snapshot.colorHsl.join(",")}</dd></div>
              <div><dt className="text-muted-foreground">random</dt><dd className="font-mono">{snapshot.randomPick}</dd></div>
            </dl>
          </section>
        ) : null}
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
                  className={cn(
                    "h-auto justify-start px-3 py-2 text-left",
                    selectedApi?.id === api.id && "border-primary bg-primary/10 text-primary",
                  )}
                  onClick={() => {
                    onApiSelect(rawApi);
                    runDemo(activeDemo, rawApi.id);
                  }}
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
