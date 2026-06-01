const chapterDurationsById: Record<string, number> = {
  "mental-model": 10,
  sequence: 10,
  "scroll-flow": 12,
  "plugin-lab": 12,
  "utils-pipeline": 8,
  "framework-cleanup": 10,
  "performance-loop": 8,
};

const chapterDifficultyById: Record<string, LessonDifficulty> = {
  "mental-model": "beginner",
  sequence: "beginner",
  "scroll-flow": "practice",
  "plugin-lab": "practice",
  "utils-pipeline": "practice",
  "framework-cleanup": "advanced",
  "performance-loop": "advanced",
};

type LessonLocale = "zh" | "en";
export type LessonDifficulty = "beginner" | "practice" | "advanced";

interface LessonMistake {
  title: string;
  body: string;
}

interface LessonConcept {
  title: string;
  body: string;
}

interface LessonQuizOption {
  id: string;
  label: string;
  isCorrect: boolean;
  feedback: string;
}

interface LessonQuiz {
  question: string;
  options: LessonQuizOption[];
}

const chapterMistakesByLocale: Record<LessonLocale, Record<string, LessonMistake[]>> = {
  zh: {
    "mental-model": [
      { title: "把 from() 当成 to() 使用", body: "from() 会从你声明的状态动画回当前状态，初始状态不清楚时容易看起来反向。" },
      { title: "用 left/top 做位移", body: "位置动画优先用 x/y 这类 transform 别名，减少布局重排和视觉抖动。" },
    ],
    sequence: [
      { title: "用一串 delay 拼时间线", body: "复杂顺序应交给 position parameter 和 label，否则后续插入一段动画会很难维护。" },
      { title: "忽略 timeline defaults", body: "多段动画共用的 duration/ease 放进 defaults，能让节奏统一且减少重复配置。" },
    ],
    "scroll-flow": [
      { title: "把 ScrollTrigger 塞进子 tween", body: "滚动控制通常放在顶层 tween 或 timeline 上，避免多个触发器互相抢进度。" },
      { title: "布局变化后忘记 refresh", body: "动态内容、字体或图片改变高度后，需要在合适时机调用 ScrollTrigger.refresh()。" },
    ],
    "plugin-lab": [
      { title: "忘记注册插件", body: "插件使用前先在模块顶层 registerPlugin，避免运行时才发现插件能力不可用。" },
      { title: "把开发辅助带进生产路径", body: "GSDevTools、MotionPathHelper 适合调试，不应该成为用户侧功能依赖。" },
    ],
    "utils-pipeline": [
      { title: "把字符串单位直接交给数值映射", body: "mapRange、normalize 处理数字；单位应先拆分或用 unitize 在输出阶段补回。" },
      { title: "每次事件都重新创建映射函数", body: "重复使用的 clamp、pipe、snap 可以提前创建，事件里只传入最新数值。" },
    ],
    "framework-cleanup": [
      { title: "动画没有绑定组件作用域", body: "React 中用 scope 或 gsap.context 限定选择器，避免影响页面里同名元素。" },
      { title: "事件回调没有 contextSafe", body: "异步或点击回调里的动画也要进入清理上下文，否则卸载后可能留下 tween。" },
    ],
    "performance-loop": [
      { title: "高频输入里不断创建 tween", body: "鼠标跟随、拖拽等实时输入更适合 quickTo，复用同一个 tween 通道。" },
      { title: "长期保留 will-change", body: "will-change 只给即将动画的元素使用，动画结束后应减少长期占用。" },
    ],
  },
  en: {
    "mental-model": [
      { title: "Using from() like to()", body: "from() animates from the declared state back to the current state, so unclear initial state can feel reversed." },
      { title: "Animating with left/top", body: "Prefer transform aliases such as x/y for motion to reduce layout work and visual jitter." },
    ],
    sequence: [
      { title: "Chaining timing with delays", body: "Use position parameters and labels for complex order; delay chains become brittle when you insert new motion." },
      { title: "Skipping timeline defaults", body: "Shared duration and easing belong in defaults so the sequence stays consistent and less repetitive." },
    ],
    "scroll-flow": [
      { title: "Putting ScrollTrigger on child tweens", body: "Scroll control usually belongs on the top-level tween or timeline to avoid competing progress sources." },
      { title: "Forgetting refresh after layout changes", body: "Dynamic content, fonts, or images can change height; refresh ScrollTrigger at the right time." },
    ],
    "plugin-lab": [
      { title: "Forgetting plugin registration", body: "Register plugins at module scope before use so plugin features are available when animations run." },
      { title: "Shipping developer helpers", body: "GSDevTools and MotionPathHelper are for debugging and should not become user-facing dependencies." },
    ],
    "utils-pipeline": [
      { title: "Passing units into numeric mapping", body: "mapRange and normalize work on numbers; split units first or add them back with unitize." },
      { title: "Recreating mapping functions per event", body: "Reusable clamp, pipe, and snap functions can be created once and called with fresh values." },
    ],
    "framework-cleanup": [
      { title: "Animation without component scope", body: "Use scope or gsap.context in React so selectors do not affect matching elements elsewhere." },
      { title: "Callbacks outside contextSafe", body: "Animations created in async or click callbacks also need cleanup context after unmount." },
    ],
    "performance-loop": [
      { title: "Creating tweens in high-frequency input", body: "Pointer follow and dragging are better with quickTo, reusing a single tween channel." },
      { title: "Leaving will-change on forever", body: "Use will-change only for elements that are about to animate, then avoid long-term memory pressure." },
    ],
  },
};

