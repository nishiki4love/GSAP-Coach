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
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { apiItems, getApisByGroup, skillGroups, type SkillGroupId } from "@/data/gsapApiCatalog";
import { localizePage, localizeSkillGroup, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Activity, Atom, Braces, Gauge, Layers, Puzzle, Route, Zap, type LucideIcon } from "lucide-react";
import { NavLink } from "react-router";
import { CoachLogo } from "./CoachLogo";
import { coachPages } from "./navigation";
import type { CoachPageId, CoverageTotals } from "./types";

interface CoachSidebarProps {
  activePage: CoachPageId;
  coverageTotals: CoverageTotals;
  selectedGroup: SkillGroupId;
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
  onSkillGroupSelect,
}: CoachSidebarProps) {
  const { locale, t } = useI18n();
  const localizedPages = coachPages.map((page) => localizePage(page, locale));
  const localizedGroups = skillGroups.map((group) => localizeSkillGroup(group, locale));

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="GSAP API Coach"
              render={<NavLink to="/" />}
            >
              <CoachLogo className="!size-10 shrink-0 rounded-md bg-sidebar-primary text-sidebar-primary-foreground" />
              <span className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold">GSAP API Coach</span>
                <span className="truncate text-xs text-muted-foreground">{t("app.sidebar.apiCount", { count: apiItems.length })}</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("app.sidebar.pages")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {localizedPages.map((page) => (
                <SidebarMenuItem key={page.id}>
                  <SidebarMenuButton
                    isActive={activePage === page.id}
                    tooltip={page.title}
                    render={<NavLink to={page.path} />}
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
          <SidebarGroupLabel>{t("app.sidebar.skills")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {localizedGroups.map((group) => {
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
            <div className="text-muted-foreground">{t("coverage.live")}</div>
          </div>
          <div>
            <div className="font-medium">{coverageTotals.docs}</div>
            <div className="text-muted-foreground">{t("coverage.docs")}</div>
          </div>
          <div>
            <div className="font-medium">{coverageTotals.dev}</div>
            <div className="text-muted-foreground">{t("coverage.dev")}</div>
          </div>
        </div>
        <SidebarMenu className="hidden group-data-[collapsible=icon]:flex">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={t("app.sidebar.apiCount", { count: apiItems.length })}
              render={<NavLink to="/coverage" />}
            >
              <Gauge />
              <span>{t("app.header.coverage")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
