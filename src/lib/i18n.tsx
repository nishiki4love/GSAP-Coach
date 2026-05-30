import {
  demoTabs,
  skillGroups,
  tutorialChapters,
  type ApiItem,
  type CoverageMode,
  type DemoTab,
  type SkillGroup,
  type SkillGroupId,
  type TutorialChapter,
} from "@/data/gsapApiCatalog";
import i18next from "i18next";
import { useCallback, useEffect, useMemo, type ReactNode } from "react";
import { initReactI18next, useTranslation } from "react-i18next";

export type Locale = "zh" | "en";

interface I18nProviderProps {
  children: ReactNode;
  defaultLocale?: Locale;
  storageKey?: string;
}

export interface I18nState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey, params?: Record<string, string | number>) => string;
}

const messages = {
  zh: {
    "app.loading": "页面模块加载中...",
    "app.stage.ready": "舞台已就绪",
    "app.stage.reset": "舞台已重置",
    "app.stage.noAnimation": "当前演示没有可控 Animation 实例",
    "app.stage.coreStart": "Core: to/from/fromTo/set + stagger",
    "app.stage.coreComplete": "Core: clearProps 已清理背景色",
    "app.stage.timelineStart": "Timeline: tweenFromTo('intro', 'outro')",
    "app.stage.timelineComplete": "Timeline: 标签片段播放完成",
    "app.stage.scrollJump": "ScrollToPlugin: 跳转到垂直滚动实验",
    "app.stage.pluginsStart": "Plugins: SplitText / DrawSVG / MorphSVG / MotionPath / Physics",
    "app.stage.pluginsComplete": "Plugins: SVG 与物理演示完成，拖拽仍可继续",
    "app.stage.scramble": "ScrambleTextPlugin: 插件已激活",
    "app.stage.utilsStatus": "Utils: {raw} → {snapped}° / {unitized}",
    "app.stage.flipComplete": "Flip.from(): 布局切换完成",
    "app.stage.dragging": "Draggable.create(): 正在拖拽",
    "app.stage.inertia": "InertiaPlugin: 释放后保留动量",
    "app.observer.hint": "在舞台上滚动或拖动",
    "app.observer.up": "Observer: onUp",
    "app.observer.down": "Observer: onDown",
    "app.observer.left": "Observer: onLeft",
    "app.observer.right": "Observer: onRight",
    "app.header.live": "互动 {count}",
    "app.header.docs": "教程 {count}",
    "app.header.dev": "开发专用 {count}",
    "app.header.coverage": "覆盖矩阵",
    "app.sidebar.pages": "页面结构",
    "app.sidebar.skills": "GSAP Skills",
    "app.sidebar.apiCount": "{count} 个 API / 配置项",
    "theme.toggle": "切换主题",
    "theme.light": "浅色",
    "theme.dark": "深色",
    "theme.system": "跟随系统",
    "language.toggle": "切换语言",
    "language.zh": "中文",
    "language.en": "English",
    "coverage.live": "互动演示",
    "coverage.docs": "教程覆盖",
    "coverage.dev": "开发专用",
    "workbench.title": "GSAP 功能演示工作台",
    "workbench.description": "运行 API 留在舞台中互动演示；调试工具与外部运行时 API 放入教程和覆盖矩阵。",
    "workbench.brand": "GSAP API Coach",
    "workbench.run": "运行演示",
    "workbench.progress": "动画进度",
    "workbench.pluginTitle": "插件实验区",
    "workbench.pluginDescription": "点击插件演示 tab 后，SplitText、SVG、MotionPath 与物理插件会在舞台中串联运行。",
    "workbench.pluginHint": "可在插件实验室页面单独查看说明。",
    "workbench.utilsTitle": "Utils 快照",
    "workbench.utilsDescription": "clamp、mapRange、snap、pipe 与颜色拆分的当前输出。",
    "workbench.assistantTitle": "教学辅助区",
    "workbench.assistantDescription": "把当前教程步骤、插件索引和 Utils 运行数据合并在一起，帮助你把舞台动画和 API 心智模型对应起来。",
    "workbench.chapterChecklist": "当前学习检查点",
    "workbench.openPluginLab": "打开插件实验室",
    "tutorials.title": "详细使用教程",
    "tutorials.description": "按 Core、Timeline、ScrollTrigger、Plugins、Utils、框架集成和性能优化逐步阅读，避免在同一个长页面里迷路。",
    "coverage.title": "API 覆盖矩阵",
    "coverage.description": "共覆盖 {count} 个来自本地 gsap-skills 的 API、配置项和框架模式。点击任意行可回到演示工作台查看详情。",
    "coverage.signature": "签名",
    "coverage.summary": "说明",
    "coverage.status": "状态",
    "scroll.title": "ScrollTrigger 滚动实验",
    "scroll.description": "这里把垂直轨道和横向轨道拆开承载，分别演示 pin、scrub、containerAnimation、嵌套触发和刷新清理。",
    "scroll.navLabel": "滚动实验二级菜单",
    "scroll.routeHint": "每个示例都由独立二级路由承载，切换时会触发 useGSAP 的清理流程，方便观察 pin spacer 和触发器生命周期。",
    "scroll.example.vertical": "垂直 Pin + Scrub",
    "scroll.example.verticalDescription": "固定视口、进度轨道、步骤卡片逐段激活。",
    "scroll.example.horizontal": "横向 Container",
    "scroll.example.horizontalDescription": "垂直滚动驱动横向画廊，panel 内部做二级触发。",
    "scroll.example.cleanup": "Refresh / Cleanup",
    "scroll.example.cleanupDescription": "批量触发、内容变化刷新、路由切换自动清理。",
    "scroll.vertical": "垂直轨道",
    "scroll.verticalTitle": "Pin + Scrub 时间轴",
    "scroll.verticalCopy": "一个独立的垂直流程轨道：左侧 runner 按滚动推进，右侧卡片按 timeline 节点逐步进入激活态。",
    "scroll.horizontal": "横向轨道",
    "scroll.horizontalTitle": "Container Animation 画廊",
    "scroll.horizontalCopy": "横向演示独立成段：顶层轨道负责平移，panel 内部再使用 containerAnimation 做二级触发。",
    "scroll.panelMeter": "panel meter",
    "scroll.panelHint": "每张卡片都有自己的 trigger、start、end 和 scrub，方便观察横向滚动中的二级动画。",
    "scroll.verticalCleanupTitle": "垂直轨道清理规则",
    "scroll.verticalCleanupDescription": "页面切换时，GSAP context 会 revert 本页创建的 pin、scrub 和 batch 监听。",
    "scroll.verticalCleanupBody": "垂直段使用 `.vertical-scroll-lab`、`.vertical-rail`、`.vertical-step-card`，动画逻辑和页面结构保持分离。",
    "scroll.horizontalCleanupTitle": "横向轨道清理规则",
    "scroll.horizontalCleanupDescription": "横向段使用单独的 `.horizontal-scroll-lab` 和 `.horizontal-track`，避免和垂直 pin 段抢触发范围。",
    "scroll.horizontalCleanupBody": "横向内部触发器统一引用顶层 scrollTween 作为 containerAnimation，布局变化后再调用 ScrollTrigger.refresh()。",
    "scroll.cleanup": "清理实验",
    "scroll.cleanupTitle": "Refresh + Batch 生命周期",
    "scroll.cleanupCopy": "这个示例不使用 pin，而是演示列表类内容如何用 ScrollTrigger.batch() 入场，并在内容数量变化后只刷新一次。",
    "scroll.cleanupRefresh": "刷新内容",
    "scroll.cleanupCardBody": "打开浏览器检查时可以看到切换二级菜单后旧触发器会被 revert，不会继续监听已经卸载的 DOM。",
    "plugins.title": "插件实验室",
    "plugins.description": "Flip、Draggable、SplitText、SVG、物理和开发辅助插件集中在这里，主工作台只保留运行入口。",
    "plugins.flipToggle": "Flip 布局切换",
    "plugins.viewTutorial": "查看教程",
    "performance.title": "性能指南",
    "performance.description": "把性能建议单独成页，方便在写动画前快速确认：优先 transform/opacity，高频输入用 quickTo，滚动刷新只在布局改变后执行。",
  },
  en: {
    "app.loading": "Loading page module...",
    "app.stage.ready": "Stage is ready",
    "app.stage.reset": "Stage has been reset",
    "app.stage.noAnimation": "No controllable Animation instance for this demo",
    "app.stage.coreStart": "Core: to/from/fromTo/set + stagger",
    "app.stage.coreComplete": "Core: clearProps cleaned the background color",
    "app.stage.timelineStart": "Timeline: tweenFromTo('intro', 'outro')",
    "app.stage.timelineComplete": "Timeline: label segment complete",
    "app.stage.scrollJump": "ScrollToPlugin: jumped to the vertical scroll lab",
    "app.stage.pluginsStart": "Plugins: SplitText / DrawSVG / MorphSVG / MotionPath / Physics",
    "app.stage.pluginsComplete": "Plugins: SVG and physics demo complete; dragging is still enabled",
    "app.stage.scramble": "ScrambleTextPlugin: plugins activated",
    "app.stage.utilsStatus": "Utils: {raw} to {snapped}deg / {unitized}",
    "app.stage.flipComplete": "Flip.from(): layout transition complete",
    "app.stage.dragging": "Draggable.create(): dragging",
    "app.stage.inertia": "InertiaPlugin: momentum continues after release",
    "app.observer.hint": "Scroll or drag on the stage",
    "app.observer.up": "Observer: onUp",
    "app.observer.down": "Observer: onDown",
    "app.observer.left": "Observer: onLeft",
    "app.observer.right": "Observer: onRight",
    "app.header.live": "Live {count}",
    "app.header.docs": "Tutorials {count}",
    "app.header.dev": "Dev-only {count}",
    "app.header.coverage": "Coverage",
    "app.sidebar.pages": "Pages",
    "app.sidebar.skills": "GSAP Skills",
    "app.sidebar.apiCount": "{count} APIs / options",
    "theme.toggle": "Toggle theme",
    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.system": "System",
    "language.toggle": "Switch language",
    "language.zh": "中文",
    "language.en": "English",
    "coverage.live": "Live demo",
    "coverage.docs": "Tutorial",
    "coverage.dev": "Dev-only",
    "workbench.title": "GSAP Demo Workbench",
    "workbench.description": "Interactive APIs stay on the stage; debugging tools and external-runtime APIs live in tutorials and the coverage matrix.",
    "workbench.brand": "GSAP API Coach",
    "workbench.run": "Run demo",
    "workbench.progress": "Animation progress",
    "workbench.pluginTitle": "Plugin Lab Summary",
    "workbench.pluginDescription": "After choosing the plugin demo tab, SplitText, SVG, MotionPath, and physics plugins run together on the stage.",
    "workbench.pluginHint": "Open the plugin lab page for dedicated notes.",
    "workbench.utilsTitle": "Utils Snapshot",
    "workbench.utilsDescription": "Current output from clamp, mapRange, snap, pipe, and color splitting.",
    "workbench.assistantTitle": "Teaching Support",
    "workbench.assistantDescription": "Current tutorial steps, plugin index, and Utils telemetry now live together so the stage animation maps back to the API model.",
    "workbench.chapterChecklist": "Current learning checklist",
    "workbench.openPluginLab": "Open plugin lab",
    "tutorials.title": "Detailed Tutorials",
    "tutorials.description": "Read Core, Timeline, ScrollTrigger, Plugins, Utils, framework integration, and performance topics as separate learning paths.",
    "coverage.title": "API Coverage Matrix",
    "coverage.description": "Covers {count} APIs, options, and framework patterns from the local gsap-skills. Click any row to inspect it in the workbench.",
    "coverage.signature": "Signature",
    "coverage.summary": "Summary",
    "coverage.status": "Status",
    "scroll.title": "ScrollTrigger Experiments",
    "scroll.description": "Vertical and horizontal tracks are separated to demonstrate pin, scrub, containerAnimation, nested triggers, and refresh cleanup.",
    "scroll.navLabel": "Scroll experiment secondary navigation",
    "scroll.routeHint": "Each example is mounted by its own sub-route. Switching examples triggers useGSAP cleanup so pin spacers and triggers stay easy to inspect.",
    "scroll.example.vertical": "Vertical Pin + Scrub",
    "scroll.example.verticalDescription": "Pinned viewport, progress rail, and step cards activating along the scroll range.",
    "scroll.example.horizontal": "Horizontal Container",
    "scroll.example.horizontalDescription": "Vertical scroll drives a horizontal gallery with nested panel triggers.",
    "scroll.example.cleanup": "Refresh / Cleanup",
    "scroll.example.cleanupDescription": "Batched triggers, content refresh, and automatic cleanup between routes.",
    "scroll.vertical": "Vertical Track",
    "scroll.verticalTitle": "Pin + Scrub Timeline",
    "scroll.verticalCopy": "A dedicated vertical process track: the runner follows scroll progress while cards activate along timeline points.",
    "scroll.horizontal": "Horizontal Track",
    "scroll.horizontalTitle": "Container Animation Gallery",
    "scroll.horizontalCopy": "A separate horizontal section: the top-level track moves first, then each panel uses containerAnimation for nested triggers.",
    "scroll.panelMeter": "panel meter",
    "scroll.panelHint": "Each card owns its trigger, start, end, and scrub so nested animation inside horizontal scrolling is easy to inspect.",
    "scroll.verticalCleanupTitle": "Vertical Track Cleanup",
    "scroll.verticalCleanupDescription": "When the page changes, GSAP context reverts the pin, scrub, and batch listeners created here.",
    "scroll.verticalCleanupBody": "The vertical demo uses `.vertical-scroll-lab`, `.vertical-rail`, and `.vertical-step-card` so animation logic stays separated from layout.",
    "scroll.horizontalCleanupTitle": "Horizontal Track Cleanup",
    "scroll.horizontalCleanupDescription": "The horizontal demo uses dedicated `.horizontal-scroll-lab` and `.horizontal-track` selectors to avoid competing with vertical pin ranges.",
    "scroll.horizontalCleanupBody": "Nested horizontal triggers all reference the top-level scrollTween as containerAnimation; call ScrollTrigger.refresh() after layout changes.",
    "scroll.cleanup": "Cleanup Lab",
    "scroll.cleanupTitle": "Refresh + Batch lifecycle",
    "scroll.cleanupCopy": "This example skips pinning and shows how list-style content can enter with ScrollTrigger.batch(), then refresh once after content changes.",
    "scroll.cleanupRefresh": "Refresh content",
    "scroll.cleanupCardBody": "When inspecting in the browser, switching sub-routes reverts old triggers so unmounted DOM is not observed.",
    "plugins.title": "Plugin Lab",
    "plugins.description": "Flip, Draggable, SplitText, SVG, physics, and developer helper plugins live here while the workbench keeps only the runtime entry points.",
    "plugins.flipToggle": "Toggle Flip Layout",
    "plugins.viewTutorial": "View tutorial",
    "performance.title": "Performance Guide",
    "performance.description": "A dedicated page for animation performance checks: prefer transform/opacity, use quickTo for high-frequency input, and refresh scroll only after layout changes.",
  },
} as const;