const chapterConceptsByLocale: Record<LessonLocale, Record<string, LessonConcept[]>> = {
  zh: {
    "mental-model": [
      { title: "Tween 是状态之间的补间", body: "先确定元素现在在哪里，再用 vars 描述它要去哪里，GSAP 会负责中间每一帧。" },
      { title: "targets 和 vars 要分开理解", body: "targets 决定动画作用对象，vars 决定属性、时长、缓动和生命周期回调。" },
      { title: "控制权来自返回的实例", body: "保存 tween 后才能 pause、reverse、restart，让动画从一次性效果变成可控交互。" },
    ],
    sequence: [
      { title: "Timeline 是时间容器", body: "把多个 tween 放进同一条时间轴，顺序、重叠和复用都会更稳定。" },
      { title: "position parameter 表达关系", body: "用 <、>、+=、label 表达相对时机，避免用一串 delay 拼凑节奏。" },
      { title: "defaults 管住整体节奏", body: "把共用的 duration、ease 放到 timeline defaults，局部段落只写差异。" },
    ],
    "scroll-flow": [
      { title: "滚动位置驱动动画进度", body: "ScrollTrigger 把 start/end 区间映射到动画播放状态，用户滚动就是时间轴输入。" },
      { title: "pin 和 scrub 解决不同问题", body: "pin 用来固定叙事区域，scrub 用来让滚动和动画进度同步。" },
      { title: "布局变化后要重新测量", body: "图片、字体或动态内容改变高度时，需要 refresh 让触发区间重新计算。" },
    ],
    "plugin-lab": [
      { title: "插件先注册再使用", body: "registerPlugin 是插件能力进入 GSAP 运行时的前置步骤，通常放在模块初始化处。" },
      { title: "不同插件解决不同维度", body: "Flip 处理布局状态，Draggable 处理输入，SplitText 处理文本拆分，不要混成同一种工具。" },
      { title: "调试插件不等于产品依赖", body: "GSDevTools、MotionPathHelper 更适合开发阶段，交付前要确认是否需要保留。" },
    ],
    "utils-pipeline": [
      { title: "utils 是数值加工管线", body: "clamp、normalize、mapRange、snap 可以把原始输入变成动画真正需要的值。" },
      { title: "先算数字，最后补单位", body: "映射阶段优先处理 number，输出到 CSS 时再用 unitize 或字符串模板补单位。" },
      { title: "高频场景要复用函数", body: "事件循环里重复创建工具函数会浪费成本，稳定映射可以提前创建。" },
    ],
    "framework-cleanup": [
      { title: "组件生命周期决定动画边界", body: "React 中动画要跟组件挂载和卸载同步，避免卸载后还在修改 DOM。" },
      { title: "scope 让选择器更安全", body: "把选择器限定在当前组件内部，避免页面其它同名元素被误选。" },
      { title: "contextSafe 覆盖延迟回调", body: "点击、异步和定时器里的动画也需要进入清理上下文。" },
    ],
    "performance-loop": [
      { title: "优先动画合成属性", body: "transform 和 opacity 通常更容易保持流畅，left/top 等布局属性会带来额外计算。" },
      { title: "高频输入复用通道", body: "quickTo 适合鼠标跟随、拖拽等连续输入，避免每次事件都新建 tween。" },
      { title: "性能优化要可撤回", body: "will-change、ScrollTrigger 刷新和清理策略都应服务于当前动画，而不是永久开启。" },
    ],
  },
  en: {
    "mental-model": [
      { title: "A tween interpolates between states", body: "Identify where the element is now, then describe where it should go; GSAP fills in every frame between them." },
      { title: "Separate targets from vars", body: "Targets choose what moves; vars define properties, duration, easing, and lifecycle callbacks." },
      { title: "Control comes from the returned instance", body: "Store the tween if you want pause, reverse, or restart instead of a one-off effect." },
    ],
    sequence: [
      { title: "A timeline is a time container", body: "Put multiple tweens on one timeline so order, overlap, and reuse stay predictable." },
      { title: "Position parameters express relationships", body: "Use <, >, +=, and labels for relative timing instead of building rhythm from delay chains." },
      { title: "Defaults control the whole rhythm", body: "Put shared duration and easing into timeline defaults, then write only local differences." },
    ],
    "scroll-flow": [
      { title: "Scroll position drives animation progress", body: "ScrollTrigger maps start/end ranges to animation state, so user scroll becomes timeline input." },
      { title: "Pin and scrub solve different jobs", body: "Pin holds the narrative section; scrub synchronizes scroll position with animation progress." },
      { title: "Layout changes need re-measurement", body: "Images, fonts, or dynamic content can change height, so refresh recalculates trigger ranges." },
    ],
    "plugin-lab": [
      { title: "Register plugins before use", body: "registerPlugin makes plugin features available to the GSAP runtime, usually during module setup." },
      { title: "Plugins solve different dimensions", body: "Flip handles layout state, Draggable handles input, and SplitText handles text segmentation." },
      { title: "Debug helpers are not product dependencies", body: "GSDevTools and MotionPathHelper fit development workflows; confirm whether they should ship." },
    ],
    "utils-pipeline": [
      { title: "Utils are numeric pipelines", body: "clamp, normalize, mapRange, and snap turn raw input into values animations can consume." },
      { title: "Calculate numbers, add units last", body: "Prefer numbers during mapping, then add CSS units with unitize or template strings at output." },
      { title: "Reuse functions in high-frequency paths", body: "Do not recreate mapping helpers inside every event tick when a stable function can be reused." },
    ],
    "framework-cleanup": [
      { title: "Component lifecycle defines animation boundaries", body: "In React, animations need to match mount and unmount so they stop touching removed DOM." },
      { title: "Scope makes selectors safer", body: "Limit selectors to the current component so matching elements elsewhere are not affected." },
      { title: "contextSafe covers delayed callbacks", body: "Animations in clicks, async work, or timers should also enter the cleanup context." },
    ],
    "performance-loop": [
      { title: "Prefer composited properties", body: "transform and opacity are usually smoother; layout properties like left/top add extra work." },
      { title: "Reuse channels for high-frequency input", body: "quickTo fits pointer follow and dragging because it avoids creating a new tween on every event." },
      { title: "Performance changes should be reversible", body: "will-change, ScrollTrigger refresh, and cleanup strategy should serve the current animation, not stay on forever." },
    ],
  },
};

