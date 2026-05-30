import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Theme = "dark" | "light" | "system";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeProviderState {
  theme: Theme;
  resolvedTheme: "dark" | "light";
  setTheme: (theme: Theme) => void;
}

const initialState: ThemeProviderState = {
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

/** 读取系统主题，让 shadcn 的 `.dark` CSS 变量可以跟随系统偏好。 */
function getSystemTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** 同步 html class 和浏览器原生控件色彩，保持 shadcn 主题变量生效。 */
function applyThemeClass(nextTheme: "dark" | "light") {
  const root = window.document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(nextTheme);
  root.style.colorScheme = nextTheme;
}

/** shadcn Vite 推荐的主题 Provider：用 html class 在 light/dark/system 间切换。 */
export function ThemeProvider({ children, defaultTheme = "system", storageKey = "vite-ui-theme" }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => (localStorage.getItem(storageKey) as Theme | null) ?? defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">(() => (theme === "system" ? getSystemTheme() : theme));

  useEffect(() => {
    const nextTheme = theme === "system" ? getSystemTheme() : theme;

    applyThemeClass(nextTheme);
    setResolvedTheme(nextTheme);
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const nextTheme = getSystemTheme();
      applyThemeClass(nextTheme);
      setResolvedTheme(nextTheme);
    };
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [theme]);

  const value = useMemo<ThemeProviderState>(
    () => ({
      theme,
      resolvedTheme,
      setTheme: (nextTheme) => {
        localStorage.setItem(storageKey, nextTheme);
        setThemeState(nextTheme);
      },
    }),
    [resolvedTheme, storageKey, theme],
  );

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>;
}

/** 读取和切换当前主题。 */
export function useTheme() {
  return useContext(ThemeProviderContext);
}
