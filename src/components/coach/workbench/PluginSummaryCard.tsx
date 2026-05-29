import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const pluginNames = ["Flip", "Draggable + Inertia", "Observer", "SplitText", "DrawSVG / MorphSVG", "MotionPath / Physics"];

/** 插件摘要卡：用于说明工作台舞台会串联哪些插件能力。 */
export function PluginSummaryCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>插件实验区</CardTitle>
        <CardDescription>点击插件演示 tab 后，SplitText、SVG、MotionPath 与物理插件会在舞台中串联运行。</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 md:grid-cols-3">
        {pluginNames.map((name) => (
          <div key={name} className="plugin-tile rounded-lg border bg-background p-3">
            <p className="text-sm font-semibold">{name}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">可在插件实验室页面单独查看说明。</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
