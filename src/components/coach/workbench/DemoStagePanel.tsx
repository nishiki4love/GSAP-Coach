import { Badge } from "@/components/ui/badge";
import type { ApiItem } from "@/data/gsapApiCatalog";
import { localizeApi, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { DemoParameterValues } from "./demoParameterControls";
import { getDemoParameterSpec } from "./demoParameterSpecs";

interface DemoStagePanelProps {
  selectedApi?: ApiItem;
  parameterValues: DemoParameterValues;
  observerHint: string;
  stageStatus: string;
}

interface ApiStageScene {
  accentClassName: string;
  boxLabel: string;
  canvasClassName: string;
  guideLabels: string[];
  sceneCue: string;
  sceneTitle: string;
  showBox: boolean;
  showDots: boolean;
  showMotionDot: boolean;
  showMorph: boolean;
  showOrbit: boolean;
  showPhysicsBall: boolean;
  showPhysicsProp: boolean;
  showRoute: boolean;
  useDragBox: boolean;
}

type ScenePreset = Partial<Pick<ApiStageScene, "guideLabels" | "sceneCue" | "sceneTitle">>;

const dotApiIds = new Set([
  "gsap-from",
  "gsap-set",
  "auto-alpha",
  "targets",
  "stagger",
  "function-values",
  "timeline-chain",
  "position-parameter",
  "timeline-labels",
  "timeline-nesting",
  "scroll-batch",
  "perf-batch",
  "observer",
  "utils-clamp",
  "utils-map-range",
  "utils-normalize",
  "utils-interpolate",
  "utils-random",
  "utils-snap",
  "utils-shuffle",
  "utils-distribute",
  "utils-get-unit",
  "utils-unitize",
  "utils-split-color",
  "utils-selector",
  "utils-to-array",
  "utils-pipe",
  "utils-wrap",
  "utils-wrap-yoyo",
  "quick-to",
  "perf-will-change",
  "use-gsap",
  "context-safe",
  "gsap-context",
  "vue-lifecycle",
  "nuxt-lazy-plugin",
  "svelte-on-mount",
  "gs-devtools",
  "pixi-plugin",
]);
const routeApiIds = new Set(["gsap-fromto", "register-scrolltrigger", "scroll-trigger-config", "container-animation", "scroll-refresh-kill", "scroller-proxy", "scroll-smoother", "draw-svg", "motion-path", "motion-path-helper"]);
const motionDotApiIds = new Set(["timeline-chain", "container-animation", "scroller-proxy", "scroll-smoother", "scroll-to", "motion-path", "motion-path-helper"]);
const noBoxApiIds = new Set([
  "auto-alpha",
  "targets",
  "stagger",
  "function-values",
  "utils-to-array",
  "scroll-batch",
  "scroll-refresh-kill",
  "perf-batch",
  "svg-origin",
  "split-text",
  "scramble-text",
  "draw-svg",
  "morph-svg",
  "motion-path",
  "motion-path-helper",
  "physics-2d",
  "custom-bounce",
  "physics-props",
]);

const scenePresets: Record<string, ScenePreset> = {
  "gsap-to": { sceneTitle: "当前值 -> 目标 vars", sceneCue: "最直接观察 x、y、rotation、scale 如何到达目标。", guideLabels: ["当前布局", "目标状态", "vars"] },
  "gsap-from": { sceneTitle: "声明起点 -> 回到布局", sceneCue: "元素先被放到 fromVars，再回到页面中的自然位置。", guideLabels: ["fromVars", "布局终点", "entrance"] },
  "gsap-fromto": { sceneTitle: "显式起点 -> 显式终点", sceneCue: "不依赖当前样式，适合可复现的训练示例。", guideLabels: ["fromVars", "toVars", "drawSVG"] },
  "gsap-set": { sceneTitle: "立即设值 -> 再播放", sceneCue: "先用 set() 搭好舞台，再运行可见 tween。", guideLabels: ["set()", "instant", "then tween"] },
  "core-vars": { sceneTitle: "通用 vars 控制台", sceneCue: "duration、delay、ease、repeat 和 yoyo 会共同改变同一个目标的节奏。", guideLabels: ["delay", "repeat", "yoyo"] },
  "immediate-render": { sceneTitle: "immediateRender 起点保护", sceneCue: "第二段 from() 延后读取起点，避免提前覆盖上一段动画。", guideLabels: ["from #1", "from #2", "false"] },
  "transform-aliases": { sceneTitle: "Transform 别名面板", sceneCue: "x、y、scale、rotationY 这些别名最终都写入 transform。", guideLabels: ["x / y", "scale", "rotationY"] },
  "transform-origin": { sceneTitle: "视觉支点旋转", sceneCue: "先把支点放到左侧，再观察旋转如何围绕这个点展开。", guideLabels: ["origin", "pivot", "rotate"] },
  "auto-alpha": { sceneTitle: "透明度与可见性", sceneCue: "autoAlpha 同时控制 opacity 和 visibility，适合可访问的淡入淡出。", guideLabels: ["opacity", "visibility", "fade"] },
  "css-vars": { sceneTitle: "CSS 变量补间", sceneCue: "舞台色相和光感由 CSS 自定义属性直接被 GSAP 推动。", guideLabels: ["--hue", "--glow", "theme"] },
  "svg-origin": { sceneTitle: "SVG 全局支点", sceneCue: "SVG 节点围绕固定坐标旋转，适合图标、仪表和轨道动画。", guideLabels: ["svgOrigin", "120 72", "orbit"] },
  "directional-rotation": { sceneTitle: "旋转方向后缀", sceneCue: "_short、_cw、_ccw 会明确告诉 GSAP 该往哪边转。", guideLabels: ["_short", "_cw", "_ccw"] },
  "clear-props": { sceneTitle: "内联样式回收", sceneCue: "动画结束后清掉 transform 和背景色，把控制权还给 CSS。", guideLabels: ["inline", "clearProps", "CSS"] },
  targets: { sceneTitle: "目标集合命中", sceneCue: "NodeList 会被归一成一组目标，适合批量控制多个元素。", guideLabels: ["NodeList", "array", "batch"] },
  eases: { sceneTitle: "缓动曲线对比", sceneCue: "同一个方块依次使用 back、elastic 和自定义节奏，差异更直观。", guideLabels: ["back", "elastic", "custom"] },
  "tween-control": { sceneTitle: "Animation 播放控制", sceneCue: "返回的 tween 可以被进度条、暂停、反向和重播按钮接管。", guideLabels: ["progress", "pause", "reverse"] },
  "function-values": { sceneTitle: "函数式属性值", sceneCue: "每个 dot 根据 index 计算不同目标值，形成可读的规则阵列。", guideLabels: ["index", "value fn", "stagger"] },
  "relative-values": { sceneTitle: "相对值累加", sceneCue: "+= 和 -= 让下一段动画基于当前状态继续追加。", guideLabels: ["+=", "-=", "current"] },
  "gsap-defaults": { sceneTitle: "默认参数沙盒", sceneCue: "临时改写全局 defaults 后再恢复，观察默认 duration/ease 的影响。", guideLabels: ["defaults", "override", "restore"] },
  "match-media": { sceneTitle: "响应式动画分支", sceneCue: "同一 API 根据视口和 reduced motion 条件选择不同目标。", guideLabels: ["desktop", "mobile", "reduce"] },
  "match-media-refresh": { sceneTitle: "媒体条件刷新", sceneCue: "调用 matchMediaRefresh 后重新计算媒体分支，再播放提示动作。", guideLabels: ["refresh", "recalc", "replay"] },
  stagger: { sceneTitle: "同类目标错峰", sceneCue: "观察每个 dot 的启动时间如何被 stagger 拉开。", guideLabels: ["target list", "each delay", "wave"] },
  "timeline-create": { sceneTitle: "多段 tween 编排", sceneCue: "一个播放头串起 x、y、scale、rotation。", guideLabels: ["step 1", "step 2", "step 3"] },
  "timeline-chain": { sceneTitle: "链式追加", sceneCue: "to/fromTo 可以连续追加，位置参数控制关系。", guideLabels: ["chain", "<", "+=0.1"] },
  "position-parameter": { sceneTitle: "位置参数", sceneCue: "< 表示贴合上一段，+= 表示相对错开。", guideLabels: ["0", "<0.12", "+=0.2"] },
  "timeline-labels": { sceneTitle: "标签片段", sceneCue: "label 让复杂时间点变成可读的片段名称。", guideLabels: ["intro", "focus", "outro"] },
  "timeline-nesting": { sceneTitle: "嵌套时间线", sceneCue: "child timeline 可以作为一个整体加入 master。", guideLabels: ["child", "master", "add()"] },
  "timeline-control": { sceneTitle: "时间线播放控制", sceneCue: "整条 timeline 也能被进度条、pause、reverse 和 restart 接管。", guideLabels: ["timeline", "scrub", "control"] },
  "register-scrolltrigger": { sceneTitle: "ScrollTrigger 注册验证", sceneCue: "路径和方块共同模拟 scrub 进度，说明插件注册后的可用状态。", guideLabels: ["plugin", "scrub", "progress"] },
  "scroll-trigger-config": { sceneTitle: "滚动区间映射", sceneCue: "用舞台轨道模拟 start/end/scrub 的关系。", guideLabels: ["start", "scrub", "end"] },
  "scroll-callbacks": { sceneTitle: "滚动回调信号", sceneCue: "onEnter 和 onUpdate 分段改变状态，便于理解触发器生命周期。", guideLabels: ["onEnter", "onUpdate", "status"] },
  "scroll-create": { sceneTitle: "触发器回调", sceneCue: "跨越触发区时更新状态和视觉反馈。", guideLabels: ["onEnter", "onUpdate", "toggle"] },
  "scroll-batch": { sceneTitle: "批量入场", sceneCue: "多个元素按批次进入，再用 stagger 排队。", guideLabels: ["batch", "batchMax", "stagger"] },
  "container-animation": { sceneTitle: "容器动画参考系", sceneCue: "横向轨道成为嵌套触发器的时间轴。", guideLabels: ["container", "nested", "scrub"] },
  "scroll-refresh-kill": { sceneTitle: "刷新与清理触发器", sceneCue: "先 refresh 重新测量，再用路径变化表达 kill/cleanup 的收尾意图。", guideLabels: ["refresh", "measure", "kill"] },
  "register-plugin": { sceneTitle: "插件注册入口", sceneCue: "标题和方块同时响应，提示插件能力已经在应用入口注册。", guideLabels: ["register", "plugin", "ready"] },
  "scroll-to": { sceneTitle: "滚动到目标", sceneCue: "用 motion dot 模拟页面平滑滚动到指定位置。", guideLabels: ["scrollTo", "target", "smooth"] },
  flip: { sceneTitle: "旧布局 -> 新布局", sceneCue: "Flip 先记录旧状态，再从旧状态过渡到新状态。", guideLabels: ["getState", "mutate", "Flip.from"] },
  draggable: { sceneTitle: "可拖拽目标", sceneCue: "舞台内的卡片绑定 Draggable，可以直接拖动。", guideLabels: ["bounds", "drag", "callbacks"] },
  inertia: { sceneTitle: "惯性释放", sceneCue: "释放速度和 end 约束共同决定目标继续滑行到哪里。", guideLabels: ["velocity", "end", "inertia"] },
  observer: { sceneTitle: "输入方向感知", sceneCue: "滚轮、触摸、指针都归一成方向事件。", guideLabels: ["wheel", "touch", "pointer"] },
  "split-text": { sceneTitle: "文字拆分入场", sceneCue: "SplitText 将标题拆成 chars/words 后逐个动画。", guideLabels: ["words", "chars", "revert"] },
  "scramble-text": { sceneTitle: "文本乱序揭示", sceneCue: "状态文字由随机字符逐步还原成目标文本。", guideLabels: ["chars", "revealDelay", "text"] },
  "draw-svg": { sceneTitle: "路径描边绘制", sceneCue: "DrawSVG 改变 stroke 的可见线段比例。", guideLabels: ["0%", "stroke", "100%"] },
  "morph-svg": { sceneTitle: "形状变形", sceneCue: "一个 SVG path 平滑变形成另一个 path。", guideLabels: ["start shape", "target shape", "morph"] },
  "motion-path": { sceneTitle: "沿路径移动", sceneCue: "目标沿 SVG path 前进，并可选择是否自动转向。", guideLabels: ["path", "align", "autoRotate"] },
  "motion-path-helper": { sceneTitle: "路径调试辅助", sceneCue: "helper 属于开发期工具，舞台保留最终运行时会命中的路径目标。", guideLabels: ["helper", "dev only", "runtime"] },
  "custom-ease": { sceneTitle: "自定义缓动曲线", sceneCue: "把自定义 ease 放进同一段位移对比，方便感受节奏差别。", guideLabels: ["CustomEase", "curve", "snap"] },
  "custom-wiggle": { sceneTitle: "自定义摆动反馈", sceneCue: "旋转值沿 wiggle 曲线来回衰减，适合提示和错误反馈。", guideLabels: ["wiggle", "rotation", "feedback"] },
  "custom-bounce": { sceneTitle: "自定义弹跳落点", sceneCue: "球先上抛再落回原点，bounce 曲线负责最后的落地质感。", guideLabels: ["bounce", "apex", "landing"] },
  "physics-2d": { sceneTitle: "物理抛物线", sceneCue: "速度、角度、重力共同决定球的运动轨迹。", guideLabels: ["velocity", "angle", "gravity"] },
  "physics-props": { sceneTitle: "任意属性物理化", sceneCue: "PhysicsProps 可以驱动 x、rotation 等普通属性。", guideLabels: ["x velocity", "rotation", "end"] },
  "utils-clamp": { sceneTitle: "Clamp 边界限制", sceneCue: "输入值先被夹在安全范围内，再映射到舞台位移。", guideLabels: ["raw", "min/max", "clamp"] },
  "utils-map-range": { sceneTitle: "区间映射", sceneCue: "把输入从一个范围换算到另一个范围，常用于进度和角度转换。", guideLabels: ["input", "mapRange", "output"] },
  "utils-normalize": { sceneTitle: "归一化进度", sceneCue: "原始数值变成 0 到 1 的进度，方便继续组合其它工具函数。", guideLabels: ["range", "0..1", "progress"] },
  "utils-interpolate": { sceneTitle: "插值混合", sceneCue: "同一个输入同时驱动颜色和位置，展示 interpolate 的中间态。", guideLabels: ["from", "mix", "to"] },
  "utils-random": { sceneTitle: "随机值管道", sceneCue: "随机输入仍然会经过 clamp、normalize、mapRange 和 snap。", guideLabels: ["random", "pipeline", "snap"] },
  "utils-snap": { sceneTitle: "步进吸附", sceneCue: "连续角度被吸附到固定步长，适合网格、刻度和分段控制。", guideLabels: ["value", "step", "snap"] },
  "utils-shuffle": { sceneTitle: "顺序打散", sceneCue: "目标列表顺序被打散后再 stagger，产生不规则入场。", guideLabels: ["array", "shuffle", "order"] },
  "utils-distribute": { sceneTitle: "分布函数", sceneCue: "dot 根据索引和中心位置获得不同 y 值，形成规则波形。", guideLabels: ["from center", "amount", "grid"] },
  "utils-get-unit": { sceneTitle: "单位读取", sceneCue: "从字符串里读出单位，再把当前输入值转换成同单位输出。", guideLabels: ["42px", "unit", "px"] },
  "utils-unitize": { sceneTitle: "数值单位化", sceneCue: "裸数字经过 unitize 后成为可直接写入样式的带单位值。", guideLabels: ["number", "unitize", "style"] },
  "utils-split-color": { sceneTitle: "颜色通道拆分", sceneCue: "插值颜色被拆成 HSL 通道，便于调试和组合。", guideLabels: ["color", "HSL", "channels"] },
  "utils-selector": { sceneTitle: "作用域选择器", sceneCue: "选择器只会命中当前舞台内的 dot，避免影响其它示例。", guideLabels: ["scope", "selector", "dots"] },
  "utils-to-array": { sceneTitle: "目标转数组", sceneCue: "选择器或 NodeList 被标准化成数组后再统一补间。", guideLabels: ["selector", "array", "targets"] },
  "utils-pipe": { sceneTitle: "函数管道", sceneCue: "normalize、mapRange、snap 串成一条可复用的数据处理链。", guideLabels: ["pipe", "compose", "output"] },
  "utils-wrap": { sceneTitle: "循环包裹", sceneCue: "超出范围的数值会绕回区间内，适合轮播和循环索引。", guideLabels: ["range", "wrap", "loop"] },
  "utils-wrap-yoyo": { sceneTitle: "往返包裹", sceneCue: "数值到边界后反向折返，适合来回摆动的进度。", guideLabels: ["range", "yoyo", "reflect"] },
  "use-gsap": { sceneTitle: "React useGSAP 作用域", sceneCue: "动画创建在 useGSAP 回调内，组件更新或卸载时自动清理。", guideLabels: ["scope", "callback", "revert"] },
  "context-safe": { sceneTitle: "contextSafe 事件回调", sceneCue: "把点击、计时器等回调包进 contextSafe，延迟创建的动画也会被清理。", guideLabels: ["event", "contextSafe", "cleanup"] },
  "gsap-context": { sceneTitle: "gsap.context 手动清理", sceneCue: "没有 useGSAP 时，手动创建 context 并在 cleanup 中 revert。", guideLabels: ["create ctx", "animate", "ctx.revert"] },
  "vue-lifecycle": { sceneTitle: "Vue onMounted / onUnmounted", sceneCue: "组件挂载后创建动画，卸载时调用 ctx.revert()。", guideLabels: ["onMounted", "ctx", "onUnmounted"] },
  "nuxt-lazy-plugin": { sceneTitle: "Nuxt 插件懒加载", sceneCue: "只在客户端需要时加载 SplitText 等插件，避免 SSR 侧执行。", guideLabels: ["client", "lazy load", "register"] },
  "svelte-on-mount": { sceneTitle: "Svelte onMount 清理", sceneCue: "onMount 返回 cleanup，让动画和内联样式在卸载时复原。", guideLabels: ["onMount", "animate", "cleanup"] },
  "scroller-proxy": { sceneTitle: "平滑滚动代理", sceneCue: "把 smooth scroller 的 scrollTop 和边界信息代理给 ScrollTrigger。", guideLabels: ["proxy", "scrollTop", "update"] },
  "scroll-smoother": { sceneTitle: "ScrollSmoother 包裹层", sceneCue: "wrapper/content 结构把滚动视觉和 ScrollTrigger 同步起来。", guideLabels: ["wrapper", "content", "smooth"] },
  "morph-svg-utils": { sceneTitle: "MorphSVG 工具转换", sceneCue: "先把图形转换为 path/rawPath，再进入 MorphSVG 动画流程。", guideLabels: ["convert", "rawPath", "string"] },
  "ease-pack": { sceneTitle: "EasePack 节奏选择", sceneCue: "SlowMo、RoughEase、ExpoScaleEase 适合强调不同速度曲线。", guideLabels: ["SlowMo", "RoughEase", "ExpoScale"] },
  "gs-devtools": { sceneTitle: "GSDevTools 调试时间线", sceneCue: "开发环境把时间线挂到调试面板，生产环境不加载。", guideLabels: ["timeline", "scrub", "dev only"] },
  "pixi-plugin": { sceneTitle: "PixiPlugin 精灵参数", sceneCue: "PixiPlugin 把 x、y、scale 等精灵属性纳入 GSAP 控制。", guideLabels: ["sprite", "pixi", "render"] },
  "perf-transform-opacity": { sceneTitle: "合成层友好属性", sceneCue: "性能示例只推动 transform 和 opacity，避免触发布局抖动。", guideLabels: ["transform", "opacity", "composite"] },
  "perf-will-change": { sceneTitle: "will-change 提前声明", sceneCue: "动画前声明 transform 变化，让浏览器更早准备合成。", guideLabels: ["will-change", "prepare", "cleanup"] },
  "perf-batch": { sceneTitle: "性能批量入场", sceneCue: "多个元素合批并错峰，减少一次性触发的大量变化。", guideLabels: ["batch", "stagger", "paint"] },
  "quick-to": { sceneTitle: "quickTo 复用通道", sceneCue: "输入变化复用同一个 tween 通道，不为每次更新新建动画。", guideLabels: ["channel", "reuse", "input"] },
};

function getBoxLabel(apiId: string, apiName: string) {
  if (apiId === "draggable") return "drag";
  if (apiId.startsWith("utils-") || apiId === "quick-to") return "value";
  if (apiId.startsWith("scroll") || apiId === "register-scrolltrigger") return "scrub";
  if (apiId.startsWith("timeline") || apiId === "position-parameter") return "tl";
  if (apiId.startsWith("perf-")) return "perf";

  return apiName.replace(/^gsap\./, "").replace(/\(\)$/, "") || "api";
}

function getApiStageScene(api?: ApiItem, apiName = "API"): ApiStageScene {
  const apiId = api?.id ?? "gsap-to";
  const usesPhysicsBall = apiId === "physics-2d" || apiId === "custom-bounce";
  const usesPhysicsProp = apiId === "physics-props";
  const showBox = !noBoxApiIds.has(apiId) || apiId === "draggable";
  const preset = scenePresets[apiId];
  return {
    accentClassName: api?.group === "plugins" ? "bg-cyanline" : api?.group === "utils" || api?.group === "performance" ? "bg-amberline" : "bg-limebeam",
    boxLabel: getBoxLabel(apiId, apiName),
    canvasClassName: api?.group === "plugins"
      ? "bg-[hsl(188,45%,97%)]"
      : api?.group === "scroll"
        ? "bg-[hsl(92,42%,97%)]"
        : api?.group === "utils" || api?.group === "performance"
        ? "bg-[hsl(42,62%,97%)]"
          : "bg-[hsl(var(--stage-hue),42%,97%)]",
    guideLabels: preset?.guideLabels ?? [apiName, "初始", "结束"],
    sceneCue: preset?.sceneCue ?? (api?.summary ?? "选择一个 API 查看它的独立演示场景。"),
    sceneTitle: preset?.sceneTitle ?? `${apiName} 参数实验`,
    showBox,
    showDots: dotApiIds.has(apiId),
    showMotionDot: motionDotApiIds.has(apiId),
    showMorph: apiId === "morph-svg" || apiId === "morph-svg-utils",
    showOrbit: apiId === "svg-origin",
    showPhysicsBall: usesPhysicsBall,
    showPhysicsProp: usesPhysicsProp,
    showRoute: routeApiIds.has(apiId),
    useDragBox: apiId === "draggable",
  };
}

/** GSAP 演示舞台：只保留会被动画命中的 DOM，避免和控制面板状态混在一起。 */
export function DemoStagePanel({ selectedApi, parameterValues, observerHint, stageStatus }: DemoStagePanelProps) {
  const { locale, t } = useI18n();
  const api = selectedApi ? localizeApi(selectedApi, locale) : undefined;
  const scene = getApiStageScene(selectedApi, api?.name);
  const parameterSpec = getDemoParameterSpec(selectedApi, parameterValues);
  const apiId = selectedApi?.id ?? "default-stage";

  return (
    <section
      key={apiId}
      aria-label={scene.sceneTitle}
      data-stage-api={apiId}
      className={cn("demo-stage stage-canvas relative min-h-[500px] overflow-hidden rounded-xl border bg-card p-4 shadow-sm", scene.canvasClassName)}
    >
          <div className="stage-grid" />
          <div className="relative z-10 mb-2 min-h-16 pr-[188px]">
            <div className="min-w-0">
              <p data-target-api={apiId} className="split-demo-title text-lg font-semibold">{scene.sceneTitle}</p>
              <p className="max-w-xl text-xs leading-5 text-muted-foreground">{scene.sceneCue}</p>
              <p data-target-api={apiId} className="scramble-status text-xs text-muted-foreground">{stageStatus}</p>
            </div>
            <div className="absolute right-0 top-0 flex w-44 flex-col items-end gap-2">
              {api ? <Badge className="max-w-full truncate font-mono">{api.name}</Badge> : null}
              <Badge variant="secondary" className="w-36 justify-center font-mono">{observerHint}</Badge>
            </div>
          </div>

          <div className="absolute left-4 top-24 z-10 flex flex-wrap gap-2">
            {scene.guideLabels.map((label) => (
              <span key={label} className="rounded-md border bg-background/80 px-2 py-1 font-mono text-[11px] text-muted-foreground shadow-sm backdrop-blur">
                {label}
              </span>
            ))}
          </div>

          {scene.showBox ? (
            <>
              <div className="absolute left-8 top-32 h-px w-56 border-t border-dashed border-foreground/20" />
              <div className="absolute left-[260px] top-[126px] rounded-full border border-dashed border-foreground/30 px-2 py-1 text-[11px] text-muted-foreground">
                target
              </div>
            </>
          ) : null}

          {scene.showRoute || scene.showOrbit || scene.showMorph || scene.showMotionDot ? (
            <svg className="stage-animated absolute inset-x-6 top-24 h-44 w-[calc(100%-48px)]" viewBox="0 0 520 180" aria-hidden="true">
              {scene.showRoute || scene.showMotionDot ? (
                <>
                  <path id="motion-path" d="M24 126 C130 22, 220 154, 332 58 S452 88, 496 28" fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="2" />
                  <path id="draw-route" data-target-api={apiId} d="M24 126 C130 22, 220 154, 332 58 S452 88, 496 28" fill="none" stroke="#6fb936" strokeWidth="4" strokeLinecap="round" />
                </>
              ) : null}
              {scene.showOrbit ? (
                <g className="svg-orbit stage-animated" data-target-api={apiId}>
                  <circle cx="120" cy="72" r="20" fill="#19bfe8" opacity="0.16" />
                  <circle cx="145" cy="72" r="5" fill="#19bfe8" />
                </g>
              ) : null}
              {scene.showMorph ? (
                <>
                  <path id="morph-start" d="M403 128 L431 76 L459 128 Z" fill="none" stroke="transparent" />
                  <path id="morph-target" d="M410 78 C440 42, 484 78, 454 128 C437 154, 393 133, 410 78 Z" fill="none" stroke="transparent" />
                  <path id="morph-live" data-target-api={apiId} d="M403 128 L431 76 L459 128 Z" fill="#f6b63d" stroke="currentColor" strokeWidth="2" />
                </>
              ) : null}
            </svg>
          ) : null}

          {scene.showDots ? (
            <div className="pulse-row absolute left-8 top-[232px] flex gap-2">
              {Array.from({ length: 13 }).map((_, index) => (
                <span key={`${apiId}-${index}`} data-target-api={apiId} className={cn("pulse-dot stage-animated size-3 rounded-full", scene.accentClassName)} />
              ))}
            </div>
          ) : null}

          {scene.showBox ? (
            <div
              className={cn(
                "core-box stage-animated absolute left-8 top-36 grid size-20 place-items-center rounded-lg border bg-card text-center text-xs font-semibold shadow-sm",
                scene.useDragBox && "drag-card cursor-grab active:cursor-grabbing",
              )}
              data-target-api={apiId}
            >
              {scene.boxLabel}
            </div>
          ) : null}
          {scene.showMotionDot ? <div data-target-api={apiId} className="motion-dot stage-animated absolute left-6 top-24 h-4 w-8 rounded-full bg-cyanline shadow-sm" /> : null}
          {scene.showPhysicsBall ? <div data-target-api={apiId} className="physics-ball stage-animated absolute bottom-44 left-16 size-8 rounded-full bg-amberline shadow-sm" /> : null}
          {scene.showPhysicsProp ? <div data-target-api={apiId} className="physics-prop stage-animated absolute bottom-44 left-24 h-4 w-14 rounded-md bg-foreground" /> : null}

          <div className="absolute inset-x-4 bottom-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border bg-background/92 p-3 shadow-sm backdrop-blur">
              <div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">初始参数</div>
              <div className="flex flex-wrap gap-1.5">
                {parameterSpec.initial.map((item) => (
                  <code key={item} className="rounded-md bg-muted px-2 py-1 text-[11px] leading-none text-foreground">
                    {item}
                  </code>
                ))}
              </div>
            </div>
            <div className="rounded-lg border bg-background/92 p-3 shadow-sm backdrop-blur">
              <div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">结束参数</div>
              <div className="flex flex-wrap gap-1.5">
                {parameterSpec.target.map((item) => (
                  <code key={item} className="rounded-md bg-muted px-2 py-1 text-[11px] leading-none text-foreground">
                    {item}
                  </code>
                ))}
              </div>
            </div>
          </div>
    </section>
  );
}
