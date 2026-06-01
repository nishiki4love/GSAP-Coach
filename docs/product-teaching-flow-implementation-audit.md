# GSAP Coach 教学流程改进实现审计

审计日期：2026-05-31  
依据文档：`docs/product-teaching-flow-review.md`  
审计范围：工作台、教程目录、章节课堂、覆盖矩阵、滚动实验、插件实验室、性能指南

## 总体结论

review 文档中的 P0、P1、P2 主建议已经完成到可用版本：网站从“API 演示和资料库”改成了“学习路径 + 章节课堂 + 查阅和实验室”的三层结构。当前仍有一个验证限制：本地浏览器预览后期因环境提权额度限制未能继续启动，因此最后几个视觉节点只完成了类型、构建和代码级验证。

## 建议对照

| Review 建议 | 当前实现 | 证据 |
| --- | --- | --- |
| 首页增加开始/继续学习入口 | 工作台首屏新增 GSAP 入门路径、进度和课程 CTA | `src/components/coach/WorkbenchPage.tsx` |
| 推荐学习路径和进度 | 首页与教程目录都显示进度、推荐下一章和推荐实验 | `src/components/coach/WorkbenchPage.tsx`, `src/components/coach/TutorialsPage.tsx` |
| 教程页增加顺序、时间、目标、难度 | 教程目录每章显示顺序、预估时间、难度、完成状态和目标 | `src/components/coach/TutorialsPage.tsx`, `src/components/coach/tutorialMeta.ts` |
| 每章独立课程页 | 新增 `/tutorials/:chapterId` 章节课堂 | `src/App.tsx`, `src/components/coach/TutorialLessonPage.tsx` |
| 章节课堂闭环 | 章节页包含目标、核心概念、观察演示、练习、常见错误、自测、完成检查、下一步 | `src/components/coach/TutorialLessonPage.tsx`, `src/components/coach/tutorialMeta.ts` |
| API 跳转自动到详情并有反馈 | API 选择写入 `?api=`，进入工作台后滚动聚焦详情并显示打开提示 | `src/App.tsx`, `src/components/coach/WorkbenchPage.tsx` |
| 覆盖矩阵显式查看详情 | 覆盖矩阵增加查看详情按钮，行点击和按钮都能进入 API 详情 | `src/components/coach/CoveragePage.tsx` |
| 覆盖矩阵搜索和筛选 | 覆盖矩阵支持关键词、覆盖状态和 skill 分组筛选，并写入 URL | `src/components/coach/CoveragePage.tsx` |
| 从详情返回覆盖矩阵上下文 | 覆盖矩阵进入 API 详情时带 `returnTo`，详情卡可返回筛选后的矩阵 | `src/App.tsx`, `src/components/coach/ApiDetailCard.tsx` |
| 建立课程进度 | 课程完成状态使用 localStorage 读写，并过滤无效章节 | `src/components/coach/tutorialProgress.ts` |
| 章节完成徽章和记录 | 教程目录、章节页和首页显示已完成状态与进度 | `src/components/coach/TutorialsPage.tsx`, `src/components/coach/TutorialLessonPage.tsx`, `src/components/coach/WorkbenchPage.tsx` |
| 收藏 API / 代码片段 | API 详情支持收藏 API 和收藏代码，工作台显示学习收藏夹 | `src/components/coach/learningCollections.ts`, `src/components/coach/ApiDetailCard.tsx`, `src/components/coach/WorkbenchPage.tsx` |
| 小测验或选择题 | 每章有快速自测题并即时反馈 | `src/components/coach/TutorialLessonPage.tsx`, `src/components/coach/tutorialMeta.ts` |
| 常见错误案例库 | 每章有常见错误卡片 | `src/components/coach/tutorialMeta.ts` |
| 根据完成章节推荐下一步实验 | 首页和章节完成态都会推荐滚动实验、插件实验室或性能指南 | `src/components/coach/tutorialProgress.ts`, `src/components/coach/WorkbenchPage.tsx`, `src/components/coach/TutorialLessonPage.tsx` |
| 专题页串回课程 | 滚动实验、插件实验室、性能指南均有课程上下文和返回课程入口 | `src/components/coach/ScrollLabsPage.tsx`, `src/components/coach/PluginsPage.tsx`, `src/components/coach/PerformancePage.tsx` |
| 插件实验室语义修正 | 插件卡按钮改为“查看详情”，并显示推荐先学/进阶/开发专用阶段标签 | `src/components/coach/PluginsPage.tsx` |
| 性能指南补适用阶段和检查项 | 性能指南新增“动手前性能检查”面板 | `src/components/coach/PerformancePage.tsx` |
| 移动端主入口优先教程 | 顶部移动端主按钮改为教程入口 | `src/components/coach/CoachHeader.tsx` |

## 验证记录

- `bun run lint` 通过。
- `bun run build` 通过。
- `bun run build:pages` 通过。
- `git diff --check` 通过。
- 已完成的浏览器验证包含：
  - 覆盖矩阵筛选、详情跳转、返回筛选上下文。
  - 章节课堂核心概念模块。
  - 教程目录路径总览。
  - 章节完成后的推荐实验入口。
- 未完成的浏览器验证：
  - 插件实验室阶段标签的实际视觉截图。代码已将卡片标题区改为移动端纵向、稍宽屏横向，降低标签拥挤风险。
  - 性能指南检查面板的实际视觉截图。代码已为标题、检查项容器和文本列增加可收缩布局，降低窄屏文案撑宽风险。

## 剩余风险

- 后期本地 dev server 需要提权启动，但环境授权额度限制拒绝提权，因此最后两个节点没有浏览器截图。代码、类型和生产构建均已通过，主要剩余风险是最后两个节点缺少实际截图证据。
- `.github/workflows/pages.yml` 是本轮之前已经存在的工作区改动，本次改进没有修改它。
