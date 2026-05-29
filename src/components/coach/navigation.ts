import {
  BookOpen,
  Gauge,
  Layers,
  Route,
  SquareMousePointer,
  TableProperties,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { CoachPageId } from "./types";

export interface CoachPageItem {
  id: CoachPageId;
  title: string;
  description: string;
  icon: LucideIcon;
}

/** 顶层页面菜单：把原本一条长页面拆成几个可读的工作区。 */
export const coachPages: CoachPageItem[] = [
  {
    id: "demo",
    title: "演示工作台",
    description: "运行 Tween、Timeline、插件与 Utils 演示",
    icon: Zap,
  },
  {
    id: "tutorials",
    title: "教程",
    description: "按学习路径阅读 GSAP 使用步骤",
    icon: BookOpen,
  },
  {
    id: "coverage",
    title: "覆盖矩阵",
    description: "用表格查看全部 API 覆盖状态",
    icon: TableProperties,
  },
  {
    id: "scroll-labs",
    title: "滚动实验",
    description: "ScrollTrigger pin、scrub 与 containerAnimation",
    icon: Route,
  },
  {
    id: "plugins",
    title: "插件实验室",
    description: "Flip、Draggable、SplitText、SVG 与物理插件",
    icon: SquareMousePointer,
  },
  {
    id: "performance",
    title: "性能指南",
    description: "transform、quickTo、will-change 与清理策略",
    icon: Gauge,
  },
];

export const demoPageIcon = Layers;
