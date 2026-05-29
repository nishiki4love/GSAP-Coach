export type SkillGroupId =
  | "core"
  | "timeline"
  | "scroll"
  | "plugins"
  | "utils"
  | "react"
  | "performance";

export type CoverageMode = "互动演示" | "教程覆盖" | "开发专用";

export interface SkillGroup {
  id: SkillGroupId;
  title: string;
  source: string;
  summary: string;
}

export interface ApiItem {
  id: string;
  group: SkillGroupId;
  mode: CoverageMode;
  name: string;
  signature: string;
  summary: string;
  usage: string;
  snippet: string;
}

export interface TutorialChapter {
  id: string;
  title: string;
  group: SkillGroupId;
  intro: string;
  apiIds: string[];
  steps: string[];
}

export interface DemoTab {
  id: "core" | "timeline" | "scroll" | "plugins" | "utils";
  label: string;
  summary: string;
  apiIds: string[];
}

/** GSAP skills 的来源分组，用于侧边导航和覆盖矩阵。 */
export const skillGroups: SkillGroup[] = [
  {
    id: "core",
    title: "Core Tween",
    source: "gsap-core",
    summary: "基础 tween、CSSPlugin、响应式和可访问性动画。",
  },
  {
    id: "timeline",
    title: "Timeline",
    source: "gsap-timeline",
    summary: "多段动画编排、标签、嵌套 timeline 和播放控制。",
  },
  {
    id: "scroll",
    title: "ScrollTrigger",
    source: "gsap-scrolltrigger",
    summary: "滚动触发、scrub、pin、batch、横向滚动和清理刷新。",
  },
  {
    id: "plugins",
    title: "Plugins",
    source: "gsap-plugins",
    summary: "ScrollTo、Flip、Draggable、SplitText、SVG、物理和开发插件。",
  },
  {
    id: "utils",
    title: "Utils",
    source: "gsap-utils",
    summary: "数值映射、随机、吸附、集合选择、单位和函数管线。",
  },
  {
    id: "react",
    title: "React / Frameworks",
    source: "gsap-react + gsap-frameworks",
    summary: "React、Vue、Nuxt、Svelte 中的生命周期、作用域和清理模式。",
  },
  {
    id: "performance",
    title: "Performance",
    source: "gsap-performance",
    summary: "transform/opacity、will-change、quickTo 和滚动性能策略。",
  },
];

