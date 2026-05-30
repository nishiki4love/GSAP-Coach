import type { Locale } from "@/lib/i18n";
import { Blocks, Route, Rows3, type LucideIcon } from "lucide-react";
import type { ScrollExampleId } from "../types";

export interface ScrollExampleItem {
  id: ScrollExampleId;
  path: string;
  labelKey: "scroll.example.vertical" | "scroll.example.horizontal" | "scroll.example.cleanup";
  descriptionKey: "scroll.example.verticalDescription" | "scroll.example.horizontalDescription" | "scroll.example.cleanupDescription";
  icon: LucideIcon;
}

export interface LocalizedScrollCopy {
  zh: string;
  en: string;
}

export const scrollExamples: ScrollExampleItem[] = [
  {
    id: "vertical",
    path: "/scroll-labs/vertical",
    labelKey: "scroll.example.vertical",
    descriptionKey: "scroll.example.verticalDescription",
    icon: Rows3,
  },
  {
    id: "horizontal",
    path: "/scroll-labs/horizontal",
    labelKey: "scroll.example.horizontal",
    descriptionKey: "scroll.example.horizontalDescription",
    icon: Route,
  },
  {
    id: "cleanup",
    path: "/scroll-labs/cleanup",
    labelKey: "scroll.example.cleanup",
    descriptionKey: "scroll.example.cleanupDescription",
    icon: Blocks,
  },
];

export const verticalSteps = [
  {
    label: "01",
    title: { zh: "触发区间", en: "Trigger Range" },
    api: "start / end",
    copy: {
      zh: "用 start 和 end 定义 pin 段的滚动距离，避免多个滚动实验共用同一个触发器。",
      en: "Use start and end to define the pinned scroll range so experiments do not share one trigger.",
    },
  },
  {
    label: "02",
    title: { zh: "绑定进度", en: "Bind Progress" },
    api: "scrub: 1",
    copy: {
      zh: "scrub 把滚动进度映射到 timeline 进度，适合轨道、仪表盘、过程图。",
      en: "scrub maps scroll progress onto timeline progress, ideal for tracks, meters, and process diagrams.",
    },
  },
  {
    label: "03",
    title: { zh: "固定视口", en: "Pin the Viewport" },
    api: "pin: true",
    copy: {
      zh: "pin 让实验段停在视口中，用户可以观察一条垂直流程如何逐步展开。",
      en: "pin keeps the experiment in view while the vertical process unfolds step by step.",
    },
  },
  {
    label: "04",
    title: { zh: "刷新布局", en: "Refresh Layout" },
    api: "refresh()",
    copy: {
      zh: "内容或尺寸变化后调用 ScrollTrigger.refresh()，让触发点重新计算。",
      en: "Call ScrollTrigger.refresh() after content or dimensions change so trigger points are recalculated.",
    },
  },
] satisfies Array<{ label: string; title: LocalizedScrollCopy; api: string; copy: LocalizedScrollCopy }>;

export const horizontalPanels = [
  {
    label: "A",
    title: { zh: "Container Animation", en: "Container Animation" },
    api: "containerAnimation",
    copy: {
      zh: "横向轨道本身由垂直滚动驱动，内部元素再把这条 tween 作为触发参考。",
      en: "The horizontal track is driven by vertical scrolling; nested elements use that tween as their trigger reference.",
    },
  },
  {
    label: "B",
    title: { zh: "横向触发点", en: "Horizontal Trigger Points" },
    api: "start: 'left 72%'",
    copy: {
      zh: "每张 panel 进入横向视口时独立淡入、放大和填充进度，便于演示复杂叙事卡片。",
      en: "Each panel fades, scales, and fills progress as it enters the horizontal viewport.",
    },
  },
  {
    label: "C",
    title: { zh: "嵌套 scrub", en: "Nested Scrub" },
    api: "scrub: true",
    copy: {
      zh: "panel 内部的文案和 meter 也跟随横向位移同步，不再只是整条轨道平移。",
      en: "Text and meters inside each panel scrub with horizontal movement instead of only moving the track.",
    },
  },
  {
    label: "D",
    title: { zh: "进度回传", en: "Progress Feedback" },
    api: "onUpdate",
    copy: {
      zh: "顶层 ScrollTrigger 的 onUpdate 同步页面状态和进度条，方便调试真实滚动进度。",
      en: "The top-level onUpdate syncs page status and the progress bar for debugging real scroll progress.",
    },
  },
] satisfies Array<{ label: string; title: LocalizedScrollCopy; api: string; copy: LocalizedScrollCopy }>;

export const cleanupCards = [
  {
    api: "ScrollTrigger.batch()",
    title: { zh: "批量入场", en: "Batched entry" },
    copy: {
      zh: "多个相似卡片共用 batch 回调，减少重复触发器里的动画分配。",
      en: "Similar cards share batched callbacks, reducing repeated animation work across triggers.",
    },
  },
  {
    api: "revertOnUpdate",
    title: { zh: "路由清理", en: "Route cleanup" },
    copy: {
      zh: "二级菜单切换时 useGSAP 自动 revert 当前示例，不保留旧 pin spacer。",
      en: "When the sub-route changes, useGSAP reverts the active example so old pin spacers do not remain.",
    },
  },
  {
    api: "refresh()",
    title: { zh: "布局刷新", en: "Layout refresh" },
    copy: {
      zh: "内容数量变化后只在下一帧刷新一次，避免滚动中频繁重新计算。",
      en: "After content changes, refresh once on the next frame instead of recalculating during scroll.",
    },
  },
  {
    api: "refreshPriority",
    title: { zh: "创建顺序", en: "Creation order" },
    copy: {
      zh: "按页面顺序创建触发器，复杂页面再用 refreshPriority 明确刷新顺序。",
      en: "Create triggers in page order, then use refreshPriority when complex pages need explicit refresh order.",
    },
  },
] satisfies Array<{ api: string; title: LocalizedScrollCopy; copy: LocalizedScrollCopy }>;

export function getLocalizedCopy(copy: LocalizedScrollCopy, locale: Locale) {
  return copy[locale];
}