const chapterQuizByLocale: Record<LessonLocale, Record<string, LessonQuiz>> = {
  zh: {
    "mental-model": {
      question: "你想把元素从当前位置移动到 x: 160，最直接应该使用哪个入口？",
      options: [
        { id: "to", label: "gsap.to(target, { x: 160 })", isCorrect: true, feedback: "正确。to() 表示从当前状态补间到目标状态。" },
        { id: "from", label: "gsap.from(target, { x: 160 })", isCorrect: false, feedback: "from() 会从 x: 160 回到当前状态，不是这个目标。" },
      ],
    },
    sequence: {
      question: "多段动画需要同步和错开时，最适合用什么表达相对时机？",
      options: [
        { id: "position", label: "position parameter / label", isCorrect: true, feedback: "正确。它能表达同步、错开和跳到标签。" },
        { id: "delay", label: "给每段都手写 delay", isCorrect: false, feedback: "delay 能用，但复杂序列会很难维护。" },
      ],
    },
    "scroll-flow": {
      question: "动态内容改变页面高度后，ScrollTrigger 通常需要做什么？",
      options: [
        { id: "refresh", label: "调用 ScrollTrigger.refresh()", isCorrect: true, feedback: "正确。刷新后触发器会重新计算 start/end。" },
        { id: "repeat", label: "给动画加 repeat: -1", isCorrect: false, feedback: "repeat 改变播放次数，不能修正滚动区间。" },
      ],
    },
    "plugin-lab": {
      question: "使用 Draggable、Flip、SplitText 前，最先应该确认什么？",
      options: [
        { id: "register", label: "插件已经 registerPlugin", isCorrect: true, feedback: "正确。插件注册是使用插件能力的前置条件。" },
        { id: "duration", label: "所有 tween 都设置 duration", isCorrect: false, feedback: "duration 重要，但不能替代插件注册。" },
      ],
    },
    "utils-pipeline": {
      question: "需要把 0-1 的进度映射到 0-360 度时，优先使用哪个工具？",
      options: [
        { id: "map", label: "gsap.utils.mapRange()", isCorrect: true, feedback: "正确。mapRange 专门负责数值区间映射。" },
        { id: "selector", label: "gsap.utils.selector()", isCorrect: false, feedback: "selector 用来限定 DOM 查询范围，不负责数值映射。" },
      ],
    },
    "framework-cleanup": {
      question: "React 组件卸载时，GSAP 动画最应该做到什么？",
      options: [
        { id: "revert", label: "revert 清理作用域内动画", isCorrect: true, feedback: "正确。清理能避免卸载后动画继续影响 DOM。" },
        { id: "reload", label: "刷新整个页面", isCorrect: false, feedback: "刷新页面不是组件级清理策略。" },
      ],
    },
    "performance-loop": {
      question: "鼠标跟随这类高频输入，哪个 API 更适合复用动画通道？",
      options: [
        { id: "quick-to", label: "gsap.quickTo()", isCorrect: true, feedback: "正确。quickTo 适合高频更新同一属性。" },
        { id: "timeline", label: "每次 pointermove 新建 timeline", isCorrect: false, feedback: "高频新建 timeline 会增加额外开销。" },
      ],
    },
  },
  en: {
    "mental-model": {
      question: "You want to move an element from its current position to x: 160. Which entry is the most direct?",
      options: [
        { id: "to", label: "gsap.to(target, { x: 160 })", isCorrect: true, feedback: "Correct. to() tweens from the current state to the target state." },
        { id: "from", label: "gsap.from(target, { x: 160 })", isCorrect: false, feedback: "from() would animate from x: 160 back to the current state." },
      ],
    },
    sequence: {
      question: "When multiple animation segments need sync and offsets, what best expresses relative timing?",
      options: [
        { id: "position", label: "position parameter / label", isCorrect: true, feedback: "Correct. It expresses sync, offsets, and label jumps." },
        { id: "delay", label: "Hand-written delay on every tween", isCorrect: false, feedback: "delay works in small cases, but complex sequences become hard to maintain." },
      ],
    },
    "scroll-flow": {
      question: "After dynamic content changes page height, what does ScrollTrigger usually need?",
      options: [
        { id: "refresh", label: "Call ScrollTrigger.refresh()", isCorrect: true, feedback: "Correct. Refresh recalculates trigger start and end positions." },
        { id: "repeat", label: "Add repeat: -1", isCorrect: false, feedback: "repeat changes playback count, not scroll ranges." },
      ],
    },
    "plugin-lab": {
      question: "Before using Draggable, Flip, or SplitText, what should you confirm first?",
      options: [
        { id: "register", label: "The plugin is registered", isCorrect: true, feedback: "Correct. Registration enables plugin features." },
        { id: "duration", label: "Every tween has duration", isCorrect: false, feedback: "duration matters, but it does not replace plugin registration." },
      ],
    },
    "utils-pipeline": {
      question: "Which utility maps a 0-1 progress value into 0-360 degrees?",
      options: [
        { id: "map", label: "gsap.utils.mapRange()", isCorrect: true, feedback: "Correct. mapRange maps numeric ranges." },
        { id: "selector", label: "gsap.utils.selector()", isCorrect: false, feedback: "selector scopes DOM queries; it does not map numbers." },
      ],
    },
    "framework-cleanup": {
      question: "When a React component unmounts, what should GSAP animations do?",
      options: [
        { id: "revert", label: "Revert animations in scope", isCorrect: true, feedback: "Correct. Cleanup prevents animations from affecting unmounted DOM." },
        { id: "reload", label: "Reload the whole page", isCorrect: false, feedback: "Page reload is not a component-level cleanup strategy." },
      ],
    },
    "performance-loop": {
      question: "For pointer-follow style high-frequency input, which API best reuses an animation channel?",
      options: [
        { id: "quick-to", label: "gsap.quickTo()", isCorrect: true, feedback: "Correct. quickTo is designed for frequent updates to the same property." },
        { id: "timeline", label: "Create a new timeline on every pointermove", isCorrect: false, feedback: "Creating timelines per pointermove adds unnecessary overhead." },
      ],
    },
  },
};

