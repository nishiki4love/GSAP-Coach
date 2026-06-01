import { tutorialChapters } from "@/data/gsapApiCatalog";

export const tutorialProgressStorageKey = "gsap-coach:tutorial-progress";

export type RecommendedExperimentId = "scroll-labs" | "plugins" | "performance";

const tutorialChapterIds = new Set(tutorialChapters.map((chapter) => chapter.id));
const experimentByChapterId: Partial<Record<string, RecommendedExperimentId>> = {
  "scroll-flow": "scroll-labs",
  "plugin-lab": "plugins",
  "performance-loop": "performance",
};

/** 从本地存储读取已完成章节，并过滤掉旧版本中可能残留的无效章节 id。 */
export function readCompletedTutorialIds() {
  if (typeof window === "undefined") return [];

  try {
    const storedValue = window.localStorage.getItem(tutorialProgressStorageKey);
    const parsedValue = storedValue ? JSON.parse(storedValue) : [];

    if (!Array.isArray(parsedValue)) return [];

    const validChapterIds = parsedValue.filter((chapterId): chapterId is string => (
      typeof chapterId === "string" && tutorialChapterIds.has(chapterId)
    ));

    return [...new Set(validChapterIds)];
  } catch {
    return [];
  }
}

/** 保存课程完成进度；写入失败时保留内存状态，让本次访问仍可继续使用。 */
export function writeCompletedTutorialIds(chapterIds: string[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(tutorialProgressStorageKey, JSON.stringify(chapterIds));
  } catch {
    // localStorage 可能因隐私模式或配额限制失败，此处不阻断课堂操作。
  }
}

/** 找到第一个未完成章节，全部完成后返回最后一章用于复习入口。 */
export function getNextTutorialChapterId(completedChapterIds: string[]) {
  const completedSet = new Set(completedChapterIds);
  const nextChapter = tutorialChapters.find((chapter) => !completedSet.has(chapter.id));

  return nextChapter?.id ?? tutorialChapters[tutorialChapters.length - 1]?.id ?? "mental-model";
}

/** 根据已完成章节推荐专题实验，帮助用户把课程知识迁移到真实场景。 */
export function getRecommendedExperimentId(completedChapterIds: string[]): RecommendedExperimentId | null {
  const completedSet = new Set(completedChapterIds);

  if (completedSet.has("performance-loop")) return "performance";
  if (completedSet.has("plugin-lab")) return "plugins";
  if (completedSet.has("scroll-flow")) return "scroll-labs";

  return null;
}

/** 返回单个章节完成后最适合衔接的专题实验；没有专题延伸时返回空。 */
export function getChapterExperimentRecommendation(chapterId: string): RecommendedExperimentId | null {
  return experimentByChapterId[chapterId] ?? null;
}
