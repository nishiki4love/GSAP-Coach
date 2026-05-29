import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { UtilitySnapshot } from "../types";

interface UtilitySnapshotCardProps {
  snapshot: UtilitySnapshot;
}

/** Utils 快照卡：展示 gsap.utils 一组纯计算 API 的当前输出。 */
export function UtilitySnapshotCard({ snapshot }: UtilitySnapshotCardProps) {
  const meters = [
    ["normalize / clamp", snapshot.normalized],
    ["snap / mapRange", snapshot.snapped / 360],
    ["wrapYoyo", snapshot.yoyo / 100],
  ] as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Utils 快照</CardTitle>
        <CardDescription>clamp、mapRange、snap、pipe 与颜色拆分的当前输出。</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {meters.map(([label, value]) => (
          <div key={label} className="flex flex-col gap-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{label}</span>
              <span>{Math.round(value * 100)}%</span>
            </div>
            <Progress value={value * 100} />
          </div>
        ))}
        <div className="flex flex-wrap gap-2">
          {snapshot.shuffled.map((item) => (
            <Badge key={item} variant="secondary" className="utility-chip">
              {item}
            </Badge>
          ))}
        </div>
        <dl className="grid grid-cols-2 gap-2 text-xs">
          <div><dt className="text-muted-foreground">raw</dt><dd className="font-mono">{snapshot.raw}</dd></div>
          <div><dt className="text-muted-foreground">unitize</dt><dd className="font-mono">{snapshot.unitized}</dd></div>
          <div><dt className="text-muted-foreground">color HSL</dt><dd className="font-mono">{snapshot.colorHsl.join(",")}</dd></div>
          <div><dt className="text-muted-foreground">random</dt><dd className="font-mono">{snapshot.randomPick}</dd></div>
        </dl>
      </CardContent>
    </Card>
  );
}
