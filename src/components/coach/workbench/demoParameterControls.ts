import type { ApiItem, SkillGroupId } from "@/data/gsapApiCatalog";

export type DemoParameterValue = number | string | boolean;

export interface DemoParameterOption {
  label: string;
  value: string;
}

export interface DemoParameterControl {
  id: string;
  label: string;
  description: string;
  valueType: "number" | "select" | "boolean";
  defaultValue: DemoParameterValue;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: DemoParameterOption[];
}

export type DemoParameterValues = Record<string, DemoParameterValue>;

const easeOptions: DemoParameterOption[] = [
  { label: "power2.out", value: "power2.out" },
  { label: "power3.inOut", value: "power3.inOut" },
  { label: "back.out(1.7)", value: "back.out(1.7)" },
  { label: "elastic.out(1,0.3)", value: "elastic.out(1,0.3)" },
  { label: "none", value: "none" },
];

const groupControls: Record<SkillGroupId, DemoParameterControl[]> = {
  core: [
    { id: "x", label: "目标 x", description: "横向移动距离", valueType: "number", defaultValue: 220, min: -80, max: 300, step: 10, unit: "px" },
    { id: "y", label: "目标 y", description: "纵向移动距离", valueType: "number", defaultValue: 42, min: -80, max: 100, step: 2, unit: "px" },
    { id: "rotation", label: "旋转", description: "目标旋转角度", valueType: "number", defaultValue: 180, min: -360, max: 540, step: 15, unit: "deg" },
    { id: "scale", label: "缩放", description: "目标缩放比例", valueType: "number", defaultValue: 1.12, min: 0.5, max: 1.8, step: 0.02 },
    { id: "drawEnd", label: "绘制终点", description: "SVG 线段最终可见比例", valueType: "number", defaultValue: 100, min: 20, max: 100, step: 5, unit: "%" },
    { id: "duration", label: "时长", description: "单段 tween 的持续时间", valueType: "number", defaultValue: 0.65, min: 0.1, max: 2, step: 0.05, unit: "s" },
    { id: "stagger", label: "错峰", description: "多个目标之间的延迟", valueType: "number", defaultValue: 0.04, min: 0, max: 0.2, step: 0.01, unit: "s" },
    { id: "ease", label: "缓动", description: "目标状态的速度曲线", valueType: "select", defaultValue: "back.out(1.7)", options: easeOptions },
  ],
  timeline: [
    { id: "x", label: "阶段 x", description: "时间线主要横向位移", valueType: "number", defaultValue: 180, min: 60, max: 280, step: 10, unit: "px" },
    { id: "y", label: "阶段 y", description: "时间线主要纵向位移", valueType: "number", defaultValue: 50, min: -60, max: 100, step: 2, unit: "px" },
    { id: "rotation", label: "收尾旋转", description: "最后一段旋转角度", valueType: "number", defaultValue: 18, min: -90, max: 180, step: 3, unit: "deg" },
    { id: "duration", label: "片段时长", description: "时间线内每段 tween 的时长", valueType: "number", defaultValue: 0.5, min: 0.15, max: 1.5, step: 0.05, unit: "s" },
    { id: "stagger", label: "错峰", description: "点阵动画的错峰间隔", valueType: "number", defaultValue: 0.03, min: 0, max: 0.16, step: 0.01, unit: "s" },
    { id: "ease", label: "缓动", description: "时间线默认速度曲线", valueType: "select", defaultValue: "power2.out", options: easeOptions },
  ],
  scroll: [
    { id: "x", label: "模拟滚动 x", description: "ScrollTrigger 进度映射到横向位移", valueType: "number", defaultValue: 240, min: 80, max: 300, step: 10, unit: "px" },
    { id: "y", label: "嵌套 y", description: "containerAnimation 等示例的纵向偏移", valueType: "number", defaultValue: -36, min: -90, max: 60, step: 3, unit: "px" },
    { id: "drawEnd", label: "绘制终点", description: "SVG 线段最终可见比例", valueType: "number", defaultValue: 100, min: 20, max: 100, step: 5, unit: "%" },
    { id: "duration", label: "演示时长", description: "舞台模拟滚动的播放时长", valueType: "number", defaultValue: 0.7, min: 0.1, max: 2, step: 0.05, unit: "s" },
    { id: "stagger", label: "批量错峰", description: "batch 入场的错峰间隔", valueType: "number", defaultValue: 0.05, min: 0, max: 0.18, step: 0.01, unit: "s" },
    { id: "ease", label: "缓动", description: "非 scrub 段落的速度曲线", valueType: "select", defaultValue: "none", options: easeOptions },
  ],
  plugins: [
    { id: "x", label: "目标 x", description: "插件示例的主要横向位移", valueType: "number", defaultValue: 220, min: -40, max: 300, step: 10, unit: "px" },
    { id: "y", label: "目标 y", description: "插件示例的主要纵向位移", valueType: "number", defaultValue: 54, min: -120, max: 100, step: 3, unit: "px" },
    { id: "rotation", label: "旋转", description: "插件示例中的旋转角度", valueType: "number", defaultValue: 90, min: -360, max: 540, step: 15, unit: "deg" },
    { id: "scale", label: "缩放", description: "插件示例中的目标缩放比例", valueType: "number", defaultValue: 1.12, min: 0.5, max: 1.8, step: 0.02 },
    { id: "duration", label: "时长", description: "插件动画持续时间", valueType: "number", defaultValue: 1, min: 0.15, max: 2.5, step: 0.05, unit: "s" },
    { id: "velocity", label: "速度", description: "物理类插件的初速度", valueType: "number", defaultValue: 250, min: 80, max: 620, step: 10 },
    { id: "angle", label: "角度", description: "Physics2D 的发射角", valueType: "number", defaultValue: 70, min: 15, max: 120, step: 5, unit: "deg" },
    { id: "gravity", label: "重力", description: "Physics2D 的重力参数", valueType: "number", defaultValue: 460, min: 100, max: 900, step: 20 },
    { id: "autoRotate", label: "自动转向", description: "MotionPath 是否沿路径方向旋转", valueType: "boolean", defaultValue: true },
    { id: "ease", label: "缓动", description: "插件示例的速度曲线", valueType: "select", defaultValue: "power2.out", options: easeOptions },
  ],
  utils: [
    { id: "raw", label: "输入值", description: "传入 gsap.utils 管道的原始数值", valueType: "number", defaultValue: 65, min: -40, max: 140, step: 5 },
    { id: "x", label: "目标 x", description: "工具函数映射后的横向位移上限", valueType: "number", defaultValue: 220, min: 80, max: 300, step: 10, unit: "px" },
    { id: "rotation", label: "旋转", description: "工具函数映射后的旋转参考值", valueType: "number", defaultValue: 210, min: 30, max: 360, step: 15, unit: "deg" },
    { id: "stagger", label: "错峰", description: "工具函数示例的目标错峰间隔", valueType: "number", defaultValue: 0.025, min: 0, max: 0.16, step: 0.005, unit: "s" },
    { id: "duration", label: "时长", description: "工具函数示例的播放时长", valueType: "number", defaultValue: 0.55, min: 0.1, max: 1.8, step: 0.05, unit: "s" },
    { id: "ease", label: "缓动", description: "工具函数示例的速度曲线", valueType: "select", defaultValue: "coach-snap", options: [{ label: "coach-snap", value: "coach-snap" }, ...easeOptions] },
  ],
  react: [
    { id: "x", label: "入场 x", description: "框架示例的提示位移", valueType: "number", defaultValue: 180, min: 60, max: 280, step: 10, unit: "px" },
    { id: "y", label: "入场 y", description: "框架示例的提示纵向位移", valueType: "number", defaultValue: 32, min: -60, max: 90, step: 3, unit: "px" },
    { id: "duration", label: "时长", description: "框架生命周期提示动画时长", valueType: "number", defaultValue: 0.55, min: 0.1, max: 1.6, step: 0.05, unit: "s" },
    { id: "stagger", label: "错峰", description: "辅助点阵的错峰间隔", valueType: "number", defaultValue: 0.025, min: 0, max: 0.12, step: 0.005, unit: "s" },
    { id: "ease", label: "缓动", description: "框架示例的速度曲线", valueType: "select", defaultValue: "power2.out", options: easeOptions },
  ],
  performance: [
    { id: "x", label: "目标 x", description: "性能示例的 transform 位移", valueType: "number", defaultValue: 220, min: 80, max: 300, step: 10, unit: "px" },
    { id: "y", label: "目标 y", description: "性能示例的 transform 纵向位移", valueType: "number", defaultValue: -12, min: -80, max: 80, step: 2, unit: "px" },
    { id: "scale", label: "缩放", description: "性能示例的 transform 缩放", valueType: "number", defaultValue: 1.14, min: 0.7, max: 1.6, step: 0.02 },
    { id: "duration", label: "时长", description: "性能示例播放时长", valueType: "number", defaultValue: 0.55, min: 0.1, max: 1.8, step: 0.05, unit: "s" },
    { id: "stagger", label: "批量错峰", description: "批量动画错峰间隔", valueType: "number", defaultValue: 0.05, min: 0, max: 0.18, step: 0.01, unit: "s" },
    { id: "ease", label: "缓动", description: "性能示例的速度曲线", valueType: "select", defaultValue: "power2.out", options: easeOptions },
  ],
};

