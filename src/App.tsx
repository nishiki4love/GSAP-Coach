import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { apiItems, findApiItem, getApisByGroup, tutorialChapters, type ApiItem, type CoverageMode, type DemoTab, type SkillGroupId } from "@/data/gsapApiCatalog";
import { localizeApi, localizeTutorialChapter, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router";
import { CoachHeader } from "./components/coach/CoachHeader";
import { CoachSidebar } from "./components/coach/CoachSidebar";
import { readFavoriteApiIds, readFavoriteSnippetIds, writeFavoriteApiIds, writeFavoriteSnippetIds } from "./components/coach/learningCollections";
import { getPageIdFromPath, pagePathById } from "./components/coach/navigation";
import { getNextTutorialChapterId, getRecommendedExperimentId, readCompletedTutorialIds, writeCompletedTutorialIds } from "./components/coach/tutorialProgress";
import type { AnimationAction, CoachPageId, CoverageTotals, DemoControls, UtilitySnapshot } from "./components/coach/types";
import { WorkbenchPage } from "./components/coach/WorkbenchPage";
import {
  booleanParam,
  getDemoParameterControls,
  mergeDemoParameterValues,
  numberParam,
  stringParam,
  type DemoParameterValue,
  type DemoParameterValues,
} from "./components/coach/workbench/demoParameterControls";
import {
  Draggable,
  Flip,
  gsap,
  Observer,
  ScrollTrigger,
  SplitText,
  setupGsap,
  useGSAP,
} from "./lib/gsapSetup";

const TutorialsPage = lazy(() => import("./components/coach/TutorialsPage").then((module) => ({ default: module.TutorialsPage })));
const TutorialLessonPage = lazy(() => import("./components/coach/TutorialLessonPage").then((module) => ({ default: module.TutorialLessonPage })));
const CoveragePage = lazy(() => import("./components/coach/CoveragePage").then((module) => ({ default: module.CoveragePage })));
const ScrollLabsPage = lazy(() => import("./components/coach/ScrollLabsPage").then((module) => ({ default: module.ScrollLabsPage })));
const PluginsPage = lazy(() => import("./components/coach/PluginsPage").then((module) => ({ default: module.PluginsPage })));
const PerformancePage = lazy(() => import("./components/coach/PerformancePage").then((module) => ({ default: module.PerformancePage })));

setupGsap();

const coverageModeToKey: Record<CoverageMode, keyof CoverageTotals> = {
  "互动演示": "live",
  "教程覆盖": "docs",
  "开发专用": "dev",
};

const demoIdByApiGroup: Partial<Record<SkillGroupId, DemoTab["id"]>> = {
  core: "core",
  timeline: "timeline",
  scroll: "scroll",
  plugins: "plugins",
  utils: "utils",
  react: "core",
  performance: "utils",
};

const fallbackApiIdByDemo: Record<DemoTab["id"], string> = {
  core: "gsap-to",
  timeline: "timeline-create",
  scroll: "scroll-trigger-config",
  plugins: "flip",
  utils: "utils-clamp",
};

/** 根据 API 所属 skill 推导工作台 tab；框架和性能 API 复用最接近的舞台。 */
function getDemoIdForApi(api: ApiItem | undefined, fallbackDemoId: DemoTab["id"] = "core"): DemoTab["id"] {
  return api ? demoIdByApiGroup[api.group] ?? fallbackDemoId : fallbackDemoId;
}

/** 仅接受覆盖矩阵页生成的返回地址，避免手写 returnTo 跳到其它路由。 */
function getCoverageReturnPath(rawReturnToPath: string) {
  if (rawReturnToPath === "/coverage" || rawReturnToPath.startsWith("/coverage?")) return rawReturnToPath;

  return "";
}

/** 懒加载页面时使用的轻量占位，避免把所有页面组件打进首屏入口。 */
function LazyPageFallback() {
  const { t } = useI18n();

  return (
    <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
      {t("app.loading")}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <CoachAppShell />
    </BrowserRouter>
  );
}

/** 生成工具函数演示的数据快照，让 utils 面板每次点击都能展示不同映射结果。 */
function createUtilitySnapshot(raw = Math.round(gsap.utils.random(-40, 140, 5))): UtilitySnapshot {
  const clamped = gsap.utils.clamp(0, 100, raw);
  const normalized = Number(gsap.utils.normalize(0, 100, clamped).toFixed(2));
  const mapped = Math.round(gsap.utils.mapRange(0, 1, 0, 360, normalized));
  const snapped = gsap.utils.snap(15, mapped);
  const color = gsap.utils.interpolate("#f6b63d", "#19bfe8", normalized) as string;
  const colorHsl = gsap.utils.splitColor(color, true).map((value) => Math.round(value));
  const pxUnitizer = gsap.utils.unitize(gsap.utils.clamp(0, 120), "px");
  const piped = gsap.utils.pipe(
    gsap.utils.normalize(-40, 140),
    gsap.utils.mapRange(0, 1, 0, 360),
    gsap.utils.snap(30),
  )(raw);

  return {
    raw,
    clamped,
    normalized,
    mapped,
    snapped,
    color,
    colorHsl,
    unit: gsap.utils.getUnit("42px"),
    unitized: pxUnitizer(raw),
    wrapped: Math.round(gsap.utils.wrap(0, 360, mapped + 380)),
    yoyo: Math.round(gsap.utils.wrapYoyo(0, 100, raw + 70)),
    piped: Math.round(piped),
    shuffled: gsap.utils.shuffle(["Core", "Timeline", "Scroll", "Plugin", "Utils"]),
    randomPick: gsap.utils.random(["power3", "back", "elastic", "none"]),
  };
}

function CoachAppShell() {
  const { locale, t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const activeAnimationRef = useRef<gsap.core.Animation | null>(null);
  const splitRef = useRef<ReturnType<typeof SplitText.create> | null>(null);
  const apiDetailRef = useRef<HTMLDivElement | null>(null);

  const activePage = useMemo<CoachPageId>(() => getPageIdFromPath(location.pathname), [location.pathname]);
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const queryApiId = useMemo(() => searchParams.get("api"), [searchParams]);
  const returnToPath = useMemo(() => {
    const rawReturnToPath = searchParams.get("returnTo") ?? "";

    return getCoverageReturnPath(rawReturnToPath);
  }, [searchParams]);
  const queryApi = useMemo(() => (queryApiId ? findApiItem(queryApiId) : undefined), [queryApiId]);
  const [selectedGroup, setSelectedGroup] = useState<SkillGroupId>("core");
  const [selectedApiId, setSelectedApiId] = useState("gsap-to");
  const [activeDemo, setActiveDemo] = useState<DemoTab["id"]>("core");
  const [stageStatus, setStageStatus] = useState(() => t("app.stage.ready"));
  const [progress, setProgress] = useState(0);
  const [pluginLayout, setPluginLayout] = useState<"grid" | "list">("grid");
  const [observerHint, setObserverHint] = useState(() => t("app.observer.hint"));
  const [utilsSnapshot, setUtilsSnapshot] = useState(() => createUtilitySnapshot(65));
  const [demoParameterValuesByApiId, setDemoParameterValuesByApiId] = useState<Record<string, DemoParameterValues>>({});
  const [completedTutorialIds, setCompletedTutorialIds] = useState(readCompletedTutorialIds);
  const [favoriteApiIds, setFavoriteApiIds] = useState(readFavoriteApiIds);
  const [favoriteSnippetIds, setFavoriteSnippetIds] = useState(readFavoriteSnippetIds);

  const selectedApi = useMemo(() => {
    const api = findApiItem(selectedApiId) ?? getApisByGroup(selectedGroup)[0];
    return api ? localizeApi(api, locale) : undefined;
  }, [locale, selectedApiId, selectedGroup]);
  const parameterControls = useMemo(() => getDemoParameterControls(selectedApi), [selectedApi]);
  const parameterValues = useMemo(
    () => mergeDemoParameterValues(selectedApi, selectedApi ? demoParameterValuesByApiId[selectedApi.id] : undefined),
    [demoParameterValuesByApiId, selectedApi],
  );
  const selectedChapter = useMemo(
    () => localizeTutorialChapter(tutorialChapters.find((chapter) => chapter.group === selectedGroup) ?? tutorialChapters[0], locale),
    [locale, selectedGroup],
  );
  const coverageTotals = useMemo<CoverageTotals>(
    () => apiItems.reduce(
      (totals, item) => {
        totals[coverageModeToKey[item.mode]] += 1;
        return totals;
      },
      { live: 0, docs: 0, dev: 0 },
    ),
    [],
  );
  const nextTutorialChapterId = useMemo(
    () => getNextTutorialChapterId(completedTutorialIds),
    [completedTutorialIds],
  );
  const recommendedExperimentId = useMemo(
    () => getRecommendedExperimentId(completedTutorialIds),
    [completedTutorialIds],
  );

  const { contextSafe } = useGSAP({ scope: rootRef });

  useEffect(() => {
    setStageStatus(t("app.stage.ready"));
    setObserverHint(t("app.observer.hint"));
  }, [locale, t]);

  useEffect(() => {
    writeCompletedTutorialIds(completedTutorialIds);
  }, [completedTutorialIds]);

  useEffect(() => {
    writeFavoriteApiIds(favoriteApiIds);
  }, [favoriteApiIds]);

  useEffect(() => {
    writeFavoriteSnippetIds(favoriteSnippetIds);
  }, [favoriteSnippetIds]);

  useEffect(() => {
    if (!queryApi) return;

    setSelectedGroup(queryApi.group);
    setSelectedApiId(queryApi.id);
    setActiveDemo(getDemoIdForApi(queryApi, activeDemo));
  }, [activeDemo, queryApi]);

  useEffect(() => {
    if (activePage !== "demo" || !queryApi) return;

    const detail = apiDetailRef.current;
    if (!detail) return;

    const scrollFrame = window.requestAnimationFrame(() => {
      detail.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => {
      window.cancelAnimationFrame(scrollFrame);
    };
  }, [activePage, queryApi]);

  useGSAP(
    () => {
      if (activePage !== "demo") return;

      const q = gsap.utils.selector(rootRef);
      const stage = q(".demo-stage")[0] as HTMLElement | undefined;

      const mm = gsap.matchMedia();
      mm.add(
        {
          isDesktop: "(min-width: 1000px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, reduceMotion } = context.conditions ?? {};
          gsap.to(q(".top-meter"), {
            x: isDesktop ? 22 : 0,
            duration: reduceMotion ? 0 : 0.7,
            ease: "coach-snap",
          });
        },
        rootRef,
      );

      if (!stage) return () => mm.revert();

      let stageRect = stage.getBoundingClientRect();
      const updateStageRect = () => {
        stageRect = stage.getBoundingClientRect();
      };
      stage.addEventListener("pointerenter", updateStageRect, { passive: true });
      window.addEventListener("resize", updateStageRect, { passive: true });

      Draggable.create(q(".drag-card"), {
        type: "x,y",
        bounds: stage,
        inertia: true,
        edgeResistance: 0.75,
        onDragStart: () => setStageStatus(t("app.stage.dragging")),
        onDragEnd: () => setStageStatus(t("app.stage.inertia")),
      });

      Observer.create({
        target: stage,
        type: "wheel,touch,pointer",
        tolerance: 10,
        onUp: () => setObserverHint(t("app.observer.up")),
        onDown: () => setObserverHint(t("app.observer.down")),
        onLeft: () => setObserverHint(t("app.observer.left")),
        onRight: () => setObserverHint(t("app.observer.right")),
      });

      return () => {
        stage.removeEventListener("pointerenter", updateStageRect);
        window.removeEventListener("resize", updateStageRect);
        mm.revert();
      };
    },
    { scope: rootRef, dependencies: [activePage, selectedApiId, t], revertOnUpdate: true },
  );

  useGSAP(
    () => {
      if (activePage !== "coverage") return;

      const q = gsap.utils.selector(rootRef);
      ScrollTrigger.batch(q(".coverage-row"), {
        interval: 0.08,
        batchMax: 8,
        start: "top 92%",
        onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, stagger: 0.03, overwrite: true }),
        onLeaveBack: (batch) => gsap.set(batch, { autoAlpha: 0.55, y: 8, overwrite: true }),
      });
    },
    { scope: rootRef, dependencies: [activePage], revertOnUpdate: true },
  );

  /** 按 skill 分组选择 API，并切回演示工作台显示详情。 */
  const selectSkillGroup = useCallback((group: SkillGroupId) => {
    const firstApi = getApisByGroup(group)[0];
    setSelectedGroup(group);
    setSelectedApiId(firstApi.id);
    setActiveDemo(getDemoIdForApi(firstApi, activeDemo));
    navigate(`${pagePathById.demo}?api=${firstApi.id}`);
  }, [activeDemo, navigate]);

  /** 选择任意 API 行后，切到演示工作台的详情面板。 */
  const selectApi = useCallback((api: ApiItem, returnPath?: string) => {
    setSelectedGroup(api.group);
    setSelectedApiId(api.id);
    setActiveDemo(getDemoIdForApi(api, activeDemo));
    const nextParams = new URLSearchParams({ api: api.id });
    if (returnPath) nextParams.set("returnTo", returnPath);
    navigate(`${pagePathById.demo}?${nextParams.toString()}`);
  }, [activeDemo, navigate]);

  /** 标记单个教程章节完成；持久化由状态同步 effect 统一处理。 */
  const completeTutorialChapter = useCallback((chapterId: string) => {
    setCompletedTutorialIds((currentChapterIds) => {
      if (currentChapterIds.includes(chapterId)) return currentChapterIds;

      return [...currentChapterIds, chapterId];
    });
  }, []);

  /** 切换 API 收藏状态，便于学习者沉淀常用入口。 */
  const toggleFavoriteApi = useCallback((apiId: string) => {
    setFavoriteApiIds((currentApiIds) => (
      currentApiIds.includes(apiId)
        ? currentApiIds.filter((currentApiId) => currentApiId !== apiId)
        : [...currentApiIds, apiId]
    ));
  }, []);

  /** 切换代码片段收藏状态，便于学习者保留可复用示例。 */
  const toggleFavoriteSnippet = useCallback((apiId: string) => {
    setFavoriteSnippetIds((currentApiIds) => (
      currentApiIds.includes(apiId)
        ? currentApiIds.filter((currentApiId) => currentApiId !== apiId)
        : [...currentApiIds, apiId]
    ));
  }, []);

  /** 更新单个 API 的演示参数；运行按钮会读取最新值重新创建 Animation。 */
  const updateParameterValue = useCallback((apiId: string, parameterId: string, value: DemoParameterValue) => {
    setDemoParameterValuesByApiId((currentValues) => ({
      ...currentValues,
      [apiId]: {
        ...currentValues[apiId],
        [parameterId]: value,
      },
    }));
  }, []);

  /** 重置指定 API 的舞台目标，避免切换示例时误命中其它画布元素。 */
  const resetStageForApi = contextSafe((apiId: string) => {
    const q = gsap.utils.selector(rootRef);
    const target = (selector: string) => q(`${selector}[data-target-api="${apiId}"]`);
    const currentStage = q(`[data-stage-api="${apiId}"]`);

    activeAnimationRef.current?.kill();
    splitRef.current?.revert();
    splitRef.current = null;
    gsap.defaults({ duration: 0.55, ease: "power2.out" });
    gsap.killTweensOf(target(".stage-animated"));
    gsap.set(target(".core-box"), {
      x: 0,
      y: 0,
      scale: 1,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      rotationY: 0,
      skewX: 0,
      skewY: 0,
      autoAlpha: 1,
      width: "",
      height: "",
      borderRadius: "",
      filter: "",
      transformOrigin: "50% 50%",
      clearProps: "backgroundColor,willChange",
    });
    gsap.set(target(".pulse-dot"), { x: 0, y: 0, scale: 1, autoAlpha: 1, backgroundColor: "", clearProps: "backgroundColor" });
    gsap.set(target(".physics-ball"), { x: 0, y: 0, rotation: 0, autoAlpha: 1 });
    gsap.set(target(".physics-prop"), { x: 0, rotation: 0 });
    gsap.set(target(".svg-orbit"), { rotation: 0 });
    gsap.set(target("#draw-route"), { drawSVG: "0% 100%" });
    gsap.set(target("#morph-live"), { morphSVG: "#morph-start" });
    gsap.set(target(".motion-dot"), { x: 0, y: 0, rotation: 0 });
    gsap.set(target(".split-demo-title"), { y: 0, color: "", clearProps: "color,transform" });
    gsap.set(target(".scramble-status"), { clearProps: "all" });
    gsap.set(currentStage, { "--stage-hue": 92, "--stage-glow": 0.18 } as gsap.TweenVars);
    setProgress(0);
    setStageStatus(t("app.stage.reset"));
  });

  /** 重置当前选中的舞台，供控制面板按钮调用。 */
  const resetStage = contextSafe(() => {
    resetStageForApi(selectedApiId);
  });

  /** 根据当前 API 运行独立演示，并保存返回 Animation 供播放控件控制。 */
  const runDemo = contextSafe((demoId: DemoTab["id"] = activeDemo, apiId?: string) => {
    if (activePage !== "demo") {
      flushSync(() => navigate(pagePathById.demo));
    }

    const q = gsap.utils.selector(rootRef);
    const requestedApi = apiId ? findApiItem(apiId) : undefined;
    const demoApi = requestedApi
      ?? (selectedApi && getDemoIdForApi(selectedApi, demoId) === demoId ? selectedApi : undefined)
      ?? findApiItem(fallbackApiIdByDemo[demoId]);
    const demoApiName = demoApi ? localizeApi(demoApi, locale).name : demoId;
    const activeApiId = demoApi?.id ?? fallbackApiIdByDemo[demoId];
    const params = mergeDemoParameterValues(demoApi, demoParameterValuesByApiId[activeApiId]);
    const paramX = numberParam(params, "x", 220);
    const paramY = numberParam(params, "y", 42);
    const paramRotation = numberParam(params, "rotation", 180);
    const paramScale = numberParam(params, "scale", 1.12);
    const paramDuration = numberParam(params, "duration", 0.55);
    const paramStagger = numberParam(params, "stagger", 0.035);
    const paramVelocity = numberParam(params, "velocity", 250);
    const paramAngle = numberParam(params, "angle", 70);
    const paramGravity = numberParam(params, "gravity", 460);
    const paramDrawEnd = numberParam(params, "drawEnd", 100);
    const paramRaw = numberParam(params, "raw", 65);
    const paramEase = stringParam(params, "ease", "power2.out");
    const paramAutoRotate = booleanParam(params, "autoRotate", true);
    const statusPrefix = locale === "zh" ? "当前 API 示例" : "Current API demo";
    const statusText = (zh: string, en = zh) => `${statusPrefix}: ${demoApiName} · ${locale === "zh" ? zh : en}`;
    const finishText = (zh: string, en = zh) => `${demoApiName} · ${locale === "zh" ? zh : en}`;
    const makeTimeline = (startZh: string, completeZh = "演示完成", startEn?: string, completeEn = "demo complete") => {
      let tl: gsap.core.Timeline;
      tl = gsap.timeline({
        defaults: { duration: paramDuration, ease: paramEase },
        onStart: () => setStageStatus(statusText(startZh, startEn)),
        onUpdate: () => setProgress(tl.progress()),
        onComplete: () => setStageStatus(finishText(completeZh, completeEn)),
      });

      return tl;
    };
    const target = (selector: string) => q(`${selector}[data-target-api="${activeApiId}"]`);
    const dots = () => target(".pulse-dot");
    const box = () => target(".core-box");
    const route = () => target("#draw-route");
    const stage = () => q(`[data-stage-api="${activeApiId}"]`);
    const motionDot = () => target(".motion-dot");
    const ball = () => target(".physics-ball");
    const prop = () => target(".physics-prop");
    const unsupportedTutorialDemo = () => {
      const tl = makeTimeline(
        "该 API 以教程说明为主，这里用同组核心动作辅助理解",
        "已展示同组核心动作",
        "This API is documentation-first; showing the closest stage motion",
        "closest stage motion shown",
      );
      tl.to(box(), { x: paramX, y: paramY, rotation: paramRotation * 0.08 })
        .to(dots(), { scale: Math.max(0.6, paramScale * 0.75), stagger: paramStagger }, "<");
      return tl;
    };

    resetStageForApi(activeApiId);

    let animation: gsap.core.Animation | null = null;

    switch (activeApiId) {
      case "gsap-to":
        animation = makeTimeline("从当前状态补间到目标状态", "to() 目标状态已到达", "tweening from current state to target vars", "to() target reached")
          .to(box(), { x: paramX, y: paramY, rotation: `${paramRotation}_cw`, scale: paramScale, backgroundColor: "#a8ff04", ease: paramEase });
        break;
      case "gsap-from":
        animation = makeTimeline("从声明的起点回到当前布局", "from() 入场完成", "animating from declared start values", "from() entrance complete")
          .set(box(), { x: paramX, y: paramY })
          .from(box(), { x: -40, y: -24, autoAlpha: 0, scale: Math.min(paramScale, 0.9), immediateRender: false })
          .from(dots(), { y: 24, autoAlpha: 0, stagger: paramStagger, immediateRender: false }, "<");
        break;
      case "gsap-fromto":
        animation = makeTimeline("显式声明起点和终点", "fromTo() 起止值已完成", "using explicit from and to values", "fromTo() complete")
          .fromTo(box(), { x: 0, scale: 0.72, autoAlpha: 0.2 }, { x: paramX, y: paramY, scale: paramScale, autoAlpha: 1, rotation: paramRotation })
          .fromTo(route(), { drawSVG: "0% 0%" }, { drawSVG: `0% ${paramDrawEnd}%` }, "<");
        break;
      case "gsap-set":
        animation = makeTimeline("先 set() 预设舞台，再播放可见变化", "set() 初始状态已建立", "setting immediate state before visible motion", "set() state prepared")
          .set(box(), { x: paramX * 0.68, y: paramY, rotation: -10, backgroundColor: "#19bfe8" })
          .to(dots(), { scale: paramScale + 0.33, stagger: { each: paramStagger, from: "center" } })
          .to(box(), { rotation: 0, clearProps: "backgroundColor" }, "<");
        break;
      case "core-vars":
        animation = makeTimeline("duration、delay、ease、repeat 和 yoyo 同时生效", "通用 vars 已演示", "duration, delay, ease, repeat, and yoyo are active", "common vars shown")
          .to(box(), { x: paramX, y: paramY, delay: 0.12, ease: paramEase, repeat: 1, yoyo: true, overwrite: "auto" });
        break;
      case "immediate-render":
        animation = makeTimeline("第二段 from() 使用 immediateRender: false", "避免提前覆盖起始状态", "second from() uses immediateRender: false", "early render avoided")
          .from(box(), { x: -80, autoAlpha: 0 })
          .from(box(), { y: 80, rotation: 16, immediateRender: false });
        break;
      case "transform-aliases":
      case "perf-transform-opacity":
        animation = makeTimeline("使用 x/y/scale/rotationY 这类 transform 别名", "transform 示例完成", "using x/y/scale/rotationY aliases", "transform demo complete")
          .to(box(), { x: paramX, y: paramY, scale: paramScale, rotationY: paramRotation / 4, autoAlpha: 0.9 });
        break;
      case "transform-origin":
        animation = makeTimeline("先指定视觉支点，再旋转", "transformOrigin 支点已生效", "setting the pivot before rotation", "transformOrigin pivot shown")
          .set(box(), { transformOrigin: "left center" })
          .to(box(), { x: paramX, y: paramY, rotation: paramRotation });
        break;
      case "auto-alpha":
        animation = makeTimeline("autoAlpha 同时处理 opacity 与 visibility", "autoAlpha 淡入淡出完成", "autoAlpha controls opacity and visibility", "autoAlpha fade complete")
          .to(dots(), { autoAlpha: 0, stagger: 0.035 })
          .to(dots(), { autoAlpha: 1, stagger: 0.035 });
        break;
      case "css-vars":
        animation = makeTimeline("补间 CSS 自定义属性", "CSS 变量已驱动舞台色彩", "tweening CSS custom properties", "CSS variables animated")
          .to(stage(), { "--stage-hue": gsap.utils.clamp(60, 190, paramX), "--stage-glow": gsap.utils.clamp(0.16, 0.72, paramScale / 2) } as gsap.TweenVars)
          .to(box(), { x: paramX }, "<");
        break;
      case "svg-origin":
        animation = makeTimeline("SVG 节点围绕全局坐标旋转", "svgOrigin 轨道完成", "rotating around an SVG global point", "svgOrigin orbit complete")
          .to(target(".svg-orbit"), { rotation: "+=220_cw", svgOrigin: "120 72", duration: 0.9 });
        break;
      case "directional-rotation":
        animation = makeTimeline("用 _short、_cw、_ccw 控制旋转方向", "方向旋转完成", "controlling rotation direction with suffixes", "directional rotation complete")
          .to(box(), { x: 160, rotation: "-170_short" })
          .to(box(), { rotation: "+=120_cw" })
          .to(box(), { rotation: "-=80_ccw" });
        break;
      case "clear-props":
        animation = makeTimeline("动画结束后清理内联样式", "clearProps 已交还给 CSS", "clearing inline styles after motion", "clearProps handed control back to CSS")
          .to(box(), { x: 180, backgroundColor: "#f6b63d", scale: 1.12 })
          .to(box(), { x: 0, scale: 1, clearProps: "backgroundColor,transform" });
        break;
      case "targets":
      case "utils-to-array":
        animation = makeTimeline("把目标统一成数组后批量动画", "目标集合已依次更新", "normalizing targets into an array", "targets updated")
          .to(gsap.utils.toArray<HTMLElement>(dots()), { y: paramY, stagger: paramStagger });
        break;
      case "stagger":
        animation = makeTimeline("同类目标按时间错峰执行", "stagger 波浪完成", "offsetting similar targets over time", "stagger wave complete")
          .fromTo(dots(), { scale: 0.4, y: Math.abs(paramY) }, { scale: paramScale, y: -Math.abs(paramY), stagger: { each: paramStagger, from: "center" }, yoyo: true, repeat: 1 });
        break;
      case "eases":
      case "custom-ease":
        animation = makeTimeline("对比 back、elastic 与自定义 coach-snap 节奏", "缓动对比完成", "comparing back, elastic, and coach-snap easing", "easing comparison complete")
          .to(box(), { x: 100, ease: "back.out(1.7)" })
          .to(box(), { x: 210, ease: "elastic.out(1, 0.3)" })
          .to(box(), { x: 60, ease: "coach-snap" });
        break;
      case "tween-control":
      case "timeline-control":
        animation = makeTimeline("返回的 Animation 可被播放控件接管", "现在可以拖动进度或反向播放", "the returned Animation can be controlled", "use the controls to scrub or reverse")
          .to(box(), { x: paramX, y: paramY, rotation: paramRotation, repeat: 1, yoyo: true });
        break;
      case "function-values":
        animation = makeTimeline("每个目标按 index 计算不同属性值", "函数式属性值完成", "calculating vars per target index", "function-based values complete")
          .to(dots(), { x: (index) => index * Math.max(4, paramX / 28), y: (index) => (index % 2 ? -Math.abs(paramY) : Math.abs(paramY)), stagger: paramStagger });
        break;
      case "relative-values":
        animation = makeTimeline("基于当前值叠加位移和旋转", "相对值累计完成", "adding motion relative to current values", "relative values complete")
          .to(box(), { x: `+=${Math.round(paramX * 0.45)}`, rotation: `+=${Math.round(paramRotation * 0.45)}_cw` })
          .to(box(), { x: `+=${Math.round(paramX * 0.35)}`, rotation: `-=${Math.round(paramRotation * 0.3)}_ccw` });
        break;
      case "gsap-defaults": {
        const previousDefaults = gsap.defaults();
        gsap.defaults({ duration: 0.42, ease: "back.out(1.7)" });
        animation = makeTimeline("临时设置全局默认 duration/ease", "已恢复项目默认动画节奏", "temporarily changing global duration/ease", "project defaults restored")
          .to(box(), { x: 190, rotation: 12 })
          .to(dots(), { scale: 1.25, stagger: 0.025 })
          .eventCallback("onComplete", () => {
            gsap.defaults(previousDefaults);
            setStageStatus(finishText("已恢复项目默认动画节奏", "project defaults restored"));
          });
        break;
      }
      case "match-media":
        animation = makeTimeline("根据视口宽度选择不同位移", "matchMedia 条件演示完成", "choosing motion by viewport width", "matchMedia condition shown")
          .to(box(), { x: window.matchMedia("(min-width: 1000px)").matches ? 250 : 120, duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.7 });
        break;
      case "match-media-refresh":
        gsap.matchMediaRefresh();
        animation = makeTimeline("触发 matchMediaRefresh 后重新播放提示动作", "matchMediaRefresh 已调用", "calling matchMediaRefresh before a visible cue", "matchMediaRefresh called")
          .to(box(), { x: 150, rotation: 8 });
        break;
      case "timeline-create":
        animation = makeTimeline("创建 timeline 并顺序编排多段 tween", "timeline 播放完成", "creating a timeline for multiple tweens", "timeline complete")
          .to(box(), { x: paramX * 0.55 })
          .to(box(), { y: paramY, scale: paramScale })
          .to(box(), { rotation: paramRotation });
        break;
      case "timeline-chain":
        animation = makeTimeline("链式追加 to/from/fromTo", "链式时间线完成", "chaining to/from/fromTo calls", "timeline chain complete")
          .to(box(), { x: paramX * 0.65 }, 0)
          .to(dots(), { y: -Math.abs(paramY), stagger: paramStagger }, "<")
          .fromTo(motionDot(), { x: 0 }, { x: paramX }, "+=0.1");
        break;
      case "position-parameter":
        animation = makeTimeline("用 < 和 += 表达并行与错开", "position parameter 完成", "using < and += for timing relationships", "position parameter complete")
          .to(box(), { x: paramX }, 0)
          .to(dots(), { scale: paramScale, stagger: paramStagger }, "<0.12")
          .to(box(), { y: paramY }, "+=0.2");
        break;
      case "timeline-labels": {
        const tl = makeTimeline("用 label 标记片段并跳转播放", "label 片段播放完成", "using labels to mark and play segments", "label segment complete");
        tl.addLabel("intro", 0)
          .to(box(), { x: paramX * 0.36 }, "intro")
          .addLabel("focus", ">")
          .to(box(), { x: paramX, scale: paramScale }, "focus")
          .addLabel("outro", "+=0.1")
          .to(dots(), { y: -Math.abs(paramY), stagger: paramStagger }, "outro");
        animation = tl;
        break;
      }
      case "timeline-nesting": {
        const child = gsap.timeline({ defaults: { duration: paramDuration * 0.55, ease: paramEase } })
          .to(box(), { x: paramX * 0.4, y: -Math.abs(paramY) * 0.35 })
          .to(dots(), { y: (index) => (index % 2 ? -Math.abs(paramY) : Math.abs(paramY)), stagger: paramStagger }, "<");
        animation = makeTimeline("把 child timeline 加入 master", "嵌套 timeline 完成", "adding a child timeline into a master", "nested timeline complete")
          .add(child, 0)
          .to(box(), { x: paramX, y: paramY, scale: paramScale }, ">");
        break;
      }
      case "register-scrolltrigger":
      case "scroll-trigger-config":
        animation = makeTimeline("用舞台轨道模拟 start/end/scrub 区间", "ScrollTrigger config 概念完成", "simulating start/end/scrub ranges on the stage", "ScrollTrigger config shown")
          .fromTo(route(), { drawSVG: "0% 0%" }, { drawSVG: `0% ${paramDrawEnd}%`, ease: "none" })
          .to(box(), { x: paramX, ease: "none" }, "<");
        break;
      case "scroll-callbacks":
      case "scroll-create":
        animation = makeTimeline("触发点跨越时更新状态和元素", "回调型 ScrollTrigger 完成", "updating status when trigger points are crossed", "callback-style trigger shown")
          .to(box(), { x: paramX * 0.52, onStart: () => setStageStatus(statusText("onEnter: 进入触发区", "onEnter: entered trigger zone")) })
          .to(box(), { x: paramX, onStart: () => setStageStatus(statusText("onUpdate: 进度更新中", "onUpdate: progress is updating")) });
        break;
      case "scroll-batch":
      case "perf-batch":
        animation = makeTimeline("多个元素合批入场并 stagger", "batch / stagger 完成", "batching multiple entrances with stagger", "batch / stagger complete")
          .fromTo(dots(), { y: Math.abs(paramY), autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: { each: paramStagger, from: "start" } });
        break;
      case "container-animation":
        animation = makeTimeline("横向轨道作为嵌套触发器的参考", "containerAnimation 概念完成", "using a horizontal track as the reference animation", "containerAnimation shown")
          .to(motionDot(), { motionPath: { path: "#motion-path", align: "#motion-path", alignOrigin: [0.5, 0.5] }, ease: "none", duration: paramDuration })
          .to(box(), { y: paramY, ease: "none" }, "<0.2");
        break;
      case "scroll-refresh-kill":
        ScrollTrigger.refresh();
        animation = makeTimeline("布局刷新后可按 id 或列表清理触发器", "refresh / kill 辅助动作完成", "refreshing layout and demonstrating cleanup intent", "refresh / kill cue complete")
          .to(route(), { drawSVG: "30% 70%" })
          .to(route(), { drawSVG: `0% ${paramDrawEnd}%` });
        break;
      case "register-plugin":
        animation = makeTimeline("插件能力已在应用入口注册", "registerPlugin 示例完成", "plugin features are registered at app setup", "registerPlugin cue complete")
          .to(target(".split-demo-title"), { y: -6, color: "#6fb936" })
          .to(box(), { x: paramX }, "<");
        break;
      case "scroll-to":
        animation = makeTimeline("ScrollToPlugin 适合平滑滚动到目标", "ScrollToPlugin 概念完成", "ScrollToPlugin moves smoothly to a target", "ScrollToPlugin cue complete")
          .to(motionDot(), { x: paramX, ease: paramEase })
          .to(box(), { x: paramX * 0.65, y: paramY }, "<");
        break;
      case "flip": {
        const flipTarget = box();
        const state = Flip.getState(flipTarget);
        gsap.set(flipTarget, { x: paramX, y: paramY, scale: paramScale });
        animation = Flip.from(state, {
          duration: paramDuration,
          ease: paramEase,
          onStart: () => setStageStatus(statusText("先记录旧布局，再从旧状态过渡到新状态", "capturing old layout before animating to the new state")),
          onUpdate: () => setProgress(animation?.progress() ?? 0),
          onComplete: () => setStageStatus(finishText("Flip.from() 完成", "Flip.from() complete")),
        });
        break;
      }
      case "draggable":
        animation = makeTimeline("拖动舞台方块可看到 Draggable callbacks", "请直接拖动 drag 方块继续体验", "drag the stage card to see Draggable callbacks", "drag the card to continue")
          .to(box(), { x: paramX, y: paramY, scale: paramScale });
        break;
      case "inertia":
        animation = makeTimeline("释放后按速度和边界继续运动", "惯性运动完成", "continuing motion with velocity after release", "inertia motion complete")
          .to(box(), { inertia: { x: { velocity: paramVelocity, end: paramX }, y: { velocity: paramVelocity * 0.25, end: paramY } }, duration: paramDuration });
        break;
      case "observer":
        animation = makeTimeline("Observer 统一感知滚轮、触摸和指针方向", "可在舞台上滚动或滑动继续体验", "Observer normalizes wheel, touch, and pointer direction", "try wheel or swipe on the stage")
          .to(box(), { x: paramX, y: paramY, rotation: paramRotation * 0.1 })
          .to(dots(), { y: (index) => (index % 2 ? -Math.abs(paramY) : Math.abs(paramY)), stagger: paramStagger }, "<");
        break;
      case "split-text": {
        const headline = target(".split-demo-title")[0];
        if (headline) splitRef.current = SplitText.create(headline, { type: "words, chars", aria: "auto", mask: "words" });
        animation = makeTimeline("把标题拆成字符后逐个入场", "SplitText 字符动画完成", "splitting the heading into animated chars", "SplitText chars complete")
          .from(splitRef.current?.chars ?? [], { y: 26, autoAlpha: 0, stagger: 0.018, ease: "back.out(1.7)" });
        break;
      }
      case "scramble-text":
        animation = gsap.to(target(".scramble-status"), {
          duration: paramDuration,
          scrambleText: { text: t("app.stage.scramble"), chars: "GSAP01", revealDelay: 0.15 },
          onStart: () => setStageStatus(statusText("状态文本正在乱序揭示", "status text is being scrambled and revealed")),
          onUpdate: () => setProgress(animation?.progress() ?? 0),
          onComplete: () => setStageStatus(finishText("ScrambleText 完成", "ScrambleText complete")),
        });
        break;
      case "draw-svg":
        animation = makeTimeline("绘制 SVG stroke 的可见线段", "DrawSVG 路径绘制完成", "drawing the visible segment of an SVG stroke", "DrawSVG path complete")
          .fromTo(route(), { drawSVG: "0% 0%" }, { drawSVG: `0% ${paramDrawEnd}%` });
        break;
      case "morph-svg":
        animation = makeTimeline("把一个 path 平滑变形成另一个 shape", "MorphSVG 变形完成", "morphing one path into another shape", "MorphSVG complete")
          .to(target("#morph-live"), { morphSVG: { shape: "#morph-target", type: "rotational", shapeIndex: 1 } });
        break;
      case "motion-path":
        animation = makeTimeline("元素沿 SVG 路径移动并自动对齐", "MotionPath 路径完成", "moving along an SVG path with alignment", "MotionPath complete")
          .to(motionDot(), { motionPath: { path: "#motion-path", align: "#motion-path", alignOrigin: [0.5, 0.5], autoRotate: paramAutoRotate }, duration: paramDuration, ease: paramEase });
        break;
      case "motion-path-helper":
        animation = makeTimeline("生产环境不加载 helper，这里只展示路径目标", "MotionPathHelper 教程提示完成", "helper is dev-only; showing the path target instead", "MotionPathHelper cue complete")
          .to(motionDot(), { motionPath: { path: "#motion-path", align: "#motion-path", alignOrigin: [0.5, 0.5], autoRotate: paramAutoRotate }, duration: paramDuration });
        break;
      case "custom-wiggle":
        animation = makeTimeline("使用自定义 wiggle ease 做提示反馈", "CustomWiggle 完成", "using a custom wiggle ease for feedback", "CustomWiggle complete")
          .to(box(), { rotation: paramRotation, ease: "coach-wiggle" });
        break;
      case "custom-bounce":
        animation = makeTimeline("使用自定义 bounce ease 做落地反馈", "CustomBounce 完成", "using a custom bounce ease for landing feedback", "CustomBounce complete")
          .to(ball(), { y: -Math.abs(paramY), duration: paramDuration * 0.45 })
          .to(ball(), { y: 0, ease: "coach-bounce", duration: paramDuration });
        break;
      case "physics-2d":
        animation = makeTimeline("速度、角度和重力驱动 2D 运动", "Physics2D 抛物线完成", "velocity, angle, and gravity drive 2D motion", "Physics2D arc complete")
          .to(ball(), { physics2D: { velocity: paramVelocity, angle: paramAngle, gravity: paramGravity }, ease: "none", duration: paramDuration });
        break;
      case "physics-props":
        animation = makeTimeline("物理参数也可以驱动任意属性", "PhysicsProps 完成", "physics values can drive arbitrary properties", "PhysicsProps complete")
          .to(prop(), { physicsProps: { x: { velocity: paramVelocity, end: paramX }, rotation: { velocity: paramRotation, acceleration: -60 } }, duration: paramDuration } as gsap.TweenVars);
        break;
      case "utils-clamp":
      case "utils-map-range":
      case "utils-normalize":
      case "utils-interpolate":
      case "utils-random":
      case "utils-snap":
      case "utils-shuffle":
      case "utils-distribute":
      case "utils-get-unit":
      case "utils-unitize":
      case "utils-split-color":
      case "utils-selector":
      case "utils-pipe":
      case "utils-wrap":
      case "utils-wrap-yoyo":
      case "quick-to":
      case "perf-will-change": {
        const snapshot = createUtilitySnapshot(activeApiId === "utils-random" ? undefined : paramRaw);
        setUtilsSnapshot(snapshot);
        const targets = gsap.utils.toArray<HTMLElement>(dots());
        const distributeY = gsap.utils.distribute({ base: -8, amount: 16, from: "center", grid: "auto", ease: "power1.inOut" });
        const color = activeApiId === "utils-interpolate" || activeApiId === "utils-split-color" ? snapshot.color : undefined;
        animation = makeTimeline(
          `输入 ${snapshot.raw} 被加工为 ${snapshot.snapped}° / ${snapshot.unitized}`,
          "Utils 映射示例完成",
          `input ${snapshot.raw} became ${snapshot.snapped}deg / ${snapshot.unitized}`,
          "Utils mapping complete",
        )
          .set(box(), { willChange: activeApiId === "perf-will-change" ? "transform" : undefined })
          .to(targets, {
            y: activeApiId === "utils-distribute" ? (index, target, all) => distributeY(index, target, all) : -12,
            backgroundColor: color,
            stagger: activeApiId === "utils-shuffle" ? (index) => index * paramStagger : paramStagger,
          })
          .to(box(), {
            x: activeApiId === "utils-clamp" ? gsap.utils.clamp(0, paramX, snapshot.clamped * 2) : gsap.utils.wrap(-40, paramX, snapshot.mapped),
            rotation: `+=${activeApiId === "utils-wrap-yoyo" ? snapshot.yoyo : gsap.utils.wrap(0, paramRotation, snapshot.piped)}_cw`,
            ease: activeApiId === "quick-to" ? "power3.out" : paramEase,
          }, "<");
        break;
      }
      case "use-gsap":
        animation = makeTimeline("useGSAP 在组件作用域内创建动画", "useGSAP 作用域示例完成", "useGSAP creates scoped animation", "useGSAP scoped demo complete")
          .to(box(), { x: paramX, y: paramY, scale: paramScale })
          .to(dots(), { autoAlpha: 0.45, stagger: paramStagger }, "<");
        break;
      case "context-safe":
        animation = makeTimeline("事件回调里的 tween 也进入 GSAP context", "contextSafe 回调示例完成", "event callback tween joins GSAP context", "contextSafe callback demo complete")
          .to(box(), { x: paramX * 0.6, y: paramY, rotation: paramRotation * 0.35 })
          .to(box(), { x: paramX, rotation: paramRotation * 0.7 });
        break;
      case "gsap-context":
        animation = makeTimeline("创建 context 后统一记录选择器动画", "gsap.context 清理概念完成", "recording selector animations in a context", "gsap.context cleanup concept complete")
          .to(box(), { x: paramX, y: paramY })
          .to(dots(), { y: -Math.abs(paramY), autoAlpha: 0.55, stagger: paramStagger }, "<")
          .to(dots(), { y: 0, autoAlpha: 1, stagger: paramStagger });
        break;
      case "vue-lifecycle":
        animation = makeTimeline("onMounted 创建，onUnmounted 复原", "Vue 生命周期示例完成", "created onMounted and reverted onUnmounted", "Vue lifecycle demo complete")
          .fromTo(box(), { autoAlpha: 0, y: 36 }, { autoAlpha: 1, x: paramX, y: paramY })
          .to(dots(), { scale: paramScale, stagger: paramStagger }, "<");
        break;
      case "nuxt-lazy-plugin":
        animation = makeTimeline("客户端懒加载插件后再注册使用", "Nuxt 懒加载插件示例完成", "lazy-loading and registering a plugin on the client", "Nuxt lazy plugin demo complete")
          .to(box(), { x: paramX * 0.45, borderRadius: 24 })
          .to(target(".split-demo-title"), { y: -8, color: "#19bfe8" })
          .to(box(), { x: paramX, scale: paramScale });
        break;
      case "svelte-on-mount":
        animation = makeTimeline("onMount 返回 cleanup 函数", "Svelte 清理示例完成", "onMount returns a cleanup function", "Svelte cleanup demo complete")
          .to(box(), { x: paramX, y: paramY, rotation: paramRotation * 0.25 })
          .to(dots(), { autoAlpha: 0.35, stagger: { each: paramStagger, from: "edges" } }, "<");
        break;
      case "scroller-proxy":
        animation = makeTimeline("代理 scrollTop 后同步更新触发器", "scrollerProxy 概念完成", "proxying scrollTop and updating triggers", "scrollerProxy concept complete")
          .fromTo(route(), { drawSVG: "0% 12%" }, { drawSVG: `0% ${paramDrawEnd}%`, ease: "none" })
          .to(motionDot(), { x: paramX, ease: "none" }, "<")
          .to(box(), { y: paramY, ease: "none" }, "<");
        break;
      case "scroll-smoother":
        animation = makeTimeline("wrapper/content 把平滑滚动交给 GSAP", "ScrollSmoother 结构示例完成", "wrapper/content hand smooth scrolling to GSAP", "ScrollSmoother structure demo complete")
          .to(route(), { drawSVG: "20% 85%", ease: "none" })
          .to(motionDot(), { motionPath: { path: "#motion-path", align: "#motion-path", alignOrigin: [0.5, 0.5] }, duration: paramDuration, ease: "none" }, "<")
          .to(box(), { y: paramY, scale: paramScale }, "<0.2");
        break;
      case "morph-svg-utils":
        animation = makeTimeline("先转换 SVG 数据，再进入 morph 流程", "MorphSVG 工具转换示例完成", "converting SVG data before morphing", "MorphSVG utility conversion demo complete")
          .to(target("#morph-live"), { morphSVG: { shape: "#morph-target", type: "rotational", shapeIndex: 1 }, duration: paramDuration })
          .to(box(), { x: paramX * 0.45, autoAlpha: 0.72 }, "<");
        break;
      case "ease-pack":
        animation = makeTimeline("用 EasePack 观察不同速度曲线", "EasePack 节奏示例完成", "observing different EasePack rhythm curves", "EasePack rhythm demo complete")
          .to(box(), { x: paramX * 0.38, ease: "slow(0.7,0.7,false)" })
          .to(box(), { x: paramX * 0.72, ease: "rough({ strength: 1, points: 20 })" })
          .to(box(), { x: paramX, scale: paramScale, ease: "expoScale(1, 1.25)" });
        break;
      case "gs-devtools":
        animation = makeTimeline("开发面板可以接管整条 timeline", "GSDevTools 调试概念完成", "dev tooling can scrub the whole timeline", "GSDevTools debug concept complete")
          .to(box(), { x: paramX * 0.45, y: paramY })
          .to(dots(), { scale: paramScale, stagger: paramStagger })
          .to(box(), { x: paramX, rotation: paramRotation * 0.45 });
        break;
      case "pixi-plugin":
        animation = makeTimeline("PixiPlugin 让精灵属性像 DOM 一样可补间", "PixiPlugin 精灵参数示例完成", "PixiPlugin tweens sprite properties like DOM values", "PixiPlugin sprite parameter demo complete")
          .to(box(), { x: paramX, y: paramY, scale: paramScale, rotation: paramRotation * 0.2 })
          .to(dots(), { x: (index) => index * 5, autoAlpha: 0.65, stagger: paramStagger }, "<");
        break;
      default:
        animation = unsupportedTutorialDemo();
        break;
    }

    activeAnimationRef.current = animation;
  });

  useEffect(() => {
    if (activePage !== "demo" || !queryApi) return;

    const animationFrame = window.requestAnimationFrame(() => {
      runDemo(getDemoIdForApi(queryApi, activeDemo), queryApi.id);
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [activePage, queryApiId]);

  /** 播放、暂停、反向和重放当前保存的 Animation 实例。 */
  const controlAnimation = contextSafe((action: AnimationAction) => {
    const animation = activeAnimationRef.current;
    if (!animation) {
      setStageStatus(t("app.stage.noAnimation"));
      return;
    }

    if (action === "play") animation.play();
    if (action === "pause") animation.pause();
    if (action === "reverse") animation.progress(animation.progress() === 0 ? 1 : animation.progress()).reverse();
    if (action === "restart") animation.restart();
    setStageStatus(`Animation.${action}()`);
  });

  /** 滑杆直接控制当前 Animation 的 progress。 */
  const seekAnimation = contextSafe((value: number) => {
    activeAnimationRef.current?.progress(value).pause();
    setProgress(value);
    setStageStatus(`progress(${value.toFixed(2)})`);
  });

  /** 使用 Flip 在插件卡片的网格与列表状态之间平滑切换。 */
  const togglePluginLayout = contextSafe(() => {
    const q = gsap.utils.selector(rootRef);
    const tiles = q(".plugin-tile");
    const state = Flip.getState(tiles);
    flushSync(() => setPluginLayout((current) => (current === "grid" ? "list" : "grid")));
    Flip.from(state, {
      absolute: true,
      duration: 0.55,
      ease: "power2.inOut",
      stagger: 0.035,
      onComplete: () => setStageStatus(t("app.stage.flipComplete")),
    });
  });

  const demoControls = useMemo<DemoControls>(
    () => ({
      activeDemo,
      progress,
      observerHint,
      stageStatus,
      parameterControls,
      parameterValues,
      setActiveDemo,
      runDemo,
      resetStage,
      controlAnimation,
      seekAnimation,
      updateParameterValue,
    }),
    [activeDemo, controlAnimation, observerHint, parameterControls, parameterValues, progress, resetStage, runDemo, seekAnimation, stageStatus, updateParameterValue],
  );

  return (
    <TooltipProvider>
      <div ref={rootRef} className="min-h-svh overflow-x-hidden bg-background text-foreground">
        <SidebarProvider>
          <CoachSidebar
            activePage={activePage}
            coverageTotals={coverageTotals}
            selectedGroup={selectedGroup}
            onSkillGroupSelect={selectSkillGroup}
          />
          <SidebarInset className="min-w-0">
            <CoachHeader activePage={activePage} coverageTotals={coverageTotals} />
            <main className={cn("flex flex-1 flex-col gap-4 p-4 md:p-6", activePage === "scroll-labs" && "pb-12")}>
              <Suspense fallback={<LazyPageFallback />}>
                <Routes>
                  <Route
                    path="/"
                    element={(
                      <WorkbenchPage
                        selectedApi={selectedApi}
                        selectedChapter={selectedChapter}
                        demoControls={demoControls}
                        utilsSnapshot={utilsSnapshot}
                        onApiSelect={selectApi}
                        apiDetailRef={apiDetailRef}
                        completedLessonCount={completedTutorialIds.length}
                        totalLessonCount={tutorialChapters.length}
                        nextTutorialChapterId={nextTutorialChapterId}
                        recommendedExperimentId={recommendedExperimentId}
                        favoriteApiIds={favoriteApiIds}
                        favoriteSnippetIds={favoriteSnippetIds}
                        onFavoriteApiToggle={toggleFavoriteApi}
                        onFavoriteSnippetToggle={toggleFavoriteSnippet}
                        returnToPath={returnToPath}
                      />
                    )}
                  />
                  <Route path="/tutorials" element={<TutorialsPage completedChapterIds={completedTutorialIds} onApiSelect={selectApi} />} />
                  <Route
                    path="/tutorials/:chapterId"
                    element={(
                      <TutorialLessonPage
                        completedChapterIds={completedTutorialIds}
                        onApiSelect={selectApi}
                        onChapterComplete={completeTutorialChapter}
                      />
                    )}
                  />
                  <Route path="/coverage" element={<CoveragePage onApiSelect={selectApi} />} />
                  <Route path="/scroll-labs" element={<Navigate to="/scroll-labs/vertical" replace />} />
                  <Route path="/scroll-labs/:exampleId" element={<ScrollLabsPage onStageStatusChange={setStageStatus} />} />
                  <Route
                    path="/plugins"
                    element={<PluginsPage pluginLayout={pluginLayout} onToggleLayout={togglePluginLayout} onApiSelect={selectApi} />}
                  />
                  <Route path="/performance" element={<PerformancePage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </TooltipProvider>
  );
}
