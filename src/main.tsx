import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { I18nProvider } from "./lib/i18n";
import { ThemeProvider } from "./lib/theme";
import "./styles.css";

/** React 应用入口：挂载 GSAP Coach 演示站。 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <I18nProvider defaultLocale="zh">
        <App />
      </I18nProvider>
    </ThemeProvider>
  </StrictMode>,
);
