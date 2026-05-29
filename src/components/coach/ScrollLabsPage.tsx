import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsapSetup";
import { useRef } from "react";

interface ScrollLabsPageProps {
  onStageStatusChange: (status: string) => void;
}

const verticalSteps = [
  {
    label: "01",
    title: "触发区间",
    api: "start / end",
    copy: "用 start 和 end 定义 pin 段的滚动距离，避免多个滚动实验共用同一个触发器。",
  },
  {
    label: "02",
    title: "绑定进度",
    api: "scrub: 1",
    copy: "scrub 把滚动进度映射到 timeline 进度，适合轨道、仪表盘、过程图。",
  },
  {
    label: "03",
    title: "固定视口",
    api: "pin: true",
    copy: "pin 让实验段停在视口中，用户可以观察一条垂直流程如何逐步展开。",
  },
  {
    label: "04",
    title: "刷新布局",
    api: "refresh()",
    copy: "内容或尺寸变化后调用 ScrollTrigger.refresh()，让触发点重新计算。",
  },
];

const horizontalPanels = [
  {
    label: "A",
    title: "containerAnimation",
    api: "containerAnimation",
    copy: "横向轨道本身由垂直滚动驱动，内部元素再把这条 tween 作为触发参考。",
  },
  {
    label: "B",
    title: "横向触发点",
    api: "start: 'left 72%'",
    copy: "每张 panel 进入横向视口时独立淡入、放大和填充进度，便于演示复杂叙事卡片。",
  },
  {
    label: "C",
    title: "嵌套 scrub",
    api: "scrub: true",
    copy: "panel 内部的文案和 meter 也跟随横向位移同步，不再只是整条轨道平移。",
  },
  {
    label: "D",
    title: "进度回传",
    api: "onUpdate",
    copy: "顶层 ScrollTrigger 的 onUpdate 同步页面状态和进度条，方便调试真实滚动进度。",
  },
];