export type MessageKey = keyof typeof messages.zh;

const localeStorageKey = "gsap-coach-locale";

const initialLocale = (() => {
  if (typeof window === "undefined") return "zh";
  const storedLocale = window.localStorage.getItem(localeStorageKey);
  return storedLocale === "en" || storedLocale === "zh" ? storedLocale : "zh";
})();

if (!i18next.isInitialized) {
  void i18next.use(initReactI18next).init({
    resources: {
      zh: { translation: messages.zh },
      en: { translation: messages.en },
    },
    lng: initialLocale,
    fallbackLng: "zh",
    interpolation: { escapeValue: false, prefix: "{", suffix: "}" },
  });
}

const pageTranslations = {
  en: {
    demo: { title: "Workbench", description: "Run Tween, Timeline, plugin, and Utils demos" },
    tutorials: { title: "Tutorials", description: "Read GSAP usage steps by learning path" },
    coverage: { title: "Coverage", description: "Inspect every covered API in a table" },
    "scroll-labs": { title: "Scroll Labs", description: "ScrollTrigger pin, scrub, and containerAnimation" },
    plugins: { title: "Plugin Lab", description: "Flip, Draggable, SplitText, SVG, and physics plugins" },
    performance: { title: "Performance", description: "transform, quickTo, will-change, and cleanup strategy" },
  },
} as const;

