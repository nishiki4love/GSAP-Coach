import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n, type Locale, type MessageKey } from "@/lib/i18n";
import { useTheme, type Theme } from "@/lib/theme";
import { Languages, Monitor, Moon, Sun } from "lucide-react";

const themeIcons: Record<Theme, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const themeLabelKeys: Record<Theme, MessageKey> = {
  light: "theme.light",
  dark: "theme.dark",
  system: "theme.system",
};

const localeLabelKeys: Record<Locale, MessageKey> = {
  zh: "language.zh",
  en: "language.en",
};

/** 顶栏控制组：按 shadcn 推荐模式提供主题切换，并提供中英文切换。 */
export function AppControls() {
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t } = useI18n();
  const ThemeIcon = themeIcons[theme];

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="outline" size="icon" title={t("theme.toggle")} />}
        >
          <ThemeIcon />
          <span className="sr-only">{t("theme.toggle")}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {(["light", "dark", "system"] satisfies Theme[]).map((item) => (
            <DropdownMenuItem key={item} onClick={() => setTheme(item)}>
              {t(themeLabelKeys[item])}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="outline" size="default" title={t("language.toggle")} />}
        >
          <Languages data-icon="inline-start" />
          {locale.toUpperCase()}
          <span className="sr-only">{t("language.toggle")}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {(["zh", "en"] satisfies Locale[]).map((item) => (
            <DropdownMenuItem key={item} onClick={() => setLocale(item)}>
              {t(localeLabelKeys[item])}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
