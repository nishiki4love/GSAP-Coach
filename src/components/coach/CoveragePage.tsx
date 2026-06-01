import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiItems, getApisByGroup, skillGroups, type ApiItem, type CoverageMode, type SkillGroupId } from "@/data/gsapApiCatalog";
import { localizeApi, localizeCoverageMode, localizeSkillGroup, useI18n } from "@/lib/i18n";
import { Search } from "lucide-react";
import { useMemo } from "react";
import { useLocation, useSearchParams } from "react-router";

const modeVariant: Record<ApiItem["mode"], "default" | "secondary" | "outline"> = {
  互动演示: "default",
  教程覆盖: "secondary",
  开发专用: "outline",
};

const coverageModes: CoverageMode[] = ["互动演示", "教程覆盖", "开发专用"];
const coverageModeSet = new Set<CoverageMode>(coverageModes);
const skillGroupIds = new Set<SkillGroupId>(skillGroups.map((group) => group.id));

interface CoveragePageProps {
  onApiSelect: (api: ApiItem, returnPath?: string) => void;
}

/** 覆盖矩阵页：用表格集中呈现所有 API，而不是堆在一个纵向列表里。 */
export function CoveragePage({ onApiSelect }: CoveragePageProps) {
  const { locale, t } = useI18n();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") ?? "";
  const modeParam = searchParams.get("mode");
  const groupParam = searchParams.get("group");
  const modeFilter: CoverageMode | "all" = modeParam && coverageModeSet.has(modeParam as CoverageMode) ? modeParam as CoverageMode : "all";
  const groupFilter: SkillGroupId | "all" = groupParam && skillGroupIds.has(groupParam as SkillGroupId) ? groupParam as SkillGroupId : "all";
  const localizedGroups = useMemo(() => skillGroups.map((group) => localizeSkillGroup(group, locale)), [locale]);
  const updateFilter = (key: "q" | "mode" | "group", value: string) => {
    const nextParams = new URLSearchParams(searchParams);

    if (!value || value === "all") {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }

    setSearchParams(nextParams, { replace: true });
  };
  const openApiFromCoverage = (api: ApiItem) => {
    onApiSelect(api, `${location.pathname}${location.search}`);
  };
  const filteredGroups = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase();

    return localizedGroups
      .filter((group) => groupFilter === "all" || group.id === groupFilter)
      .map((group) => {
        const apis = getApisByGroup(group.id).filter((rawApi) => {
          const api = localizeApi(rawApi, locale);
          const localizedMode = localizeCoverageMode(rawApi.mode, locale, t);
          const searchableText = [
            api.name,
            api.signature,
            api.summary,
            api.usage,
            api.snippet,
            localizedMode,
            group.title,
            group.source,
          ].join(" ").toLocaleLowerCase();

          return (modeFilter === "all" || rawApi.mode === modeFilter)
            && (!normalizedQuery || searchableText.includes(normalizedQuery));
        });

        return { group, apis };
      })
      .filter(({ apis }) => apis.length > 0);
  }, [groupFilter, locale, localizedGroups, modeFilter, searchQuery, t]);
  const filteredApiCount = filteredGroups.reduce((total, group) => total + group.apis.length, 0);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("coverage.title")}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          {t("coverage.description", { count: apiItems.length })}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("coverage.filtersTitle")}</CardTitle>
          <CardDescription>{t("coverage.results", { count: filteredApiCount, total: apiItems.length })}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="relative max-w-2xl">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder={t("coverage.searchPlaceholder")}
              value={searchQuery}
              onChange={(event) => updateFilter("q", event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-sm font-medium">{t("coverage.modeFilter")}</div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant={modeFilter === "all" ? "default" : "outline"} aria-pressed={modeFilter === "all"} onClick={() => updateFilter("mode", "all")}>
                {t("coverage.allModes")}
              </Button>
              {coverageModes.map((mode) => (
                <Button key={mode} size="sm" variant={modeFilter === mode ? "default" : "outline"} aria-pressed={modeFilter === mode} onClick={() => updateFilter("mode", mode)}>
                  {localizeCoverageMode(mode, locale, t)}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-sm font-medium">{t("coverage.groupFilter")}</div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant={groupFilter === "all" ? "default" : "outline"} aria-pressed={groupFilter === "all"} onClick={() => updateFilter("group", "all")}>
                {t("coverage.allGroups")}
              </Button>
              {localizedGroups.map((group) => (
                <Button key={group.id} size="sm" variant={groupFilter === group.id ? "default" : "outline"} aria-pressed={groupFilter === group.id} onClick={() => updateFilter("group", group.id)}>
                  {group.title}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredGroups.map(({ group, apis }) => (
          <Card key={group.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>{group.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {group.source} · {group.summary}
                  </CardDescription>
                </div>
                <Badge variant="secondary">{apis.length}</Badge>
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
                      <TableHead className="w-[110px]">{t("coverage.action")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apis.map((rawApi) => {
                      const api = localizeApi(rawApi, locale);
                      return (
                        <TableRow key={api.id} className="coverage-row cursor-pointer" onClick={() => openApiFromCoverage(rawApi)}>
                          <TableCell className="font-medium">{api.name}</TableCell>
                          <TableCell className="hidden max-w-[280px] truncate font-mono text-xs text-muted-foreground md:table-cell">
                            {api.signature}
                          </TableCell>
                          <TableCell className="min-w-[220px] text-muted-foreground">{api.summary}</TableCell>
                          <TableCell>
                            <Badge variant={modeVariant[api.mode]}>{localizeCoverageMode(api.mode, locale, t)}</Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(event) => {
                                event.stopPropagation();
                                openApiFromCoverage(rawApi);
                              }}
                            >
                              {t("coverage.viewDetails")}
                            </Button>
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
        {filteredApiCount === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              {t("coverage.noResults")}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