/** 滚动实验页：给 ScrollTrigger 留出独立滚动空间。 */
export function ScrollLabsPage({ onStageStatusChange }: ScrollLabsPageProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const lastVerticalPercentRef = useRef(-1);
  const lastHorizontalPercentRef = useRef(-1);

  useGSAP(
    () => {
      const q = gsap.utils.selector(rootRef);
      const verticalLab = q(".vertical-scroll-lab")[0] as HTMLElement | undefined;
      const verticalRail = q(".vertical-rail")[0] as HTMLElement | undefined;
      const verticalRunner = q(".vertical-runner")[0] as HTMLElement | undefined;
      const horizontalLab = q(".horizontal-scroll-lab")[0] as HTMLElement | undefined;
      const horizontalTrack = q(".horizontal-track")[0] as HTMLElement | undefined;

      lastVerticalPercentRef.current = -1;
      lastHorizontalPercentRef.current = -1;

      if (verticalLab && verticalRail) {
        const verticalCards = q(".vertical-step-card");
        const verticalMarkers = q(".vertical-step-marker");

        gsap.set(verticalCards, { autoAlpha: 0.58, y: 22, scale: 0.98 });
        gsap.set(verticalMarkers, { scale: 0.8 });
        gsap.set(q(".vertical-scroll-copy"), { autoAlpha: 0.55, y: 14 });

        const verticalTl = gsap.timeline({
          defaults: { duration: 1, ease: "none" },
          scrollTrigger: {
            trigger: verticalLab,
            start: "top top",
            end: "+=1500",
            scrub: 1,
            pin: true,
            pinSpacing: "margin",
            id: "vertical-track",
            refreshPriority: 1,
            onUpdate: (self) => {
              const percent = Math.round(self.progress * 100);
              if (percent !== lastVerticalPercentRef.current) {
                lastVerticalPercentRef.current = percent;
                if (verticalRunner) verticalRunner.textContent = `${percent}%`;
                onStageStatusChange(`垂直轨道 scrub: ${percent}%`);
              }
            },
          },
        });
        verticalTl
          .to(q(".vertical-scroll-copy"), { y: -6, autoAlpha: 1, duration: 0.35 }, 0)
          .to(q(".vertical-progress-fill"), { scaleY: 1, transformOrigin: "center top" }, 0)
          .to(verticalRunner ?? [], { y: () => Math.max(260, verticalRail.clientHeight - 120) }, 0)
          .to(verticalCards, { autoAlpha: 1, y: 0, scale: 1, duration: 0.72, stagger: 0.14 }, 0.08)
          .to(
            verticalMarkers,
            {
              backgroundColor: "#a8ff04",
              borderColor: "#a8ff04",
              scale: 1.35,
              duration: 0.72,
              stagger: 0.14,
            },
            0.08,
          )
          .to(verticalMarkers, { scale: 1, duration: 0.36, stagger: 0.14 }, 0.42);
      }

      if (horizontalLab && horizontalTrack) {
        const horizontalProgress = q(".horizontal-progress-fill");
        const horizontalPanels = q(".horizontal-panel") as HTMLElement[];
        const getHorizontalTravel = () => Math.max(0, horizontalTrack.scrollWidth - horizontalLab.clientWidth + 40);

        gsap.set(horizontalPanels, { autoAlpha: 0.72, scale: 0.96 });

        const scrollTween = gsap.to(horizontalTrack, {
          x: () => -getHorizontalTravel(),
          ease: "none",
          scrollTrigger: {
            trigger: horizontalLab,
            start: "top top",
            end: () => `+=${Math.max(1200, getHorizontalTravel() + 700)}`,
            scrub: true,
            pin: true,
            pinSpacing: "margin",
            id: "horizontal-container",
            refreshPriority: 2,
            onUpdate: (self) => {
              const percent = Math.round(self.progress * 100);
              gsap.set(horizontalProgress, { scaleX: self.progress, transformOrigin: "left center" });
              if (percent !== lastHorizontalPercentRef.current) {
                lastHorizontalPercentRef.current = percent;
                onStageStatusChange(`横向轨道 containerAnimation: ${percent}%`);
              }
            },
          },
        });

        horizontalPanels.forEach((panel) => {
          const copy = panel.querySelector(".horizontal-panel-copy");
          const meter = panel.querySelector(".horizontal-panel-meter");
          const dot = panel.querySelector(".horizontal-panel-dot");

          gsap.to(panel, {
            autoAlpha: 1,
            scale: 1,
            scrollTrigger: {
              containerAnimation: scrollTween,
              trigger: panel,
              start: "left 78%",
              end: "center center",
              scrub: true,
            },
          });

          gsap.fromTo(
            copy,
            { y: 30, autoAlpha: 0.45 },
            {
              y: 0,
              autoAlpha: 1,
              scrollTrigger: {
                containerAnimation: scrollTween,
                trigger: panel,
                start: "left 72%",
                end: "center center",
                scrub: true,
              },
            },
          );

          gsap.fromTo(
            meter,
            { scaleX: 0 },
            {
              scaleX: 1,
              transformOrigin: "left center",
              scrollTrigger: {
                containerAnimation: scrollTween,
                trigger: panel,
                start: "left 68%",
                end: "right 62%",
                scrub: true,
              },
            },
          );

          gsap.to(dot, {
            x: () => Math.min(280, panel.clientWidth * 0.42),
            rotation: 180,
            scrollTrigger: {
              containerAnimation: scrollTween,
              trigger: panel,
              start: "left 72%",
              end: "right 62%",
              scrub: true,
            },
          });
        });
      }

      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { scope: rootRef, dependencies: [onStageStatusChange], revertOnUpdate: true },
  );

  return (
    <div ref={rootRef} className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">ScrollTrigger 滚动实验</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          这里把垂直轨道和横向轨道拆开承载，分别演示 pin、scrub、containerAnimation、嵌套触发和刷新清理。
        </p>
      </div>

      <section className="vertical-scroll-lab min-h-[100svh] overflow-hidden rounded-xl border bg-primary p-4 text-primary-foreground md:p-8">
        <div className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-6xl flex-col justify-center gap-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <Badge variant="secondary" className="mb-3 font-mono">垂直轨道</Badge>
              <h2 className="text-3xl font-semibold">Pin + Scrub 时间轴</h2>
              <p className="vertical-scroll-copy mt-2 max-w-2xl text-sm leading-6 text-primary-foreground/70">
                一个独立的垂直流程轨道：左侧 runner 按滚动推进，右侧卡片按 timeline 节点逐步进入激活态。
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {["pin", "scrub", "refresh"].map((item) => (
                <div key={item} className="rounded-md border border-primary-foreground/20 px-3 py-2">
                  <div className="font-mono text-primary-foreground">{item}</div>
                  <div className="mt-1 text-primary-foreground/55">vertical</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(220px,0.55fr)_minmax(0,1fr)]">
            <div className="vertical-rail relative min-h-[500px] rounded-lg border border-primary-foreground/20 bg-primary-foreground/6 p-6">
              <div className="absolute bottom-10 left-1/2 top-10 w-px -translate-x-1/2 bg-primary-foreground/20" />
              <div className="vertical-progress-fill absolute bottom-10 left-1/2 top-10 w-px -translate-x-1/2 origin-top scale-y-0 bg-cyanline" />
              <div className="vertical-runner absolute left-1/2 top-10 grid size-10 -translate-x-1/2 place-items-center rounded-full bg-limebeam font-mono text-xs font-semibold text-ink shadow-sm">
                0%
              </div>
              <div className="absolute bottom-10 left-6 right-6 top-10 flex flex-col justify-between">
                {verticalSteps.map((step) => (
                  <div key={step.label} className="flex items-center justify-between gap-4">
                    <span className="font-mono text-xs text-primary-foreground/60">{step.label}</span>
                    <span className="vertical-step-marker size-3 rounded-full border border-primary-foreground/35 bg-primary" />
                    <span className="max-w-24 truncate text-right text-xs text-primary-foreground/60">{step.api}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              {verticalSteps.map((step) => (
                <Card key={step.label} className="vertical-step-card shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                      <Badge variant="outline" className="font-mono">{step.label}</Badge>
                      <span className="truncate font-mono text-xs text-muted-foreground">{step.api}</span>
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                    <CardDescription className="leading-6">{step.copy}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="horizontal-scroll-lab min-h-[100svh] overflow-hidden rounded-xl border bg-card">
        <div className="flex min-h-[100svh] flex-col">
          <div className="flex flex-col gap-4 border-b p-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Badge variant="secondary" className="mb-3 font-mono">横向轨道</Badge>
              <h2 className="text-3xl font-semibold tracking-tight">Container Animation 画廊</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                横向演示独立成段：顶层轨道负责平移，panel 内部再使用 containerAnimation 做二级触发。
              </p>
            </div>
            <div className="w-full lg:max-w-sm">
              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>horizontal progress</span>
                <span className="font-mono">ease: none</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="horizontal-progress-fill h-full origin-left scale-x-0 rounded-full bg-primary" />
              </div>
            </div>
          </div>

          <div className="horizontal-track flex w-max flex-1 items-center gap-4 px-5 py-5">
            {horizontalPanels.map((panel) => (
              <Card
                key={panel.label}
                className="horizontal-panel flex h-[68svh] w-[84vw] max-w-[760px] shrink-0 flex-col justify-between overflow-hidden"
              >
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <Badge className="horizontal-panel-index font-mono">{panel.label}</Badge>
                    <span className="truncate font-mono text-xs text-muted-foreground">{panel.api}</span>
                  </div>
                  <CardTitle className="text-3xl">{panel.title}</CardTitle>
                  <CardDescription className="horizontal-panel-copy max-w-xl leading-6">
                    {panel.copy}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-[0.65fr_1fr]">
                    <div className="rounded-lg bg-muted p-4">
                      <div className="text-xs font-medium text-muted-foreground">panel meter</div>
                      <div className="mt-8 h-2 overflow-hidden rounded-full bg-background">
                        <div className="horizontal-panel-meter h-full origin-left scale-x-0 rounded-full bg-limebeam" />
                      </div>
                    </div>
                    <div className="relative min-h-36 overflow-hidden rounded-lg border bg-background p-4">
                      <div className="absolute left-4 right-4 top-1/2 h-px bg-border" />
                      <div className="horizontal-panel-dot absolute left-4 top-1/2 size-8 -translate-y-1/2 rounded-md bg-primary" />
                      <div className="relative z-10 ml-auto max-w-44 text-right text-xs leading-5 text-muted-foreground">
                        每张卡片都有自己的 trigger、start、end 和 scrub，方便观察横向滚动中的二级动画。
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>垂直轨道清理规则</CardTitle>
            <CardDescription>
              页面切换时，GSAP context 会 revert 本页创建的 pin、scrub 和 batch 监听。
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-muted-foreground">
            垂直段使用 `.vertical-scroll-lab`、`.vertical-rail`、`.vertical-step-card`，动画逻辑和页面结构保持分离。
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>横向轨道清理规则</CardTitle>
            <CardDescription>
              横向段使用单独的 `.horizontal-scroll-lab` 和 `.horizontal-track`，避免和垂直 pin 段抢触发范围。
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm leading-6 text-muted-foreground">
            横向内部触发器统一引用顶层 scrollTween 作为 containerAnimation，布局变化后再调用 ScrollTrigger.refresh()。
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
