import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { ArrowLeft } from "lucide-react";
import { Navigate, NavLink, useParams } from "react-router";
import type { ScrollExampleId } from "./types";
import { CleanupScrollExample } from "./scroll-labs/CleanupScrollExample";
import { HorizontalScrollExample } from "./scroll-labs/HorizontalScrollExample";
import { ScrollLabNav } from "./scroll-labs/ScrollLabNav";
import { scrollExamples } from "./scroll-labs/data";
import { VerticalScrollExample } from "./scroll-labs/VerticalScrollExample";

interface ScrollLabsPageProps {
  onStageStatusChange: (status: string) => void;
}

const scrollExampleIds = new Set<ScrollExampleId>(scrollExamples.map((example) => example.id));

/** 滚动实验页：用二级路由承载每个 ScrollTrigger 示例，避免一个页面里混杂所有 pin。 */
export function ScrollLabsPage({ onStageStatusChange }: ScrollLabsPageProps) {
  const { t } = useI18n();
  const { exampleId } = useParams();

  if (!scrollExampleIds.has(exampleId as ScrollExampleId)) {
    return <Navigate to="/scroll-labs/vertical" replace />;
  }

  const activeExample = exampleId as ScrollExampleId;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("scroll.title")}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          {t("scroll.description")}
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-medium">{t("scroll.courseContextTitle")}</div>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{t("scroll.courseContextDescription")}</p>
          </div>
          <Button variant="outline" render={<NavLink to="/tutorials/scroll-flow" />} nativeButton={false}>
            <ArrowLeft data-icon="inline-start" />
            {t("scroll.backToCourse")}
          </Button>
        </CardContent>
      </Card>

      <ScrollLabNav activeExample={activeExample} />

      {activeExample === "vertical" ? <VerticalScrollExample onStageStatusChange={onStageStatusChange} /> : null}
      {activeExample === "horizontal" ? <HorizontalScrollExample onStageStatusChange={onStageStatusChange} /> : null}
      {activeExample === "cleanup" ? <CleanupScrollExample onStageStatusChange={onStageStatusChange} /> : null}
    </div>
  );
}