const skillGroupTranslations: Record<"en", Record<SkillGroupId, Pick<SkillGroup, "title" | "summary">>> = {
  en: {
    core: { title: "Core Tween", summary: "Core tweening, CSSPlugin, responsive motion, and accessible animation." },
    timeline: { title: "Timeline", summary: "Sequencing, labels, nested timelines, and playback control." },
    scroll: { title: "ScrollTrigger", summary: "Scroll triggers, scrub, pin, batch, horizontal scrolling, refresh, and cleanup." },
    plugins: { title: "Plugins", summary: "ScrollTo, Flip, Draggable, SplitText, SVG, physics, and developer plugins." },
    utils: { title: "Utils", summary: "Mapping, randomization, snapping, selection, units, and function pipelines." },
    react: { title: "React / Frameworks", summary: "Lifecycle, scoping, and cleanup patterns for React, Vue, Nuxt, and Svelte." },
    performance: { title: "Performance", summary: "transform/opacity, will-change, quickTo, and scroll performance strategy." },
  },
};

const demoTabTranslations: Record<"en", Record<DemoTab["id"], Pick<DemoTab, "label" | "summary">>> = {
  en: {
    core: { label: "Tween Basics", summary: "to/from/fromTo/set, transform aliases, CSS variables, stagger, and playback control." },
    timeline: { label: "Timeline", summary: "Labels, position parameters, nested timelines, and playhead control." },
    scroll: { label: "ScrollTrigger", summary: "scrub, pin, batch, containerAnimation, refresh, and kill." },
    plugins: { label: "Plugin Lab", summary: "Flip, Draggable, Observer, SplitText, SVG, physics, and ScrollTo." },
    utils: { label: "Utils Mapper", summary: "clamp, mapRange, normalize, interpolate, random, snap, pipe, and wrap." },
  },
};

