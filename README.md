# GSAP Coach

GSAP Coach 是一个面向前端开发者的 GSAP 交互式教学网站。它把“学习路径、章节课堂、动画工作台、API 覆盖矩阵和专题实验室”组织在一起，帮助用户从基础 Tween 心智模型逐步学到 Timeline、ScrollTrigger、插件、框架清理和性能优化。

项目当前更像一个可运行的课程产品，而不是单纯的 API 示例集：用户可以按章节学习、完成自测、收藏 API 和代码片段，也可以通过覆盖矩阵快速查找某个 GSAP API 的演示或教程位置。

## 核心能力

- 学习路径：首页和教程页展示推荐学习顺序、章节进度、下一步课程和推荐实验。
- 章节课堂：每个章节包含学习目标、核心概念、观察演示、练习任务、常见错误、自测题和完成检查。
- 演示工作台：提供 Core、Timeline、ScrollTrigger、Plugins、Utils 等交互式动画演示。
- API 详情：从教程、覆盖矩阵和专题页跳转到 API 详情，并通过 `?api=` 参数保留当前选中 API。
- 覆盖矩阵：支持按关键词、覆盖状态和 skill 分组筛选全部 GSAP API。
- 专题实验室：包含滚动实验、插件实验室和性能指南，用于进阶练习。
- 学习收藏夹：支持收藏 API 和代码片段，方便回到工作台复习。
- 双语内容：通过 i18next 支持中英文内容切换。

## 教学流程

推荐用户按下面的顺序学习：

1. 进入首页，点击“开始学习”或“继续学习”。
2. 在教程目录查看 7 个章节的学习顺序、难度、预计时间和完成进度。
3. 进入章节课堂，按“概念 -> 演示 -> 练习 -> 自测 -> 完成检查”的节奏学习。
4. 点击章节内的 API 按钮，跳到工作台观察对应 API 的动画效果和代码片段。
5. 完成章节后，根据推荐进入滚动实验、插件实验室或性能指南。
6. 需要查 API 时，进入覆盖矩阵搜索、筛选并返回详情上下文。

## 页面地图

| 路由 | 页面 | 用途 |
| --- | --- | --- |
| `/` | 演示工作台 | 查看学习路径、运行动画演示、阅读 API 详情和收藏内容 |
| `/tutorials` | 教程目录 | 浏览全部章节、进度、难度、目标和推荐下一章 |
| `/tutorials/:chapterId` | 章节课堂 | 完成单章学习、练习、自测和下一步推荐 |
| `/coverage` | 覆盖矩阵 | 搜索和筛选 GSAP API 覆盖状态 |
| `/scroll-labs/vertical` | 滚动实验 | 练习 ScrollTrigger 的 pin、scrub、containerAnimation 和 refresh |
| `/plugins` | 插件实验室 | 查看 Flip、Draggable、SplitText、SVG、物理等插件能力 |
| `/performance` | 性能指南 | 学习 transform、quickTo、will-change、清理和检查项 |

## 技术栈

- React 19
- React Router 7
- TypeScript 6
- Vite 8
- Tailwind CSS 4
- GSAP 3 与 `@gsap/react`
- Base UI / shadcn 风格组件
- i18next
- Bun

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

GitHub Pages 构建：

```bash
bun run build:pages
```

预览生产产物：

```bash
bun run preview
```

## 部署说明

普通构建使用根路径 `/`：

```bash
bun run build
```

GitHub Pages 构建会设置 `GITHUB_PAGES=true`，Vite 会把 `base` 切换为 `/GSAP-Coach/`：

```bash
bun run build:pages
```

相关配置在 `vite.config.ts` 中。

## 项目结构

```text
src/
  components/coach/       GSAP Coach 页面、工作台、教程和专题组件
  components/ui/          通用 UI 组件
  data/                   GSAP API 目录与教程基础数据
  hooks/                  通用 React hooks
  lib/                    GSAP 初始化、主题、国际化和工具函数
  App.tsx                 应用路由、状态和 GSAP 演示主逻辑
  main.tsx                React 挂载入口
  styles.css              Tailwind CSS 4 样式入口

docs/
  product-teaching-flow-review.md                 教学流程产品体验评估
  product-teaching-flow-implementation-audit.md   教学流程改进实现审计
```

## 关键文件

- `src/App.tsx`：应用壳、路由、选中 API、课程进度、收藏状态和工作台动画逻辑。
- `src/components/coach/WorkbenchPage.tsx`：首页学习路径、演示工作台和收藏夹。
- `src/components/coach/TutorialsPage.tsx`：教程目录和章节进度。
- `src/components/coach/TutorialLessonPage.tsx`：章节课堂页面。
- `src/components/coach/tutorialMeta.ts`：章节时长、难度、核心概念、常见错误和自测题。
- `src/components/coach/tutorialProgress.ts`：localStorage 课程进度和下一步推荐。
- `src/components/coach/learningCollections.ts`：API 与代码片段收藏。
- `src/components/coach/CoveragePage.tsx`：API 覆盖矩阵、搜索和筛选。
- `src/data/gsapApiCatalog.ts`：GSAP API 目录、分组、教程章节和覆盖状态。

## 验证记录

当前教学流程改进完成后，已通过：

```bash
bun run lint
bun run build
bun run build:pages
git diff --check
```

更多产品评估和实现审计见 `docs/` 目录。

## 协作约定

- 优先使用 `bun` 或 `pnpm`。
- 前端代码优先沿用 React 19、Vite 8、Tailwind CSS 4 CSS-first 的项目方向。
- 修改时保持范围聚焦，不顺手重构无关代码。
- 新增或修改代码时保持清晰中文注释，复杂公开函数优先使用 JSDoc。
- 每次重要改动后至少运行 `bun run lint`，涉及构建或部署时补充 `bun run build` 或 `bun run build:pages`。