/** 覆盖所有本地 gsap-skills 中出现的 API 和关键配置项。 */
export const apiItems: ApiItem[] = [
  {
    id: "gsap-to",
    group: "core",
    mode: "互动演示",
    name: "gsap.to()",
    signature: "gsap.to(targets, vars)",
    summary: "从当前状态补间到 vars 中声明的目标状态。",
    usage: "最常用的动画入口；适合移动、缩放、淡入淡出、颜色变化和 CSS 变量变化。",
    snippet: `gsap.to(".box", { x: 160, rotation: "360_cw", duration: 0.8, ease: "power3.out" });`,
  },
  {
    id: "gsap-from",
    group: "core",
    mode: "互动演示",
    name: "gsap.from()",
    signature: "gsap.from(targets, vars)",
    summary: "从 vars 中声明的起点动画到元素当前状态。",
    usage: "适合入场动画；如果连续 from 同一个属性，后续 tween 常需要 immediateRender: false。",
    snippet: `gsap.from(".item", { y: 24, autoAlpha: 0, stagger: 0.08, immediateRender: false });`,
  },
  {
    id: "gsap-fromto",
    group: "core",
    mode: "互动演示",
    name: "gsap.fromTo()",
    signature: "gsap.fromTo(targets, fromVars, toVars)",
    summary: "显式声明起点和终点，不依赖读取当前样式。",
    usage: "适合需要确定起止值的训练演示、SVG 绘制或避免初始状态不确定的场景。",
    snippet: `gsap.fromTo(".box", { x: 0, scale: 0.8 }, { x: 220, scale: 1.1, duration: 1 });`,
  },
  {
    id: "gsap-set",
    group: "core",
    mode: "互动演示",
    name: "gsap.set()",
    signature: "gsap.set(targets, vars)",
    summary: "立即设置属性，相当于 duration 为 0。",
    usage: "用于重置舞台、预设初始状态，或在 timeline 开始前统一设值。",
    snippet: `gsap.set(".box", { x: 0, y: 0, rotation: 0, clearProps: "visibility" });`,
  },
  {
    id: "core-vars",
    group: "core",
    mode: "互动演示",
    name: "通用 vars",
    signature: "duration, delay, ease, stagger, overwrite, repeat, yoyo, callbacks",
    summary: "控制持续时间、延迟、缓动、错峰、覆盖策略、重复和生命周期回调。",
    usage: "把重复的默认值放进 gsap.defaults() 或 timeline defaults，避免到处复制。",
    snippet: `gsap.to(".box", {
  duration: 0.8,
  delay: 0.1,
  ease: "back.out(1.7)",
  repeat: 1,
  yoyo: true,
  overwrite: "auto",
  onUpdate: () => console.log("updating")
});`,
  },
  {
    id: "immediate-render",
    group: "core",
    mode: "教程覆盖",
    name: "immediateRender",
    signature: "immediateRender: false",
    summary: "控制 from/fromTo 是否在创建时立即应用起始状态。",
    usage: "多个 from/fromTo 命中同一目标同一属性时，后续动画通常设置为 false。",
    snippet: `tl.from(".box", { x: -80 }).from(".box", { y: 80, immediateRender: false });`,
  },
  {
    id: "transform-aliases",
    group: "core",
    mode: "互动演示",
    name: "transform aliases",
    signature: "x, y, z, xPercent, yPercent, scale, scaleX, scaleY, rotation, rotationX, rotationY, skewX, skewY",
    summary: "GSAP 推荐的 transform 属性别名，顺序稳定且性能更好。",
    usage: "移动用 x/y，百分比位移用 xPercent/yPercent，旋转用 rotation/rotationX/rotationY。",
    snippet: `gsap.to(".card", { xPercent: 20, y: -12, scale: 1.08, rotationY: 12 });`,
  },
  {
    id: "transform-origin",
    group: "core",
    mode: "互动演示",
    name: "transformOrigin",
    signature: "transformOrigin: 'left top'",
    summary: "指定 transform 的视觉支点。",
    usage: "用于翻页、仪表盘指针、图标旋转等需要固定中心点的动画。",
    snippet: `gsap.to(".needle", { rotation: 65, transformOrigin: "left center" });`,
  },
  {
    id: "auto-alpha",
    group: "core",
    mode: "互动演示",
    name: "autoAlpha",
    signature: "autoAlpha: 0 | 1",
    summary: "同时控制 opacity 与 visibility。",
    usage: "元素透明到 0 时不再挡住点击，比单独 opacity 更适合交互界面。",
    snippet: `gsap.to(".toast", { autoAlpha: 0, duration: 0.35 });`,
  },
  {
    id: "css-vars",
    group: "core",
    mode: "互动演示",
    name: "CSS variables",
    signature: "{ '--hue': 160, '--size': 96 }",
    summary: "GSAP 可以补间 CSS 自定义属性。",
    usage: "适合主题色、阴影强度、图表参数等可被 CSS 消费的值。",
    snippet: `gsap.to(".stage", { "--hue": 148, "--glow": 0.4, duration: 0.8 });`,
  },
  {
    id: "svg-origin",
    group: "core",
    mode: "互动演示",
    name: "svgOrigin",
    signature: "svgOrigin: '100 100'",
    summary: "让 SVG 元素围绕全局 SVG 坐标旋转或缩放。",
    usage: "多个 SVG 节点需要围绕同一个点运动时，用 svgOrigin 而不是 transformOrigin。",
    snippet: `gsap.to("#orbit", { rotation: 180, svgOrigin: "120 80", duration: 1 });`,
  },
  {
    id: "directional-rotation",
    group: "core",
    mode: "互动演示",
    name: "directional rotation",
    signature: "rotation: '-170_short' | '+=90_cw' | '-=45_ccw'",
    summary: "用后缀控制旋转方向或最短路径。",
    usage: "仪表盘、时钟、拨盘类动画常用，避免绕远路。",
    snippet: `gsap.to(".dial", { rotation: "-170_short", duration: 0.7 });`,
  },
  {
    id: "clear-props",
    group: "core",
    mode: "互动演示",
    name: "clearProps",
    signature: "clearProps: 'all' | 'x,opacity'",
    summary: "动画完成后移除内联样式，让 CSS 类重新接管。",
    usage: "在一次性入场动画结束后清理内联 transform/opacity，减少后续样式冲突。",
    snippet: `gsap.to(".panel", { y: 0, autoAlpha: 1, clearProps: "transform,visibility" });`,
  },
  {
    id: "targets",
    group: "core",
    mode: "教程覆盖",
    name: "targets",
    signature: "selector | Element | Element[] | NodeList",
    summary: "GSAP 接受选择器、单个节点、数组或 NodeList。",
    usage: "组件中建议用 scope 限定选择器，避免命中其它组件实例。",
    snippet: `const items = gsap.utils.toArray(".item", container);
gsap.to(items, { y: -8, stagger: 0.05 });`,
  },
  {
    id: "stagger",
    group: "core",
    mode: "互动演示",
    name: "stagger",
    signature: "stagger: 0.1 | { each, amount, from }",
    summary: "让同类目标按时间错峰执行。",
    usage: "列表、字符、卡片、点阵入场优先使用 stagger，不要手写一堆 delay。",
    snippet: `gsap.from(".dot", { scale: 0, stagger: { each: 0.04, from: "center" } });`,
  },
  {
    id: "eases",
    group: "core",
    mode: "互动演示",
    name: "built-in eases",
    signature: "power1.out, power3.inOut, back.out(1.7), elastic.out(1, 0.3), none",
    summary: "GSAP 内置缓动字符串。",
    usage: "普通 UI 常用 power/back；滚动绑定和 containerAnimation 必须用 ease: 'none'。",
    snippet: `gsap.to(".chip", { y: -24, ease: "elastic.out(1, 0.3)" });`,
  },
  {
    id: "tween-control",
    group: "core",
    mode: "互动演示",
    name: "Tween 控制",
    signature: "pause(), play(), reverse(), kill(), progress(), time(), totalTime()",
    summary: "Tween 返回实例，可保存后控制播放。",
    usage: "播放控件、训练面板、hover 中断和路由卸载都需要保存实例。",
    snippet: `const tween = gsap.to(".box", { x: 120, paused: true });
tween.play();
tween.progress(0.5);
tween.reverse();`,
  },
  {
    id: "function-values",
    group: "core",
    mode: "互动演示",
    name: "function-based values",
    signature: "x: (index, target, targets) => number",
    summary: "属性值可以是函数，首次渲染时对每个目标求值。",
    usage: "适合按索引生成位移、颜色、延迟或动态数据。",
    snippet: `gsap.to(".bar", { x: (i) => i * 28, stagger: 0.04 });`,
  },
  {
    id: "relative-values",
    group: "core",
    mode: "互动演示",
    name: "relative values",
    signature: "'+=20', '-=30', '*=2', '/=2'",
    summary: "基于当前值做相对变化。",
    usage: "按钮点击、小游戏、拨杆类互动中常用于叠加移动或旋转。",
    snippet: `gsap.to(".knob", { rotation: "+=45_cw", x: "+=12" });`,
  },
  {
    id: "gsap-defaults",
    group: "core",
    mode: "互动演示",
    name: "gsap.defaults()",
    signature: "gsap.defaults({ duration, ease })",
    summary: "设置全局 Tween 默认值。",
    usage: "项目级默认动画节奏可放在入口；组件局部默认值更适合放 timeline defaults。",
    snippet: `gsap.defaults({ duration: 0.6, ease: "power2.out" });`,
  },
  {
    id: "match-media",
    group: "core",
    mode: "互动演示",
    name: "gsap.matchMedia()",
    signature: "mm.add(queryOrConditions, callback, scope?)",
    summary: "按媒体查询创建动画，并在不匹配时自动 revert。",
    usage: "用于桌面/移动差异和 prefers-reduced-motion 可访问性处理。",
    snippet: `const mm = gsap.matchMedia();
mm.add({ isDesktop: "(min-width: 900px)", reduceMotion: "(prefers-reduced-motion: reduce)" }, (ctx) => {
  gsap.to(".box", { x: ctx.conditions?.isDesktop ? 180 : 80, duration: ctx.conditions?.reduceMotion ? 0 : 0.7 });
});
mm.revert();`,
  },
  {
    id: "match-media-refresh",
    group: "core",
    mode: "教程覆盖",
    name: "gsap.matchMediaRefresh()",
    signature: "gsap.matchMediaRefresh()",
    summary: "强制重新运行匹配的 matchMedia handler。",
    usage: "当用户切换自定义 reduced-motion 控制或布局条件时使用。",
    snippet: `gsap.matchMediaRefresh();`,
  },
  {
    id: "timeline-create",
    group: "timeline",
    mode: "互动演示",
    name: "gsap.timeline()",
    signature: "gsap.timeline({ defaults, paused, repeat, yoyo, callbacks })",
    summary: "创建可编排多个 tween 的时间线。",
    usage: "多步骤动画不要靠 delay 串起来，用 timeline 明确顺序和并行动画。",
    snippet: `const tl = gsap.timeline({ defaults: { duration: 0.45, ease: "power2.out" } });`,
  },
  {
    id: "timeline-chain",
    group: "timeline",
    mode: "互动演示",
    name: "tl.to()/from()/fromTo()",
    signature: "tl.to(targets, vars, position?)",
    summary: "在同一个时间线中追加 tween。",
    usage: "第三个参数是 position parameter，可控制绝对时间、相对时间、标签和并行开始。",
    snippet: `tl.to(".a", { x: 120 }, 0).to(".b", { y: 40 }, "<").from(".c", { autoAlpha: 0 }, "+=0.2");`,
  },
  {
    id: "position-parameter",
    group: "timeline",
    mode: "互动演示",
    name: "position parameter",
    signature: "0, '+=0.5', '-=0.2', '<', '>', '<0.2', 'label+=0.3'",
    summary: "控制 tween 在时间线中的开始时间。",
    usage: "复杂编排里用标签和 < / > 关系，比 delay 更好维护。",
    snippet: `tl.addLabel("intro", 0).to(".a", { x: 80 }, "intro").to(".b", { scale: 1.2 }, "<0.15");`,
  },
  {
    id: "timeline-labels",
    group: "timeline",
    mode: "互动演示",
    name: "addLabel() / play(label) / tweenFromTo()",
    signature: "tl.addLabel(name, position); tl.play(name); tl.tweenFromTo(from, to)",
    summary: "用语义标签组织和跳转时间线。",
    usage: "教程演示、产品流程和状态机动画里很适合用标签切段。",
    snippet: `tl.addLabel("intro", 0).addLabel("outro", "+=0.4");
tl.play("outro");
tl.tweenFromTo("intro", "outro");`,
  },
  {
    id: "timeline-nesting",
    group: "timeline",
    mode: "互动演示",
    name: "嵌套 timeline",
    signature: "master.add(child, position)",
    summary: "timeline 可以包含另一个 timeline。",
    usage: "把局部动画封装成小 timeline，再挂到主 timeline 中。",
    snippet: `const child = gsap.timeline().to(".a", { x: 80 }).to(".b", { y: 30 });
const master = gsap.timeline().add(child, 0).to(".c", { autoAlpha: 0 }, "+=0.2");`,
  },
  {
    id: "timeline-control",
    group: "timeline",
    mode: "互动演示",
    name: "Timeline 控制",
    signature: "play(), pause(), reverse(), restart(), time(), progress(), kill()",
    summary: "timeline 与 tween 一样可控制播放头。",
    usage: "交互式教程面板、滚动中断和重放按钮都依赖这些方法。",
    snippet: `tl.pause();
tl.time(1.2);
tl.progress(0.5);
tl.reverse();
tl.kill();`,
  },
  {
    id: "register-scrolltrigger",
    group: "scroll",
    mode: "互动演示",
    name: "gsap.registerPlugin(ScrollTrigger)",
    signature: "gsap.registerPlugin(ScrollTrigger)",
    summary: "ScrollTrigger 使用前必须注册。",
    usage: "插件注册放在模块顶层或应用入口，避免每次渲染重复注册。",
    snippet: `import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);`,
  },
  {
    id: "scroll-trigger-config",
    group: "scroll",
    mode: "互动演示",
    name: "scrollTrigger config",
    signature: "trigger, start, end, endTrigger, scrub, toggleActions, pin, pinSpacing, horizontal, scroller, markers, once, id, refreshPriority, toggleClass, snap, containerAnimation",
    summary: "ScrollTrigger 的核心配置对象。",
    usage: "scrub 负责滚动绑定；toggleActions 负责离散进出场；同一个 trigger 不要混用两种意图。",
    snippet: `gsap.to(".box", {
  x: 320,
  scrollTrigger: {
    trigger: ".box",
    start: "top 70%",
    end: "bottom 30%",
    scrub: 1,
    id: "box-scrub"
  }
});`,
  },
  {
    id: "scroll-callbacks",
    group: "scroll",
    mode: "互动演示",
    name: "ScrollTrigger callbacks",
    signature: "onEnter, onLeave, onEnterBack, onLeaveBack, onUpdate, onToggle, onRefresh, onScrubComplete",
    summary: "在触发点跨越、刷新或滚动更新时运行逻辑。",
    usage: "用于同步进度条、状态文字、导航高亮和性能调试。",
    snippet: `ScrollTrigger.create({
  trigger: ".panel",
  onUpdate: (self) => console.log(self.progress, self.direction, self.getVelocity())
});`,
  },
  {
    id: "scroll-create",
    group: "scroll",
    mode: "互动演示",
    name: "ScrollTrigger.create()",
    signature: "ScrollTrigger.create(config)",
    summary: "创建不绑定 tween 的滚动监听。",
    usage: "适合只想更新状态、切换 class 或触发自定义逻辑。",
    snippet: `ScrollTrigger.create({ trigger: ".section", start: "top center", toggleClass: "is-active" });`,
  },
  {
    id: "scroll-batch",
    group: "scroll",
    mode: "互动演示",
    name: "ScrollTrigger.batch()",
    signature: "ScrollTrigger.batch(triggers, vars)",
    summary: "为多个元素创建触发器，并把相近时间的回调合批。",
    usage: "长列表入场动画可用 batch 代替手写 IntersectionObserver。",
    snippet: `ScrollTrigger.batch(".row", {
  interval: 0.1,
  batchMax: 4,
  onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, stagger: 0.08 })
});`,
  },
  {
    id: "scroller-proxy",
    group: "scroll",
    mode: "教程覆盖",
    name: "ScrollTrigger.scrollerProxy()",
    signature: "ScrollTrigger.scrollerProxy(scroller, { scrollTop, scrollLeft, getBoundingClientRect, fixedMarkers, pinType })",
    summary: "把第三方 smooth scroll 的读写接口交给 ScrollTrigger。",
    usage: "自定义滚动库更新时必须调用 ScrollTrigger.update，否则位置会失准。",
    snippet: `ScrollTrigger.scrollerProxy(document.body, {
  scrollTop(value) {
    if (arguments.length) smooth.scrollTop = value;
    return smooth.scrollTop;
  },
  getBoundingClientRect: () => ({ top: 0, left: 0, width: innerWidth, height: innerHeight })
});
smooth.addListener(ScrollTrigger.update);`,
  },
  {
    id: "container-animation",
    group: "scroll",
    mode: "互动演示",
    name: "containerAnimation",
    signature: "scrollTrigger: { containerAnimation: scrollTween }",
    summary: "让垂直滚动驱动的横向移动成为其它 trigger 的参考容器。",
    usage: "横向滚动 tween 必须 ease: 'none'；containerAnimation 不支持 pin 和 snap。",
    snippet: `const scrollTween = gsap.to(".track", { xPercent: -200, ease: "none", scrollTrigger: { trigger: ".rail", pin: true, scrub: 1 } });
gsap.to(".nested", { y: -40, scrollTrigger: { containerAnimation: scrollTween, trigger: ".nested", start: "left center" } });`,
  },
  {
    id: "scroll-refresh-kill",
    group: "scroll",
    mode: "互动演示",
    name: "refresh / getAll / getById / kill",
    signature: "ScrollTrigger.refresh(); ScrollTrigger.getAll(); ScrollTrigger.getById(id)?.kill()",
    summary: "布局变化后刷新，页面卸载或元素删除时清理。",
    usage: "SPA 路由切换和动态内容加载后尤其重要；React 中 useGSAP 会自动 revert 作用域内实例。",
    snippet: `ScrollTrigger.refresh();
ScrollTrigger.getById("hero")?.kill();
ScrollTrigger.getAll().forEach((trigger) => trigger.kill());`,
  },
  {
    id: "register-plugin",
    group: "plugins",
    mode: "互动演示",
    name: "gsap.registerPlugin()",
    signature: "gsap.registerPlugin(ScrollToPlugin, Flip, Draggable)",
    summary: "注册所有需要使用的插件。",
    usage: "插件注册必须早于首次使用；React 中不要放到会反复执行的 render 里。",
    snippet: `gsap.registerPlugin(ScrollToPlugin, Flip, Draggable);`,
  },
  {
    id: "scroll-to",
    group: "plugins",
    mode: "互动演示",
    name: "ScrollToPlugin",
    signature: "scrollTo: { x, y, element, offsetX, offsetY }",
    summary: "平滑滚动到窗口或容器中的位置/元素。",
    usage: "目录跳转、返回顶部、横向容器滚动都适合用 ScrollToPlugin。",
    snippet: `gsap.to(window, { duration: 0.8, scrollTo: { y: "#coverage", offsetY: 80 } });`,
  },
  {
    id: "scroll-smoother",
    group: "plugins",
    mode: "教程覆盖",
    name: "ScrollSmoother",
    signature: "ScrollSmoother.create({ wrapper, content, smooth })",
    summary: "GSAP 内置的平滑滚动方案，依赖 ScrollTrigger 和固定 DOM 结构。",
    usage: "需要 smooth wrapper 与 smooth content；固定定位元素通常放在 wrapper 外。",
    snippet: `<div id="smooth-wrapper"><div id="smooth-content">...</div></div>`,
  },
  {
    id: "flip",
    group: "plugins",
    mode: "互动演示",
    name: "Flip.getState() / Flip.from()",
    signature: "const state = Flip.getState(targets); Flip.from(state, vars)",
    summary: "记录布局变化前状态，再从旧状态动画到新布局。",
    usage: "适合列表重排、网格/列表切换、展开收起和跨容器移动。",
    snippet: `const state = Flip.getState(".tile");
setLayout("list");
requestAnimationFrame(() => Flip.from(state, { duration: 0.55, absolute: true, ease: "power2.inOut" }));`,
  },
  {
    id: "draggable",
    group: "plugins",
    mode: "互动演示",
    name: "Draggable.create()",
    signature: "Draggable.create(targets, { type, bounds, inertia, edgeResistance, callbacks })",
    summary: "让元素支持鼠标/触摸拖拽、旋转或滚动拖动。",
    usage: "inertia: true 需要同时注册 InertiaPlugin。",
    snippet: `Draggable.create(".drag-card", { type: "x,y", bounds: ".stage", inertia: true, edgeResistance: 0.75 });`,
  },
  {
    id: "inertia",
    group: "plugins",
    mode: "互动演示",
    name: "InertiaPlugin",
    signature: "InertiaPlugin.track(target, property); gsap.to(target, { inertia: { x: 'auto' } })",
    summary: "让拖拽或数值变化释放后带有动量。",
    usage: "常与 Draggable 配合，也可追踪任意对象属性的速度。",
    snippet: `InertiaPlugin.track(".box", "x");
gsap.to(".box", { inertia: { x: "auto" } });`,
  },
  {
    id: "observer",
    group: "plugins",
    mode: "互动演示",
    name: "Observer.create()",
    signature: "Observer.create({ target, type, tolerance, onUp, onDown, onLeft, onRight })",
    summary: "统一监听滚轮、触摸和指针方向。",
    usage: "适合自定义手势、卡片切换和方向感知，不等同于滚动进度绑定。",
    snippet: `Observer.create({ target: ".stage", type: "wheel,touch,pointer", tolerance: 10, onRight: () => next() });`,
  },
  {
    id: "split-text",
    group: "plugins",
    mode: "互动演示",
    name: "SplitText.create()",
    signature: "SplitText.create(target, { type, charsClass, wordsClass, linesClass, aria, autoSplit, onSplit, mask, tag, deepSlice, ignore, smartWrap, wordDelimiter, prepareText, propIndex, reduceWhiteSpace, onRevert })",
    summary: "把文本拆成字符、词或行，并提供 chars/words/lines/masks。",
    usage: "只拆需要动画的粒度；响应式断行用 autoSplit + onSplit，并返回动画便于自动清理。",
    snippet: `SplitText.create(".headline", {
  type: "words, chars",
  aria: "auto",
  onSplit(self) {
    return gsap.from(self.chars, { y: 24, autoAlpha: 0, stagger: 0.02 });
  }
});`,
  },
  {
    id: "scramble-text",
    group: "plugins",
    mode: "互动演示",
    name: "ScrambleTextPlugin",
    signature: "scrambleText: { text, chars, revealDelay }",
    summary: "用字符乱序效果切换文本。",
    usage: "适合状态提示、终端风格消息和科技感标题。",
    snippet: `gsap.to(".status", { duration: 0.8, scrambleText: { text: "动画已就绪", chars: "01", revealDelay: 0.2 } });`,
  },
  {
    id: "draw-svg",
    group: "plugins",
    mode: "互动演示",
    name: "DrawSVGPlugin",
    signature: "drawSVG: '0% 100%'; DrawSVGPlugin.getLength(); DrawSVGPlugin.getPosition()",
    summary: "通过 stroke-dasharray/stroke-dashoffset 绘制或隐藏 SVG 线条。",
    usage: "目标必须有可见 stroke；drawSVG 描述当前可见的线段范围。",
    snippet: `gsap.fromTo("#route", { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 1 });`,
  },
  {
    id: "morph-svg",
    group: "plugins",
    mode: "互动演示",
    name: "MorphSVGPlugin",
    signature: "morphSVG: { shape, type, map, shapeIndex, smooth, curveMode, origin, precision, precompile, render, updateTarget }",
    summary: "把一个 SVG path/polyline/polygon 平滑变形为另一个形状。",
    usage: "需要时先 convertToPath；复杂形状可用 shapeIndex 或 precompile 调整。",
    snippet: `MorphSVGPlugin.convertToPath("circle, rect");
gsap.to("#shape", { morphSVG: { shape: "#target", type: "rotational", shapeIndex: 2 }, duration: 0.8 });`,
  },
  {
    id: "morph-svg-utils",
    group: "plugins",
    mode: "教程覆盖",
    name: "MorphSVG utilities",
    signature: "convertToPath(), rawPathToString(), stringToRawPath(), defaultUpdateTarget, findShapeIndex()",
    summary: "MorphSVG 的路径转换、rawPath 转换和形状索引辅助能力。",
    usage: "当形状扭曲、反转或需要 canvas 渲染时使用这些工具。",
    snippet: `const raw = MorphSVGPlugin.stringToRawPath(pathData);
const path = MorphSVGPlugin.rawPathToString(raw);`,
  },
  {
    id: "motion-path",
    group: "plugins",
    mode: "互动演示",
    name: "MotionPathPlugin",
    signature: "motionPath: { path, align, alignOrigin, autoRotate, curviness }",
    summary: "让元素沿 SVG 路径移动。",
    usage: "小球路径、地图路线、产品轨迹和引导线动效常用。",
    snippet: `gsap.to(".dot", { motionPath: { path: "#path", align: "#path", alignOrigin: [0.5, 0.5], autoRotate: true }, duration: 2 });`,
  },
  {
    id: "motion-path-helper",
    group: "plugins",
    mode: "开发专用",
    name: "MotionPathHelper.create()",
    signature: "MotionPathHelper.create(target, path, vars)",
    summary: "开发时可视化调整 MotionPath 对齐和进度。",
    usage: "只用于调试，不建议打进生产包。",
    snippet: `const helper = MotionPathHelper.create(".dot", "#path", { end: 0.5 });
helper.getProgress();`,
  },
  {
    id: "custom-ease",
    group: "plugins",
    mode: "互动演示",
    name: "CustomEase.create()",
    signature: "CustomEase.create(name, curve)",
    summary: "创建自定义 cubic-bezier 或 SVG path 缓动曲线。",
    usage: "只有内置 ease 不够表达品牌动效时再使用。",
    snippet: `const ease = CustomEase.create("snap-hop", "M0,0 C0.17,0.67 0.38,1.26 1,1");
gsap.to(".box", { x: 140, ease });`,
  },
  {
    id: "ease-pack",
    group: "plugins",
    mode: "教程覆盖",
    name: "EasePack",
    signature: "SlowMo, RoughEase, ExpoScaleEase",
    summary: "额外的命名缓动集合。",
    usage: "SlowMo 适合慢进慢出展示，RoughEase 适合抖动噪声，ExpoScaleEase 适合缩放速度优化。",
    snippet: `gsap.to(".box", { x: 120, ease: "slow(0.7,0.7,false)" });`,
  },
  {
    id: "custom-wiggle",
    group: "plugins",
    mode: "互动演示",
    name: "CustomWiggle",
    signature: "CustomWiggle.create(name, vars)",
    summary: "生成 wiggle / shake 类缓动。",
    usage: "用于提示错误、吸引注意或模拟震动，不要过度使用。",
    snippet: `CustomWiggle.create("soft-wiggle", { wiggles: 6, type: "easeOut" });
gsap.to(".badge", { rotation: 10, ease: "soft-wiggle" });`,
  },
  {
    id: "custom-bounce",
    group: "plugins",
    mode: "互动演示",
    name: "CustomBounce",
    signature: "CustomBounce.create(name, vars)",
    summary: "创建可调参数的弹跳缓动。",
    usage: "适合落地、弹入或奖励反馈，比固定 bounce ease 更可控。",
    snippet: `CustomBounce.create("soft-bounce", { strength: 0.5 });
gsap.to(".ball", { y: 90, ease: "soft-bounce" });`,
  },
  {
    id: "physics-2d",
    group: "plugins",
    mode: "互动演示",
    name: "Physics2DPlugin",
    signature: "physics2D: { velocity, angle, gravity }",
    summary: "用速度、角度、重力驱动 2D 运动。",
    usage: "适合粒子、抛物线、礼花和小型物理反馈。",
    snippet: `gsap.to(".ball", { duration: 2, physics2D: { velocity: 250, angle: 80, gravity: 500 } });`,
  },
  {
    id: "physics-props",
    group: "plugins",
    mode: "互动演示",
    name: "PhysicsPropsPlugin",
    signature: "physicsProps: { x: { velocity, end }, y: { velocity, acceleration } }",
    summary: "把物理参数应用到任意属性。",
    usage: "当不只是 x/y 需要物理感时使用，例如数字、旋转或自定义对象属性。",
    snippet: `gsap.to(".obj", {
  duration: 2,
  physicsProps: { x: { velocity: 100, end: 300 }, y: { velocity: -50, acceleration: 200 } }
});`,
  },
  {
    id: "gs-devtools",
    group: "plugins",
    mode: "开发专用",
    name: "GSDevTools.create()",
    signature: "GSDevTools.create({ animation: tl })",
    summary: "开发时用 UI 调试 timeline。",
    usage: "不要打进生产包；本网站只提供教程示例，不在运行时代码中注册。",
    snippet: `GSDevTools.create({ animation: tl });`,
  },
  {
    id: "pixi-plugin",
    group: "plugins",
    mode: "教程覆盖",
    name: "PixiPlugin",
    signature: "gsap.to(sprite, { pixi: { x, y, scale } })",
    summary: "让 GSAP 驱动 PixiJS display object。",
    usage: "需要 PixiJS 运行时；本教程给出用法，不强行引入额外图形引擎。",
    snippet: `gsap.to(sprite, { pixi: { x: 200, y: 100, scale: 1.5 }, duration: 1 });`,
  },
  {
    id: "utils-clamp",
    group: "utils",
    mode: "互动演示",
    name: "gsap.utils.clamp()",
    signature: "clamp(min, max, value?)",
    summary: "把数值限制在最小值和最大值之间。",
    usage: "省略 value 会返回可复用函数。",
    snippet: `const clampProgress = gsap.utils.clamp(0, 1);
clampProgress(1.4);`,
  },
  {
    id: "utils-map-range",
    group: "utils",
    mode: "互动演示",
    name: "gsap.utils.mapRange()",
    signature: "mapRange(inMin, inMax, outMin, outMax, value?)",
    summary: "把一个范围里的值映射到另一个范围。",
    usage: "常把滚动进度、鼠标位置或输入值映射为像素、角度、颜色参数。",
    snippet: `const toDegrees = gsap.utils.mapRange(0, 1, 0, 360);
toDegrees(0.5);`,
  },
  {
    id: "utils-normalize",
    group: "utils",
    mode: "互动演示",
    name: "gsap.utils.normalize()",
    signature: "normalize(min, max, value?)",
    summary: "把范围值归一化到 0 到 1。",
    usage: "是 mapRange 的常见前置步骤。",
    snippet: `const progress = gsap.utils.normalize(100, 300, 180);`,
  },
  {
    id: "utils-interpolate",
    group: "utils",
    mode: "互动演示",
    name: "gsap.utils.interpolate()",
    signature: "interpolate(start, end, progress?)",
    summary: "按进度插值数字、颜色或同构对象。",
    usage: "适合根据进度生成中间值或动态主题色。",
    snippet: `const color = gsap.utils.interpolate("#f6b63d", "#19bfe8", 0.5);`,
  },
  {
    id: "utils-random",
    group: "utils",
    mode: "互动演示",
    name: "gsap.utils.random()",
    signature: "random(min, max, snapIncrement?, true?) | random(array, true?)",
    summary: "返回随机数或数组随机项；传 true 得到可复用函数。",
    usage: "字符串形式 random(...) 可直接写在 tween vars 中。",
    snippet: `const randomX = gsap.utils.random(-120, 120, 10, true);
gsap.to(".box", { x: randomX });`,
  },
  {
    id: "utils-snap",
    group: "utils",
    mode: "互动演示",
    name: "gsap.utils.snap()",
    signature: "snap(snapTo, value?)",
    summary: "把数值吸附到最近步长或最近数组项。",
    usage: "拖拽网格、分段进度、音量刻度和卡片吸附常用。",
    snippet: `const snapToGrid = gsap.utils.snap(20);
snapToGrid(37);`,
  },
  {
    id: "utils-shuffle",
    group: "utils",
    mode: "互动演示",
    name: "gsap.utils.shuffle()",
    signature: "shuffle(array)",
    summary: "返回打乱顺序后的数组。",
    usage: "用于随机显示顺序或生成不重复的 stagger 序列。",
    snippet: `const order = gsap.utils.shuffle(["Core", "Timeline", "ScrollTrigger"]);`,
  },
  {
    id: "utils-distribute",
    group: "utils",
    mode: "互动演示",
    name: "gsap.utils.distribute()",
    signature: "distribute({ base, amount, each, from, grid, axis, ease })",
    summary: "按索引或网格位置分配属性值。",
    usage: "高级 stagger、点阵、仪表盘刻度和网格变形常用。",
    snippet: `gsap.to(".dot", {
  scale: gsap.utils.distribute({ base: 0.7, amount: 0.8, from: "center", grid: "auto" })
});`,
  },
  {
    id: "utils-get-unit",
    group: "utils",
    mode: "互动演示",
    name: "gsap.utils.getUnit()",
    signature: "getUnit(value)",
    summary: "读取字符串中的单位。",
    usage: "做单位转换或保留 CSS 单位时使用。",
    snippet: `gsap.utils.getUnit("42px"); // "px"`,
  },
  {
    id: "utils-unitize",
    group: "utils",
    mode: "互动演示",
    name: "gsap.utils.unitize()",
    signature: "unitize(value, unit)",
    summary: "给无单位数值附加单位。",
    usage: "把计算结果转成 px、deg、% 等 CSS 值。",
    snippet: `gsap.utils.unitize(24, "px");`,
  },
  {
    id: "utils-split-color",
    group: "utils",
    mode: "互动演示",
    name: "gsap.utils.splitColor()",
    signature: "splitColor(color, returnHSL?)",
    summary: "把颜色字符串拆成 RGB/RGBA 或 HSL/HSLA 数组。",
    usage: "适合自己拼渐变、颜色通道动画或分析主题色。",
    snippet: `gsap.utils.splitColor("#6fb936", true);`,
  },
  {
    id: "utils-selector",
    group: "utils",
    mode: "互动演示",
    name: "gsap.utils.selector()",
    signature: "selector(scope)",
    summary: "生成只在 scope 内查找的选择器函数。",
    usage: "组件里避免全局选择器串场，React ref/Vue root 都适用。",
    snippet: `const q = gsap.utils.selector(container);
gsap.to(q(".box"), { x: 100 });`,
  },
  {
    id: "utils-to-array",
    group: "utils",
    mode: "互动演示",
    name: "gsap.utils.toArray()",
    signature: "toArray(value, scope?)",
    summary: "把选择器、NodeList、单节点或数组统一转成数组。",
    usage: "需要手动遍历目标或接入 distribute 时非常实用。",
    snippet: `const cards = gsap.utils.toArray<HTMLElement>(".card", container);`,
  },
  {
    id: "utils-pipe",
    group: "utils",
    mode: "互动演示",
    name: "gsap.utils.pipe()",
    signature: "pipe(...functions)(value)",
    summary: "把多个函数串成一条处理管线。",
    usage: "常用于 normalize → mapRange → snap 的输入转换。",
    snippet: `const convert = gsap.utils.pipe(gsap.utils.normalize(0, 100), gsap.utils.mapRange(0, 1, 0, 360), gsap.utils.snap(15));`,
  },
  {
    id: "utils-wrap",
    group: "utils",
    mode: "互动演示",
    name: "gsap.utils.wrap()",
    signature: "wrap(min, max, value?)",
    summary: "把值循环包裹到指定范围。",
    usage: "无限轮播、循环角度、颜色索引常用。",
    snippet: `const angle = gsap.utils.wrap(0, 360, 370);`,
  },
  {
    id: "utils-wrap-yoyo",
    group: "utils",
    mode: "互动演示",
    name: "gsap.utils.wrapYoyo()",
    signature: "wrapYoyo(min, max, value?)",
    summary: "在范围边界反弹式循环。",
    usage: "适合来回摆动、呼吸值或 ping-pong 进度。",
    snippet: `const pingPong = gsap.utils.wrapYoyo(0, 100, 150);`,
  },
  {
    id: "use-gsap",
    group: "react",
    mode: "互动演示",
    name: "useGSAP()",
    signature: "useGSAP(callback, { scope, dependencies, revertOnUpdate })",
    summary: "React 中推荐的 GSAP 生命周期 Hook。",
    usage: "自动处理 cleanup，并用 scope 限制选择器。",
    snippet: `const container = useRef(null);
useGSAP(() => {
  gsap.from(".item", { autoAlpha: 0, stagger: 0.08 });
}, { scope: container });`,
  },
  {
    id: "context-safe",
    group: "react",
    mode: "互动演示",
    name: "contextSafe()",
    signature: "const { contextSafe } = useGSAP({ scope })",
    summary: "把事件回调中创建的 GSAP 对象纳入上下文清理。",
    usage: "点击、指针、异步回调里创建动画时使用，避免卸载后继续操作节点。",
    snippet: `const onClick = contextSafe(() => gsap.to(".box", { rotation: "+=90" }));`,
  },
  {
    id: "gsap-context",
    group: "react",
    mode: "教程覆盖",
    name: "gsap.context() / ctx.revert()",
    signature: "const ctx = gsap.context(callback, scope); ctx.revert()",
    summary: "手动创建可清理的动画上下文。",
    usage: "没有 @gsap/react 时，在 useEffect cleanup 中调用 ctx.revert()。",
    snippet: `useEffect(() => {
  const ctx = gsap.context(() => gsap.to(".box", { x: 100 }), containerRef);
  return () => ctx.revert();
}, []);`,
  },
  {
    id: "vue-lifecycle",
    group: "react",
    mode: "教程覆盖",
    name: "Vue onMounted / onUnmounted",
    signature: "onMounted(() => ctx = gsap.context(...)); onUnmounted(() => ctx?.revert())",
    summary: "Vue 组件中在 DOM 挂载后创建动画，并在卸载时 revert。",
    usage: "selector 必须用组件根节点做 scope。",
    snippet: `onMounted(() => {
  ctx = gsap.context(() => gsap.from(".item", { autoAlpha: 0 }), container.value);
});
onUnmounted(() => ctx?.revert());`,
  },
  {
    id: "nuxt-lazy-plugin",
    group: "react",
    mode: "教程覆盖",
    name: "Nuxt lazyLoadPlugin()",
    signature: "const plugin = await lazyLoadPlugin('SplitText')",
    summary: "Nuxt 中用 composable 统一注册和按需加载 GSAP 插件。",
    usage: "减少首包体积，并保持插件类型提示和注册顺序清晰。",
    snippet: `const { gsap, lazyLoadPlugin } = useGSAP();
const SplitText = await lazyLoadPlugin("SplitText");`,
  },
  {
    id: "svelte-on-mount",
    group: "react",
    mode: "教程覆盖",
    name: "Svelte onMount cleanup",
    signature: "onMount(() => { const ctx = gsap.context(...); return () => ctx.revert(); })",
    summary: "Svelte 中 onMount 返回 cleanup 函数。",
    usage: "同样要通过 bind:this 拿到组件根节点做 scope。",
    snippet: `onMount(() => {
  const ctx = gsap.context(() => gsap.to(".box", { x: 100 }), container);
  return () => ctx.revert();
});`,
  },
  {
    id: "perf-transform-opacity",
    group: "performance",
    mode: "互动演示",
    name: "transform / opacity 优先",
    signature: "x, y, scale, rotation, opacity",
    summary: "优先动画 transform 和 opacity，避免 layout-heavy 属性。",
    usage: "不要用 left/top/width/height 实现移动或缩放，除非确实需要布局重排。",
    snippet: `gsap.to(".card", { x: 120, scale: 1.05, autoAlpha: 1 });`,
  },
  {
    id: "perf-will-change",
    group: "performance",
    mode: "互动演示",
    name: "will-change",
    signature: "will-change: transform;",
    summary: "提示浏览器为即将动画的元素做合成层准备。",
    usage: "只给真正会动的元素加，不要全站滥用。",
    snippet: `.animated-card { will-change: transform; }`,
  },
  {
    id: "perf-batch",
    group: "performance",
    mode: "互动演示",
    name: "批量读写 / stagger / virtualization",
    signature: "先读后写；长列表分批或虚拟化",
    summary: "减少布局抖动和同时动画数量。",
    usage: "相同动画使用 stagger；超长列表只动画可见项。",
    snippet: `const widths = cards.map((card) => card.offsetWidth);
gsap.to(cards, { x: (i) => widths[i] * 0.1, stagger: 0.03 });`,
  },
  {
    id: "quick-to",
    group: "performance",
    mode: "互动演示",
    name: "gsap.quickTo()",
    signature: "gsap.quickTo(target, property, vars)",
    summary: "复用同一个 tween 更新高频属性。",
    usage: "鼠标跟随、拖动预览、实时输入映射时比反复 gsap.to 更轻。",
    snippet: `const xTo = gsap.quickTo(".cursor", "x", { duration: 0.35, ease: "power3" });
window.addEventListener("pointermove", (event) => xTo(event.clientX));`,
  },
];