const tutorialTranslations: Record<"en", Record<string, Pick<TutorialChapter, "title" | "intro" | "steps">>> = {
  en: {
    "mental-model": {
      title: "1. Build the GSAP mental model",
      intro: "GSAP is built from targets, vars, and controllable Animation instances.",
      steps: [
        "Use gsap.set() first to create reproducible starting states.",
        "Use gsap.to(), from(), or fromTo() to express a single state change.",
        "Store the returned Tween and connect play, pause, reverse, and progress to controls.",
        "Prefer transform aliases and autoAlpha to reduce layout and interaction side effects.",
      ],
    },
    sequence: {
      title: "2. Use Timeline for multi-step animation",
      intro: "Timeline is the animation orchestrator; avoid stitching complex sequences with many delays.",
      steps: [
        "Put shared duration and ease values into timeline defaults.",
        "Use the position parameter for sync, offsets, and label jumps.",
        "Wrap local motion into a child timeline, then add it to a master timeline.",
        "Use time, progress, and tweenFromTo while debugging a specific segment.",
      ],
    },
    "scroll-flow": {
      title: "3. Keep scroll animation on the top-level Tween or Timeline",
      intro: "ScrollTrigger maps scroll ranges to animation progress or callbacks.",
      steps: [
        "Register ScrollTrigger, then define scrollTrigger on the top-level tween or timeline.",
        "Use scrub for progress binding and toggleActions for enter/leave playback.",
        "Call ScrollTrigger.refresh() after dynamic content, fonts, or images change layout.",
        "In SPA routes, kill triggers or rely on useGSAP/gsap.context to revert automatically.",
      ],
    },
    "plugin-lab": {
      title: "4. Register plugins by purpose",
      intro: "The local gsap-plugins skill covers scroll, layout, drag, text, SVG, physics, and debugging plugins.",
      steps: [
        "Call gsap.registerPlugin() before usage, ideally from one setup module.",
        "For Flip, call getState first, change the DOM, then run Flip.from(state).",
        "After SplitText, revert the split or let useGSAP/context clean it up.",
        "GSDevTools and MotionPathHelper are developer helpers; this app keeps them tutorial-only.",
      ],
    },
    "utils-pipeline": {
      title: "5. Use Utils to turn input into animation values",
      intro: "gsap.utils is a pure-function toolbox for mapping scroll, pointer, and data values.",
      steps: [
        "When reusing a mapping, omit the final value argument to get a function.",
        "Pass true explicitly when you need the function form of random.",
        "Use getUnit/unitize for units; mapRange and normalize operate on numbers.",
        "In components, use selector(scope) and toArray(value, scope) to limit targets.",
      ],
    },
    "framework-cleanup": {
      title: "6. Scope and cleanup matter most in frameworks",
      intro: "React should use useGSAP; Vue, Svelte, and Nuxt follow mounted-create and unmount-revert principles.",
      steps: [
        "In React, pass scope to useGSAP and wrap event callbacks with contextSafe.",
        "Without @gsap/react, use gsap.context in useEffect and call ctx.revert() in cleanup.",
        "Create animation after Vue onMounted or Svelte onMount, then revert on unmount.",
        "In Nuxt, wrap lazyLoadPlugin for on-demand plugins such as SplitText and MorphSVG.",
      ],
    },
    "performance-loop": {
      title: "7. Performance priority: fewer layouts, fewer recreations, timely cleanup",
      intro: "Prefer transform/opacity, batch long lists, and use quickTo for high-frequency input.",
      steps: [
        "Move with x/y instead of left/top; scale with scale instead of width/height.",
        "Apply will-change only to elements that actually animate.",
        "Use quickTo for pointer followers and real-time input mapping.",
        "Call ScrollTrigger.refresh() only after real layout changes, not on every scroll.",
      ],
    },
  },
};

