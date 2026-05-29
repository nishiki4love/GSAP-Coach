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
import { cn } from "@/lib/utils";
import { BookOpen, Code2, Play } from "lucide-react";
import { coachPages } from "./navigation";
import type { CoachPageId, CoverageTotals } from "./types";

interface CoachHeaderProps {
  activePage: CoachPageId;
  coverageTotals: CoverageTotals;
  onPageChange: (page: CoachPageId) => void;
}

/** 顶部菜单：提供页面级跳转和当前覆盖状态。 */
export function CoachHeader({ activePage, coverageTotals, onPageChange }: CoachHeaderProps) {
  return (
    <header className="sticky top-0 flex h-14 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur">
      <SidebarTrigger />
      <NavigationMenu viewport={false} className="hidden md:flex">
        <NavigationMenuList>
          {coachPages.slice(0, 5).map((page) => (
            <NavigationMenuItem key={page.id}>
              <NavigationMenuLink asChild>
                <button
                  type="button"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    activePage === page.id && "bg-muted text-foreground"
                  )}
                  onClick={() => onPageChange(page.id)}
                >
                  <page.icon data-icon="inline-start" />
                  {page.title}
                </button>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="ml-auto hidden items-center gap-2 lg:flex">
        <Badge variant="secondary">
          <Play data-icon="inline-start" />
          互动 {coverageTotals.live}
        </Badge>
        <Badge variant="secondary">
          <BookOpen data-icon="inline-start" />
          教程 {coverageTotals.docs}
        </Badge>
        <Badge variant="outline">
          <Code2 data-icon="inline-start" />
          开发专用 {coverageTotals.dev}
        </Badge>
      </div>

      <Button variant="outline" size="sm" className="md:hidden" onClick={() => onPageChange("coverage")}>
        覆盖矩阵
      </Button>
    </header>
  );
}
