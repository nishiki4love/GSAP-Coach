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
import { getPageIdFromPath, pagePathById } from "./components/coach/navigation";
import type { AnimationAction, CoachPageId, CoverageTotals, DemoControls, UtilitySnapshot } from "./components/coach/types";
import { WorkbenchPage } from "./components/coach/WorkbenchPage";
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
    <BrowserRouter>
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

  const activePage = useMemo<CoachPageId>(() => getPageIdFromPath(location.pathname), [location.pathname]);
  const [selectedGroup, setSelectedGroup] = useState<SkillGroupId>("core");
  const [selectedApiId, setSelectedApiId] = useState("gsap-to");
  const [activeDemo, setActiveDemo] = useState<DemoTab["id"]>("core");
  const [stageStatus, setStageStatus] = useState(() => t("app.stage.ready"));
  const [progress, setProgress] = useState(0);
  const [pluginLayout, setPluginLayout] = useState<"grid" | "list">("grid");
  const [observerHint, setObserverHint] = useState(() => t("app.observer.hint"));
  const [utilsSnapshot, setUtilsSnapshot] = useState(() => createUtilitySnapshot(65));

  const selectedApi = useMemo(() => {
    const api = findApiItem(selectedApiId) ?? getApisByGroup(selectedGroup)[0];
    return api ? localizeApi(api, locale) : undefined;
  }, [locale, selectedApiId, selectedGroup]);
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

  const { contextSafe } = useGSAP({ scope: rootRef });

  useEffect(() => {
    setStageStatus(t("app.stage.ready"));
    setObserverHint(t("app.observer.hint"));
  }, [locale, t]);

  useGSAP(
    () => {
      if (activePage !== "demo") return;

      const q = gsap.utils.selector(rootRef);
      const stage = q(".demo-stage")[0] as HTMLElement | undefined;
      const cursor = q(".cursor-follower")[0] as HTMLElement | undefined;

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

      if (!stage || !cursor) return () => mm.revert();

      let stageRect = stage.getBoundingClientRect();
      const updateStageRect = () => {
        stageRect = stage.getBoundingClientRect();
      };
      const xTo = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3.out" });
      const yTo = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3.out" });
      const handlePointerMove = (event: PointerEvent) => {
        xTo(event.clientX - stageRect.left - 9);
        yTo(event.clientY - stageRect.top - 9);
      };
      stage.addEventListener("pointerenter", updateStageRect, { passive: true });
      stage.addEventListener("pointermove", handlePointerMove, { passive: true });
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
        stage.removeEventListener("pointermove", handlePointerMove);
        stage.removeEventListener("pointerenter", updateStageRect);
        window.removeEventListener("resize", updateStageRect);
        mm.revert();
      };
    },
    { scope: rootRef, dependencies: [activePage, t], revertOnUpdate: true },
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
    navigate(pagePathById.demo);
  }, [navigate]);

  /** 选择任意 API 行后，切到演示工作台的详情面板。 */
  const selectApi = useCallback((api: ApiItem) => {
    setSelectedGroup(api.group);
    setSelectedApiId(api.id);
    navigate(pagePathById.demo);
  }, [navigate]);

  /** 重置舞台上的临时动画状态，避免多次演示互相污染。 */
  const resetStage = contextSafe(() => {
    const q = gsap.utils.selector(rootRef);
    activeAnimationRef.current?.kill();
    splitRef.current?.revert();
    splitRef.current = null;
    gsap.killTweensOf(q(".stage-animated"));
    gsap.set(q(".core-box"), {
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      rotationY: 0,
      autoAlpha: 1,
      clearProps: "backgroundColor",
    });
    gsap.set(q(".pulse-dot"), { scale: 1, autoAlpha: 1, y: 0 });
    gsap.set(q(".physics-ball"), { x: 0, y: 0, rotation: 0, autoAlpha: 1 });
    gsap.set(q(".physics-prop"), { x: 0, rotation: 0 });
    gsap.set(q(".svg-orbit"), { rotation: 0 });
    gsap.set(q("#draw-route"), { drawSVG: "0% 100%" });
    gsap.set(q("#morph-live"), { morphSVG: "#morph-start" });
    gsap.set(q(".motion-dot"), { x: 0, y: 0, rotation: 0 });
    setProgress(0);
    setStageStatus(t("app.stage.reset"));
  });

  /** 根据当前 tab 运行对应的 GSAP 演示，并保存返回 Animation 供播放控件控制。 */
  const runDemo = contextSafe((demoId: DemoTab["id"] = activeDemo) => {
    if (demoId !== "scroll" && activePage !== "demo") {
      flushSync(() => navigate(pagePathById.demo));
    }

    const q = gsap.utils.selector(rootRef);
    resetStage();

    if (demoId === "core") {
      const tl = gsap.timeline({
        defaults: { duration: 0.55, ease: "power2.out" },
        onStart: () => setStageStatus(t("app.stage.coreStart")),
        onUpdate: () => setProgress(tl.progress()),
        onComplete: () => setStageStatus(t("app.stage.coreComplete")),
      });

      tl.set(q(".core-box"), { transformOrigin: "center center" })
        .from(q(".pulse-dot"), {
          scale: 0,
          autoAlpha: 0,
          stagger: { each: 0.035, from: "center" },
          ease: "back.out(1.7)",
        })
        .fromTo(
          q(".core-box"),
          { x: 0, y: 0, scale: 0.82, rotation: 0, autoAlpha: 0 },
          {
            x: 260,
            y: 58,
            scale: 1.08,
            autoAlpha: 1,
            rotation: "360_cw",
            backgroundColor: "#a8ff04",
            overwrite: "auto",
            ease: "back.out(1.7)",
          },
          "<",
        )
        .to(q(".demo-stage"), { "--stage-hue": 148, "--stage-glow": 0.42 }, "<")
        .to(q(".svg-orbit"), { rotation: "+=190_short", svgOrigin: "120 72" }, "<0.1")
        .to(q(".core-box"), {
          x: "-=44",
          rotation: "-=45_ccw",
          repeat: 1,
          yoyo: true,
          ease: "elastic.out(1, 0.35)",
          clearProps: "backgroundColor",
        });

      activeAnimationRef.current = tl;
      return;
    }

    if (demoId === "timeline") {
      const child = gsap
        .timeline({ defaults: { duration: 0.34, ease: "power3.out" } })
        .to(q(".core-box"), { x: 92, y: -16, rotationY: 18 }, 0)
        .to(q(".pulse-dot"), { y: (index) => (index % 2 ? -18 : 18), stagger: 0.025 }, "<");

      const master = gsap.timeline({
        paused: true,
        defaults: { duration: 0.42, ease: "power2.inOut" },
        onUpdate: () => setProgress(master.progress()),
      });

      master
        .addLabel("intro", 0)
        .add(child, "intro")
        .addLabel("middle", ">")
        .to(q(".core-box"), { x: 225, y: 72, scale: 1.18 }, "middle+=0.1")
        .to(q(".pulse-dot"), { scale: gsap.utils.distribute({ base: 0.7, amount: 0.9, from: "center" }) }, "<")
        .addLabel("outro", "+=0.2")
        .to(q(".core-box"), { x: 44, y: 38, rotation: 0, scale: 1, ease: "coach-snap" }, "outro");

      const tween = master.tweenFromTo("intro", "outro", {
        onStart: () => setStageStatus(t("app.stage.timelineStart")),
        onUpdate: () => setProgress(master.progress()),
        onComplete: () => setStageStatus(t("app.stage.timelineComplete")),
      });
      activeAnimationRef.current = tween;
      return;
    }

    if (demoId === "scroll") {
      flushSync(() => navigate(pagePathById["scroll-labs"]));
      let attempts = 0;
      /** 等懒加载滚动页真正挂载后再执行 ScrollTo，避免目标 selector 还不存在。 */
      const scrollWhenReady = () => {
        if (document.querySelector(".vertical-scroll-lab")) {
          gsap.to(window, {
            duration: 0.9,
            scrollTo: { y: ".vertical-scroll-lab", offsetY: 0 },
            ease: "power2.inOut",
            onStart: () => setStageStatus(t("app.stage.scrollJump")),
          });
          return;
        }
        attempts += 1;
        if (attempts < 12) requestAnimationFrame(scrollWhenReady);
      };
      requestAnimationFrame(scrollWhenReady);
      activeAnimationRef.current = null;
      return;
    }

    if (demoId === "plugins") {
      splitRef.current?.revert();
      const headline = q(".split-demo-title")[0];
      if (headline) {
        splitRef.current = SplitText.create(headline, {
          type: "words, chars",
          aria: "auto",
          mask: "words",
        });
      }

      const tl = gsap.timeline({
        defaults: { duration: 0.65, ease: "power2.out" },
        onStart: () => setStageStatus(t("app.stage.pluginsStart")),
        onUpdate: () => setProgress(tl.progress()),
        onComplete: () => setStageStatus(t("app.stage.pluginsComplete")),
      });

      tl.from(splitRef.current?.chars ?? [], { y: 26, autoAlpha: 0, stagger: 0.018, ease: "back.out(1.7)" })
        .fromTo(q("#draw-route"), { drawSVG: "0% 0%" }, { drawSVG: "0% 100%" }, "<")
        .to(q("#morph-live"), { morphSVG: { shape: "#morph-target", type: "rotational", shapeIndex: 1 } }, "<0.12")
        .to(q(".motion-dot"), {
          motionPath: { path: "#motion-path", align: "#motion-path", alignOrigin: [0.5, 0.5], autoRotate: true },
          duration: 1.15,
          ease: "power1.inOut",
        })
        .to(q(".physics-ball"), {
          duration: 1.1,
          physics2D: { velocity: 250, angle: 70, gravity: 460 },
          ease: "none",
        }, "<")
        .to(q(".physics-prop"), {
          duration: 1.05,
          physicsProps: {
            x: { velocity: 120, end: 230 },
            rotation: { velocity: 180, acceleration: -60 },
          },
        } as gsap.TweenVars, "<")
        .to(q(".core-box"), { rotation: 12, ease: "coach-wiggle" }, "<0.1")
        .to(q(".physics-ball"), { y: 0, ease: "coach-bounce", duration: 0.6 });

      gsap.to(q(".scramble-status"), {
        duration: 0.85,
        scrambleText: { text: t("app.stage.scramble"), chars: "GSAP01", revealDelay: 0.15 },
      });

      activeAnimationRef.current = tl;
      return;
    }

    const snapshot = createUtilitySnapshot();
    setUtilsSnapshot(snapshot);
    const targets = gsap.utils.toArray<HTMLElement>(q(".utility-chip"));
    const distributeY = gsap.utils.distribute({ base: -8, amount: 16, from: "center", grid: "auto", ease: "power1.inOut" });
    const tl = gsap.timeline({
      defaults: { duration: 0.42, ease: "power2.out" },
      onStart: () => setStageStatus(t("app.stage.utilsStatus", {
        raw: snapshot.raw,
        snapped: snapshot.snapped,
        unitized: snapshot.unitized,
      })),
      onUpdate: () => setProgress(tl.progress()),
    });

    tl.to(targets, { y: (index, target, all) => distributeY(index, target, all), backgroundColor: snapshot.color })
      .to(q(".core-box"), {
        x: gsap.utils.wrap(-40, 240, snapshot.mapped),
        rotation: `+=${snapshot.piped}_cw`,
        ease: "coach-snap",
      }, "<");

    activeAnimationRef.current = tl;
  });

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
      setActiveDemo,
      runDemo,
      resetStage,
      controlAnimation,
      seekAnimation,
    }),
    [activeDemo, controlAnimation, observerHint, progress, resetStage, runDemo, seekAnimation, stageStatus],
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
                      />
                    )}
                  />
                  <Route path="/tutorials" element={<TutorialsPage onApiSelect={selectApi} />} />
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