const apiNameTranslations: Record<string, string> = {
  "core-vars": "Common vars",
  "tween-control": "Tween control",
  "timeline-nesting": "Nested timeline",
  "timeline-control": "Timeline control",
  "perf-transform-opacity": "Prefer transform / opacity",
  "perf-batch": "Batched reads / stagger / virtualization",
};

const modeKey: Record<CoverageMode, MessageKey> = {
  "互动演示": "coverage.live",
  "教程覆盖": "coverage.docs",
  "开发专用": "coverage.dev",
};

/** 站点语言 Provider：使用 react-i18next 驱动语言状态，并同步 html lang。 */
export function I18nProvider({ children, defaultLocale = "zh", storageKey = "gsap-coach-locale" }: I18nProviderProps) {
  const { i18n } = useTranslation();
  const locale: Locale = i18n.resolvedLanguage?.startsWith("en") ? "en" : "zh";

  useEffect(() => {
    const storedLocale = window.localStorage.getItem(storageKey);
    if ((storedLocale === "en" || storedLocale === "zh") && storedLocale !== locale) {
      void i18n.changeLanguage(storedLocale);
      return;
    }
    if (!storedLocale && defaultLocale !== locale) {
      void i18n.changeLanguage(defaultLocale);
      return;
    }

    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [defaultLocale, i18n, locale, storageKey]);

  return children;
}

/** 读取当前语言和翻译函数；内部由 react-i18next 提供成熟的资源与重渲染管理。 */
export function useI18n() {
  const { i18n, t: translate } = useTranslation();
  const locale: Locale = i18n.resolvedLanguage?.startsWith("en") ? "en" : "zh";

  const setLocale = useCallback(
    (nextLocale: Locale) => {
      window.localStorage.setItem(localeStorageKey, nextLocale);
      void i18n.changeLanguage(nextLocale);
    },
    [i18n],
  );

  return useMemo<I18nState>(
    () => ({
      locale,
      setLocale,
      t: (key, params) => translate(key, params) as string,
    }),
    [locale, setLocale, translate],
  );
}

export function localizePage<T extends { id: keyof typeof pageTranslations.en; title: string; description: string }>(page: T, locale: Locale): T {
  if (locale === "zh") return page;
  return { ...page, ...pageTranslations.en[page.id] };
}

export function localizeSkillGroup(group: SkillGroup, locale: Locale): SkillGroup {
  if (locale === "zh") return group;
  return { ...group, ...skillGroupTranslations.en[group.id] };
}

export function localizeDemoTab(tab: DemoTab, locale: Locale): DemoTab {
  if (locale === "zh") return tab;
  return { ...tab, ...demoTabTranslations.en[tab.id] };
}

export function localizeTutorialChapter(chapter: TutorialChapter, locale: Locale): TutorialChapter {
  if (locale === "zh") return chapter;
  return { ...chapter, ...tutorialTranslations.en[chapter.id] };
}

export function localizeCoverageMode(mode: CoverageMode, locale: Locale, t: I18nState["t"]) {
  return locale === "zh" ? mode : t(modeKey[mode]);
}

export function localizeApi(api: ApiItem, locale: Locale): ApiItem {
  if (locale === "zh") return api;

  const group = localizeSkillGroup(skillGroups.find((item) => item.id === api.group) ?? skillGroups[0], locale);

  return {
    ...api,
    name: apiNameTranslations[api.id] ?? api.name,
    summary: `Covers ${apiNameTranslations[api.id] ?? api.name} for ${group.title} workflows.`,
    usage: "Use the code sample with scoped targets, transform-friendly properties, and framework cleanup where needed.",
  };
}

export function getLocalizedDemoTabs(locale: Locale) {
  return demoTabs.map((tab) => localizeDemoTab(tab, locale));
}

export function getLocalizedTutorialChapters(locale: Locale) {
  return tutorialChapters.map((chapter) => localizeTutorialChapter(chapter, locale));
}