const pluginOverrides: Record<string, Partial<Record<string, DemoParameterValue>>> = {
  "motion-path": { duration: 1.15, ease: "power1.inOut", x: 0, y: 0 },
  "physics-2d": { duration: 1.15, velocity: 250, angle: 70, gravity: 460 },
  "physics-props": { duration: 1.05, velocity: 120, rotation: 180 },
  "custom-bounce": { y: -90, duration: 0.7, ease: "coach-bounce" },
  inertia: { velocity: 360, x: 250, y: 45, duration: 1.05 },
};

const apiControlIds: Record<string, string[]> = {
  "gsap-to": ["x", "y", "rotation", "scale", "duration", "ease"],
  "gsap-from": ["x", "y", "scale", "duration", "stagger", "ease"],
  "gsap-fromto": ["x", "y", "rotation", "scale", "drawEnd", "duration", "ease"],
  "gsap-set": ["x", "y", "scale", "stagger", "duration", "ease"],
  "core-vars": ["x", "y", "duration", "ease"],
  "auto-alpha": ["duration", "stagger", "ease"],
  targets: ["y", "duration", "stagger", "ease"],
  stagger: ["y", "scale", "duration", "stagger", "ease"],
  "function-values": ["x", "y", "duration", "stagger", "ease"],
  "tween-control": ["x", "y", "rotation", "duration", "ease"],
  "timeline-control": ["x", "y", "rotation", "duration", "ease"],
  "register-scrolltrigger": ["x", "drawEnd", "duration"],
  "scroll-trigger-config": ["x", "drawEnd", "duration"],
  "scroll-callbacks": ["x", "duration", "ease"],
  "scroll-create": ["x", "duration", "ease"],
  "scroll-batch": ["y", "duration", "stagger", "ease"],
  "container-animation": ["y", "duration"],
  "scroll-refresh-kill": ["drawEnd", "duration"],
  "scroll-to": ["x", "y", "duration", "ease"],
  flip: ["x", "y", "scale", "duration", "ease"],
  draggable: ["x", "y", "scale", "duration", "ease"],
  inertia: ["x", "y", "velocity", "duration"],
  observer: ["x", "y", "rotation", "duration", "stagger", "ease"],
  "split-text": ["y", "duration", "stagger", "ease"],
  "scramble-text": ["duration"],
  "draw-svg": ["duration"],
  "morph-svg": ["duration", "ease"],
  "motion-path": ["duration", "autoRotate", "ease"],
  "motion-path-helper": ["duration", "autoRotate", "ease"],
  "custom-wiggle": ["rotation", "duration"],
  "custom-bounce": ["y", "duration", "ease"],
  "physics-2d": ["velocity", "angle", "gravity", "duration"],
  "physics-props": ["x", "rotation", "velocity", "duration"],
};