/** 按章节 id 返回课程预计耗时，避免目录重排后时长错位。 */
export function getChapterDurationMinutes(chapterId: string) {
  return chapterDurationsById[chapterId] ?? 10;
}

/** 返回当前章节难度，用于帮助学习者判断每一节的进入门槛。 */
export function getChapterDifficulty(chapterId: string) {
  return chapterDifficultyById[chapterId] ?? "beginner";
}

/** 汇总基础路径总时长，避免目录页和章节元数据出现不一致。 */
export function getTotalChapterDurationMinutes(chapterIds: string[]) {
  return chapterIds.reduce((totalMinutes, chapterId) => totalMinutes + getChapterDurationMinutes(chapterId), 0);
}

/** 返回当前章节的常见错误案例，用于把抽象规则转成可检查的反例。 */
export function getChapterMistakes(chapterId: string, locale: LessonLocale) {
  return chapterMistakesByLocale[locale][chapterId] ?? chapterMistakesByLocale.zh["mental-model"];
}

/** 返回当前章节的核心概念，用于在动手练习前先建立学习心智模型。 */
export function getChapterConcepts(chapterId: string, locale: LessonLocale) {
  return chapterConceptsByLocale[locale][chapterId] ?? chapterConceptsByLocale.zh["mental-model"];
}

/** 返回当前章节自测题；题目只做即时反馈，不阻塞课程完成。 */
export function getChapterQuiz(chapterId: string, locale: LessonLocale) {
  return chapterQuizByLocale[locale][chapterId] ?? chapterQuizByLocale.zh["mental-model"];
}
