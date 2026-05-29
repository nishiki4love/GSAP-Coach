import type { Config } from "tailwindcss";

/** Tailwind 主题配置：抽出 GSAP Coach 的基础颜色与字体栈。 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#151815",
        moss: "#6fb936",
        limebeam: "#a8ff04",
        amberline: "#f6b63d",
        cyanline: "#19bfe8",
        paper: "#f6f7f2",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "SFMono-Regular",
          "Consolas",
          "Liberation Mono",
          "monospace",
        ],
      },
      boxShadow: {
        crisp: "0 14px 40px rgba(21, 24, 21, 0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config;
