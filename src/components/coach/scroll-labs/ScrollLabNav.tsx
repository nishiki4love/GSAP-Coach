import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router";
import type { ScrollExampleId } from "../types";
import { scrollExamples } from "./data";

interface ScrollLabNavProps {
  activeExample: ScrollExampleId;
}

/** 滚动实验二级菜单：每个 ScrollTrigger 示例拥有独立路径和生命周期。 */
export function ScrollLabNav({ activeExample }: ScrollLabNavProps) {
  const { t } = useI18n();

  return (
    <nav className="grid gap-2 lg:grid-cols-3" aria-label={t("scroll.navLabel")}>
      {scrollExamples.map((example) => {
        const Icon = example.icon;
        return (
          <NavLink
            key={example.id}
            to={example.path}
            className={cn(
              "group rounded-xl border bg-card p-3 text-left transition-colors hover:bg-muted/60",
              activeExample === example.id && "border-primary bg-primary text-primary-foreground hover:bg-primary",
            )}
          >
            <div className="flex min-w-0 items-start gap-3">
              <span className={cn(
                "mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-foreground",
                activeExample === example.id && "bg-primary-foreground text-primary",
              )}>
                <Icon />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{t(example.labelKey)}</span>
                <span className={cn(
                  "mt-1 block text-xs leading-5 text-muted-foreground",
                  activeExample === example.id && "text-primary-foreground/70",
                )}>
                  {t(example.descriptionKey)}
                </span>
              </span>
            </div>
          </NavLink>
        );
      })}
    </nav>
  );
}