function getControlIds(api: ApiItem): string[] | undefined {
  if (apiControlIds[api.id]) return apiControlIds[api.id];
  if (api.group === "core") return ["x", "y", "rotation", "scale", "duration", "stagger", "ease"];
  if (api.group === "timeline") return ["x", "y", "rotation", "duration", "stagger", "ease"];
  if (api.group === "scroll") return ["x", "y", "drawEnd", "duration", "stagger", "ease"];
  if (api.group === "plugins") return ["x", "y", "rotation", "scale", "duration", "ease"];
  if (api.group === "utils" || api.id === "quick-to" || api.id === "perf-will-change") return ["raw", "x", "rotation", "duration", "stagger", "ease"];
  if (api.group === "performance") return ["x", "y", "scale", "duration", "stagger", "ease"];
  if (api.group === "react") return ["x", "y", "duration", "stagger", "ease"];

  return undefined;
}

export function getDemoParameterControls(api?: ApiItem): DemoParameterControl[] {
  if (!api) return groupControls.core;

  const controls = groupControls[api.group] ?? groupControls.core;
  const controlIds = getControlIds(api);
  if (!controlIds) return controls;

  return controlIds
    .map((controlId) => controls.find((control) => control.id === controlId))
    .filter((control): control is DemoParameterControl => Boolean(control));
}

export function getDefaultDemoParameterValues(api?: ApiItem): DemoParameterValues {
  const controls = getDemoParameterControls(api);
  const values = controls.reduce<DemoParameterValues>((defaults, control) => {
    defaults[control.id] = control.defaultValue;
    return defaults;
  }, {});

  if (!api) return values;

  const overrides = pluginOverrides[api.id];
  if (!overrides) return values;

  Object.entries(overrides).forEach(([key, value]) => {
    if (value === undefined) return;

    values[key] = value;
  });

  return values;
}

export function mergeDemoParameterValues(api: ApiItem | undefined, customValues?: DemoParameterValues): DemoParameterValues {
  return {
    ...getDefaultDemoParameterValues(api),
    ...customValues,
  };
}

export function numberParam(values: DemoParameterValues, id: string, fallback: number) {
  const value = values[id];

  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function stringParam(values: DemoParameterValues, id: string, fallback: string) {
  const value = values[id];

  return typeof value === "string" ? value : fallback;
}

export function booleanParam(values: DemoParameterValues, id: string, fallback: boolean) {
  const value = values[id];

  return typeof value === "boolean" ? value : fallback;
}
