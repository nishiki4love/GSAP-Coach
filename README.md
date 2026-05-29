# GSAP Coach

GSAP Coach 是一个面向 GSAP 学习和演示的前端应用，用 React、Vite、Tailwind CSS 和 shadcn 风格组件组织交互式工作台。

## 技术栈

- React 19
- Vite 8
- Tailwind CSS 4
- TypeScript
- GSAP 3 与 `@gsap/react`
- Bun

## 功能概览

- 演示工作台：运行 Tween、Timeline、插件与 Utils 示例。
- 教程：按学习路径浏览 GSAP 使用步骤。
- 覆盖矩阵：查看本地 GSAP API 覆盖状态。
- 滚动实验：演示 ScrollTrigger 的 pin、scrub、batch 等模式。
- 插件实验室：覆盖 Flip、Draggable、SplitText 等插件示例。
- 性能指南：整理 transform、quickTo、will-change 与清理策略。

## 本地开发

安装依赖：

```bash
bun install
```

启动开发服务器：

```bash
bun run dev
```

类型检查：

```bash
bun run lint
```

生产构建：

```bash
bun run build
```

预览构建结果：

```bash
bun run preview
```

## 项目结构

```text
src/
  components/coach/       GSAP Coach 业务页面与工作台组件
  components/ui/          通用 UI 组件
  data/                   GSAP API 目录与教程数据
  hooks/                  通用 React hooks
  lib/                    GSAP 初始化与工具函数
  App.tsx                 应用主入口
  main.tsx                React 挂载入口
```

## 协作约定

本仓库使用 `AGENTS.md` 记录 Codex/LLM 协作规则。修改代码前请先阅读该文件，并保持改动聚焦、可验证。