export const demoTabs: DemoTab[] = [
  {
    id: "core",
    label: "Tween 基础",
    summary: "to/from/fromTo/set、变换别名、CSS 变量、stagger 和播放控制。",
    apiIds: ["gsap-to", "gsap-from", "gsap-fromto", "gsap-set", "transform-aliases", "stagger", "tween-control"],
  },
  {
    id: "timeline",
    label: "Timeline 编排",
    summary: "标签、position parameter、嵌套 timeline 和播放头控制。",
    apiIds: ["timeline-create", "timeline-chain", "position-parameter", "timeline-labels", "timeline-nesting", "timeline-control"],
  },
  {
    id: "scroll",
    label: "ScrollTrigger",
    summary: "scrub、pin、batch、containerAnimation、refresh 和 kill。",
    apiIds: ["scroll-trigger-config", "scroll-create", "scroll-batch", "container-animation", "scroll-refresh-kill"],
  },
  {
    id: "plugins",
    label: "插件实验室",
    summary: "Flip、Draggable、Observer、SplitText、SVG、物理和 ScrollTo。",
    apiIds: ["flip", "draggable", "observer", "split-text", "scramble-text", "draw-svg", "morph-svg", "motion-path", "physics-2d"],
  },
  {
    id: "utils",
    label: "Utils 映射器",
    summary: "clamp、mapRange、normalize、interpolate、random、snap、pipe、wrap。",
    apiIds: ["utils-clamp", "utils-map-range", "utils-normalize", "utils-interpolate", "utils-random", "utils-snap", "utils-pipe", "utils-wrap-yoyo"],
  },
];

