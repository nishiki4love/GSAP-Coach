import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { apiItems, getApisByGroup, skillGroups, type SkillGroupId } from "@/data/gsapApiCatalog";
import { cn } from "@/lib/utils";
import { Activity, Atom, Braces, Gauge, Layers, Puzzle, Route, Zap, type LucideIcon } from "lucide-react";
import { coachPages } from "./navigation";
import type { CoachPageId, CoverageTotals } from "./types";

interface CoachSidebarProps {
  activePage: CoachPageId;
  coverageTotals: CoverageTotals;
  selectedGroup: SkillGroupId;
  onPageChange: (page: CoachPageId) => void;
  onSkillGroupSelect: (group: SkillGroupId) => void;
}

/** skill 分组在 sidebar icon 折叠态下使用的固定图标。 */
const skillGroupIcons: Record<SkillGroupId, LucideIcon> = {
  core: Zap,
  timeline: Layers,
  scroll: Route,
  plugins: Puzzle,
  utils: Braces,
  react: Atom,
  performance: Activity,
};

/** 应用侧边栏：承载顶层页面菜单和 GSAP skill 分组索引。 */
export function CoachSidebar({
  activePage,
  coverageTotals,
  selectedGroup,
  onPageChange,
  onSkillGroupSelect,
}: CoachSidebarProps) {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="GSAP API Coach" onClick={() => onPageChange("demo")}>
              <span className="flex size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <Zap />
              </span>
              <span className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold">GSAP API Coach</span>
                <span className="truncate text-xs text-muted-foreground">{apiItems.length} 个 API / 配置项</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>页面结构</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {coachPages.map((page) => (
                <SidebarMenuItem key={page.id}>
                  <SidebarMenuButton
                    isActive={activePage === page.id}
                    tooltip={page.title}
                    onClick={() => onPageChange(page.id)}
                  >
                    <page.icon />
                    <span>{page.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>GSAP Skills</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {skillGroups.map((group) => {
                const Icon = skillGroupIcons[group.id];

                return (
                  <SidebarMenuItem key={group.id}>
                    <SidebarMenuButton
                      className={cn(selectedGroup === group.id && "font-medium")}
                      isActive={selectedGroup === group.id}
                      tooltip={group.title}
                      onClick={() => onSkillGroupSelect(group.id)}
                    >
                      <Icon />
                      <span>{group.title}</span>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>{getApisByGroup(group.id).length}</SidebarMenuBadge>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Separator className="group-data-[collapsible=icon]:hidden" />
        <div className="grid grid-cols-3 gap-2 px-2 py-1 text-center text-xs group-data-[collapsible=icon]:hidden">
          <div>
            <div className="font-medium">{coverageTotals.live}</div>
            <div className="text-muted-foreground">互动</div>
          </div>
          <div>
            <div className="font-medium">{coverageTotals.docs}</div>
            <div className="text-muted-foreground">教程</div>
          </div>
          <div>
            <div className="font-medium">{coverageTotals.dev}</div>
            <div className="text-muted-foreground">开发</div>
          </div>
        </div>
        <SidebarMenu className="hidden group-data-[collapsible=icon]:flex">
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={`${apiItems.length} 个 API / 配置项`} onClick={() => onPageChange("coverage")}>
              <Gauge />
              <span>覆盖矩阵</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
