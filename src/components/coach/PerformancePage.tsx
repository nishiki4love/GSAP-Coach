import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getApisByGroup } from "@/data/gsapApiCatalog";

/** 性能指南页：集中展示 gsap-performance skill 的实践规则。 */
export function PerformancePage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">性能指南</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          把性能建议单独成页，方便在写动画前快速确认：优先 transform/opacity，高频输入用 quickTo，滚动刷新只在布局改变后执行。
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {getApisByGroup("performance").map((api) => (
          <Card key={api.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle>{api.name}</CardTitle>
                <Badge variant="secondary">{api.mode}</Badge>
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
        ))}
      </div>
    </div>
  );
}
