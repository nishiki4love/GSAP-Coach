import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiItems, getApisByGroup, skillGroups, type ApiItem } from "@/data/gsapApiCatalog";
import { localizeApi, localizeCoverageMode, localizeSkillGroup, useI18n } from "@/lib/i18n";

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
  const { locale, t } = useI18n();
  const localizedGroups = skillGroups.map((group) => localizeSkillGroup(group, locale));

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("coverage.title")}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          {t("coverage.description", { count: apiItems.length })}
        </p>
      </div>

      <div className="grid gap-4">
        {localizedGroups.map((group) => (
          <Card key={group.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>{group.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {group.source} · {group.summary}
                  </CardDescription>
                </div>
                <Badge variant="secondary">{getApisByGroup(group.id).length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-lg border">
                <Table className="min-w-[760px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>API</TableHead>
                      <TableHead className="hidden md:table-cell">{t("coverage.signature")}</TableHead>
                      <TableHead>{t("coverage.summary")}</TableHead>
                      <TableHead className="w-[110px]">{t("coverage.status")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getApisByGroup(group.id).map((rawApi) => {
                      const api = localizeApi(rawApi, locale);
                      return (
                        <TableRow key={api.id} className="coverage-row cursor-pointer" onClick={() => onApiSelect(rawApi)}>
                          <TableCell className="font-medium">{api.name}</TableCell>
                          <TableCell className="hidden max-w-[280px] truncate font-mono text-xs text-muted-foreground md:table-cell">
                            {api.signature}
                          </TableCell>
                          <TableCell className="min-w-[220px] text-muted-foreground">{api.summary}</TableCell>
                          <TableCell>
                            <Badge variant={modeVariant[api.mode]}>{localizeCoverageMode(api.mode, locale, t)}</Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