export const tutorialChapters: TutorialChapter[] = [
  {
    id: "mental-model",
    title: "1. 先建立 GSAP 心智模型",
    group: "core",
    intro: "GSAP 的核心是：目标 targets + 变量 vars + 可控制的 Animation 实例。",
    apiIds: ["gsap-to", "gsap-from", "gsap-fromto", "gsap-set", "core-vars", "tween-control"],
    steps: [
      "先用 gsap.set() 设置可复现的初始状态。",
      "用 gsap.to()/from()/fromTo() 表达单个状态变化。",
      "保存返回的 Tween，用 play、pause、reverse、progress 等方法连接按钮和滑杆。",
      "默认使用 transform 别名与 autoAlpha，减少布局和交互副作用。",
    ],
  },
  {
    id: "sequence",
    title: "2. 多步骤动画用 Timeline",
    group: "timeline",
    intro: "Timeline 是动画编排器，不要用一串 delay 硬拼复杂顺序。",
    apiIds: ["timeline-create", "timeline-chain", "position-parameter", "timeline-labels", "timeline-nesting", "timeline-control"],
    steps: [
      "把共用 duration/ease 放进 timeline defaults。",
      "用 position parameter 表达同步、错开、标签跳转。",
      "把局部动画封成 child timeline，再 master.add(child)。",
      "调试时用 time/progress/tweenFromTo 精确检查某一段。",
    ],
  },
  {
    id: "scroll-flow",
    title: "3. 滚动动画只放在顶层 Tween/Timeline",
    group: "scroll",
    intro: "ScrollTrigger 负责把滚动区间映射到动画或回调。",
    apiIds: ["register-scrolltrigger", "scroll-trigger-config", "scroll-callbacks", "scroll-create", "scroll-batch", "container-animation", "scroll-refresh-kill"],
    steps: [
      "注册 ScrollTrigger 后，在顶层 tween/timeline 上声明 scrollTrigger。",
      "scrub 用于进度绑定，toggleActions 用于进出场播放，不要混用意图。",
      "动态内容、字体或图片改变布局后调用 ScrollTrigger.refresh()。",
      "SPA 路由卸载时 kill 或依赖 useGSAP/gsap.context 自动 revert。",
    ],
  },
  {
    id: "plugin-lab",
    title: "4. 插件按用途注册，不把开发工具带进生产",
    group: "plugins",
    intro: "本地 gsap-plugins skill 覆盖了滚动、布局、拖拽、文本、SVG、物理和调试插件。",
    apiIds: ["register-plugin", "scroll-to", "flip", "draggable", "inertia", "observer", "split-text", "scramble-text", "draw-svg", "morph-svg", "motion-path", "custom-ease", "custom-wiggle", "custom-bounce", "physics-2d", "physics-props", "gs-devtools", "pixi-plugin"],
    steps: [
      "使用前先 gsap.registerPlugin()，注册代码放在模块顶层。",
      "Flip 先 getState，再改 DOM，最后 Flip.from(state)。",
      "SplitText 拆分后要 revert，或让 useGSAP/context 自动清理。",
      "GSDevTools、MotionPathHelper 属于开发辅助，本演示仅展示教程代码。",
    ],
  },
  {
    id: "utils-pipeline",
    title: "5. Utils 把输入变成动画参数",
    group: "utils",
    intro: "gsap.utils 是纯函数工具箱，很适合把滚动、鼠标和数据映射成动画值。",
    apiIds: ["utils-clamp", "utils-map-range", "utils-normalize", "utils-interpolate", "utils-random", "utils-snap", "utils-shuffle", "utils-distribute", "utils-get-unit", "utils-unitize", "utils-split-color", "utils-selector", "utils-to-array", "utils-pipe", "utils-wrap", "utils-wrap-yoyo"],
    steps: [
      "需要重复使用同一映射时，省略最后 value 参数得到函数。",
      "random 的函数形式要显式传 true。",
      "单位处理用 getUnit/unitize，mapRange/normalize 只处理数字。",
      "组件内用 selector(scope) 和 toArray(value, scope) 限定目标。",
    ],
  },
  {
    id: "framework-cleanup",
    title: "6. 框架里最重要的是作用域与清理",
    group: "react",
    intro: "React 推荐 useGSAP；Vue/Svelte/Nuxt 也遵循 mounted 创建、unmount revert 的原则。",
    apiIds: ["use-gsap", "context-safe", "gsap-context", "vue-lifecycle", "nuxt-lazy-plugin", "svelte-on-mount"],
    steps: [
      "React 中给 useGSAP 传 scope，事件回调使用 contextSafe。",
      "没有 @gsap/react 时，useEffect 里用 gsap.context 并在 cleanup 调 ctx.revert()。",
      "Vue onMounted / Svelte onMount 后创建动画，卸载时 revert。",
      "Nuxt 中可封装 lazyLoadPlugin 来按需加载 SplitText、MorphSVG 等插件。",
    ],
  },
  {
    id: "performance-loop",
    title: "7. 性能优先级：少重排、少重复创建、及时清理",
    group: "performance",
    intro: "优先 transform/opacity，长列表分批，高频输入用 quickTo。",
    apiIds: ["perf-transform-opacity", "perf-will-change", "perf-batch", "quick-to"],
    steps: [
      "移动用 x/y，不用 left/top；缩放用 scale，不用 width/height。",
      "will-change 只加给确实会动的元素。",
      "鼠标跟随和实时输入用 quickTo 复用 tween。",
      "ScrollTrigger.refresh() 只在布局真的改变后调用，避免高频刷新。",
    ],
  },
];

/** 根据 id 查找 API，组件渲染教程时可避免重复过滤逻辑。 */
export function findApiItem(id: string): ApiItem | undefined {
  return apiItems.find((item) => item.id === id);
}

/** 按 skill 分组 API，供覆盖矩阵和导航使用。 */
export function getApisByGroup(group: SkillGroupId): ApiItem[] {
  return apiItems.filter((item) => item.group === group);
}
