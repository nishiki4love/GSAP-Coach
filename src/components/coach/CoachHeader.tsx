import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { localizePage, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { BookOpen, Code2, Play } from "lucide-react";
import { NavLink } from "react-router";
import { AppControls } from "./AppControls";
import { coachPages } from "./navigation";
import type { CoachPageId, CoverageTotals } from "./types";

interface CoachHeaderProps {
  activePage: CoachPageId;
  coverageTotals: CoverageTotals;
}

/** 顶部菜单：提供页面级跳转和当前覆盖状态。 */
export function CoachHeader({ activePage, coverageTotals }: CoachHeaderProps) {
  const { locale, t } = useI18n();
  const localizedPages = coachPages.map((page) => localizePage(page, locale));

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur md:rounded-t-xl">
      <SidebarTrigger />
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList>
          {localizedPages.slice(0, 5).map((page) => (
            <NavigationMenuItem key={page.id}>
              <NavigationMenuLink
                render={
                  <NavLink
                    to={page.path}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      activePage === page.id && "bg-muted text-foreground"
                    )}
                  />
                }
              >
                <page.icon data-icon="inline-start" />
                {page.title}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="ml-auto hidden items-center gap-2 lg:flex">
        <Badge variant="secondary">
          <Play data-icon="inline-start" />
          {t("app.header.live", { count: coverageTotals.live })}
        </Badge>
        <Badge variant="secondary">
          <BookOpen data-icon="inline-start" />
          {t("app.header.docs", { count: coverageTotals.docs })}
        </Badge>
        <Badge variant="outline">
          <Code2 data-icon="inline-start" />
          {t("app.header.dev", { count: coverageTotals.dev })}
        </Badge>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="md:hidden"
        render={<NavLink to="/tutorials" />}
        nativeButton={false}
      >
        {t("app.header.tutorials")}
      </Button>
      <AppControls />
    </header>
  );
}
