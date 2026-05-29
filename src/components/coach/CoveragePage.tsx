import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiItems, getApisByGroup, skillGroups, type ApiItem } from "@/data/gsapApiCatalog";

const modeVariant: Record<ApiItem["mode"], "default" | "secondary" | "outline"> = {
  互动演示: "default",
  教程覆盖: "secondary",
  开发专用: "outline",
};

interface CoveragePageProps {
  onApiSelect: (api: ApiItem) => void;
}

/** 覆盖矩阵页：用表格集中呈现所有 API，而不是堆在一个纵向列表里。 */
export function CoveragePage({ onApiSelect }: CoveragePageProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">API 覆盖矩阵</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          共覆盖 {apiItems.length} 个来自本地 gsap-skills 的 API、配置项和框架模式。点击任意行可回到演示工作台查看详情。
        </p>
      </div>

      <div className="grid gap-4">
        {skillGroups.map((group) => (
          <Card key={group.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>{group.title}</CardTitle>
                  <CardDescription className="mt-1">{group.source} · {group.summary}</CardDescription>
                </div>
                <Badge variant="secondary">{getApisByGroup(group.id).length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[420px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>API</TableHead>
                      <TableHead className="hidden md:table-cell">签名</TableHead>
                      <TableHead>说明</TableHead>
                      <TableHead className="w-[110px]">状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getApisByGroup(group.id).map((api) => (
                      <TableRow key={api.id} className="coverage-row cursor-pointer" onClick={() => onApiSelect(api)}>
                        <TableCell className="font-medium">{api.name}</TableCell>
                        <TableCell className="hidden max-w-[280px] truncate font-mono text-xs text-muted-foreground md:table-cell">
                          {api.signature}
                        </TableCell>
                        <TableCell className="min-w-[220px] text-muted-foreground">{api.summary}</TableCell>
                        <TableCell>
                          <Badge variant={modeVariant[api.mode]}>{api.mode}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
