import { apiItems } from "@/data/gsapApiCatalog";

export const favoriteApisStorageKey = "gsap-coach:favorite-apis";
export const favoriteSnippetsStorageKey = "gsap-coach:favorite-snippets";

const validApiIds = new Set(apiItems.map((api) => api.id));

/** 读取收藏列表，并过滤旧版本或手动改写 localStorage 后留下的无效 API id。 */
function readFavoriteIds(storageKey: string) {
  if (typeof window === "undefined") return [];

  try {
    const storedValue = window.localStorage.getItem(storageKey);
    const parsedValue = storedValue ? JSON.parse(storedValue) : [];

    if (!Array.isArray(parsedValue)) return [];

    const validIds = parsedValue.filter((apiId): apiId is string => (
      typeof apiId === "string" && validApiIds.has(apiId)
    ));

    return [...new Set(validIds)];
  } catch {
    return [];
  }
}

/** 写入收藏列表；失败时不阻断当前页面操作，只放弃本次持久化。 */
function writeFavoriteIds(storageKey: string, apiIds: string[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(apiIds));
  } catch {
    // localStorage 可能因隐私模式或配额限制失败，此处不影响收藏按钮的本次内存状态。
  }
}

/** 读取 API 收藏。 */
export function readFavoriteApiIds() {
  return readFavoriteIds(favoriteApisStorageKey);
}

/** 保存 API 收藏。 */
export function writeFavoriteApiIds(apiIds: string[]) {
  writeFavoriteIds(favoriteApisStorageKey, apiIds);
}

/** 读取代码片段收藏。 */
export function readFavoriteSnippetIds() {
  return readFavoriteIds(favoriteSnippetsStorageKey);
}

/** 保存代码片段收藏。 */
export function writeFavoriteSnippetIds(apiIds: string[]) {
  writeFavoriteIds(favoriteSnippetsStorageKey, apiIds);
}
