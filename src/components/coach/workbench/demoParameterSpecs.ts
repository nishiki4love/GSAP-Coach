import type { ApiItem } from "@/data/gsapApiCatalog";
import { booleanParam, numberParam, stringParam, type DemoParameterValues } from "./demoParameterControls";

export interface DemoParameterSpec {
  initial: string[];
  target: string[];
}

const specByApiId: Record<string, DemoParameterSpec> = {
  "gsap-to": { initial: ["x: 0", "y: 0", "rotation: 0", "backgroundColor: card"], target: ["x: 250", "y: 58", "rotation: '360_cw'", "backgroundColor: '#a8ff04'"] },
  "gsap-from": { initial: ["x: -40", "y: -24", "autoAlpha: 0", "scale: 0.72"], target: ["x: 210", "y: 48", "autoAlpha: 1", "scale: 1"] },
  "gsap-fromto": { initial: ["box.x: 0", "box.scale: 0.72", "box.autoAlpha: 0.2", "drawSVG: '0% 0%'"], target: ["box.x: 250", "box.scale: 1.12", "box.rotation: 18", "drawSVG: '0% 100%'"] },
  "gsap-set": { initial: ["set x: 150", "set y: 44", "set rotation: -10", "set backgroundColor: '#19bfe8'"], target: ["dot.scale: 1.45", "stagger.each: 0.03", "rotation: 0", "clearProps: 'backgroundColor'"] },
  "core-vars": { initial: ["x: 0", "repeat: 0", "delay: 0", "overwrite: default"], target: ["x: 230", "delay: 0.12", "repeat: 1", "yoyo: true"] },
  "immediate-render": { initial: ["from #1 x: -80", "from #1 autoAlpha: 0", "from #2 y: 80"], target: ["x: 0", "y: 0", "rotation: 16", "immediateRender: false"] },
  "transform-aliases": { initial: ["xPercent: 0", "y: 0", "scale: 1", "rotationY: 0"], target: ["xPercent: 18", "y: -12", "scale: 1.14", "rotationY: 24"] },
  "transform-origin": { initial: ["transformOrigin: 'left center'", "rotation: 0", "x: 0"], target: ["rotation: 65", "x: 110", "pivot: left center"] },
  "auto-alpha": { initial: ["dot.autoAlpha: 1", "dot.visibility: inherit"], target: ["autoAlpha: 0", "then autoAlpha: 1", "stagger: 0.035"] },
  "css-vars": { initial: ["--stage-hue: 92", "--stage-glow: 0.18", "box.x: 0"], target: ["--stage-hue: 148", "--stage-glow: 0.48", "box.x: 190"] },
  "svg-origin": { initial: ["rotation: 0", "svgOrigin: '120 72'"], target: ["rotation: '+=220_cw'", "svgOrigin: '120 72'"] },
  "directional-rotation": { initial: ["x: 0", "rotation: 0"], target: ["x: 160", "rotation: '-170_short'", "then '+=120_cw'", "then '-=80_ccw'"] },
  "clear-props": { initial: ["x: 0", "scale: 1", "backgroundColor: card"], target: ["x: 0", "scale: 1", "clearProps: 'backgroundColor,transform'"] },
  targets: { initial: ["targets: NodeList(.pulse-dot)", "y: 0"], target: ["y: -18", "stagger: 0.035"] },
  stagger: { initial: ["scale: 0.4", "y: 18", "from: center"], target: ["scale: 1.2", "y: -18", "stagger.each: 0.04", "repeat: 1, yoyo: true"] },
  eases: { initial: ["x: 0", "ease: default"], target: ["x: 100 back.out(1.7)", "x: 210 elastic.out(1,0.3)", "x: 60 coach-snap"] },
  "tween-control": { initial: ["progress: 0", "x: 0", "rotation: 0"], target: ["x: 230", "rotation: 180", "repeat: 1", "yoyo: true"] },
  "function-values": { initial: ["dot.x: 0", "dot.y: 0", "index: 0...12"], target: ["x: index * 8", "y: odd ? -22 : 18", "stagger: 0.025"] },
  "relative-values": { initial: ["x: current", "rotation: current"], target: ["x: '+=90' then '+=70'", "rotation: '+=45_cw' then '-=30_ccw'"] },
  "gsap-defaults": { initial: ["global duration: 0.55", "global ease: power2.out"], target: ["duration: 0.42", "ease: back.out(1.7)", "then restore defaults"] },
  "match-media": { initial: ["x: 0", "media query unresolved"], target: ["desktop x: 250", "mobile x: 120", "reduceMotion duration: 0"] },
  "match-media-refresh": { initial: ["registered media handlers", "x: 0"], target: ["gsap.matchMediaRefresh()", "x: 150", "rotation: 8"] },
  "timeline-create": { initial: ["tl.progress: 0", "x: 0", "y: 0", "rotation: 0"], target: ["x: 100", "y: 56", "scale: 1.12", "rotation: 18"] },
  "timeline-chain": { initial: ["box.x: 0", "dot.y: 0", "motionDot.x: 0"], target: ["box.x: 120", "dot.y: -18", "motionDot.x: 260", "position: '<' / '+=0.1'"] },
  "position-parameter": { initial: ["box.x: 0", "box.y: 0", "dot.scale: 1"], target: ["box.x: 160 at 0", "dot.scale: 1.4 at '<0.12'", "box.y: 58 at '+=0.2'"] },
  "timeline-labels": { initial: ["label intro: 0", "x: 0", "scale: 1"], target: ["focus x: 220", "scale: 1.14", "outro dot.y: -16"] },
  "timeline-nesting": { initial: ["child tl x: 0", "master tl progress: 0"], target: ["child x: 86 y: -12", "master x: 230 y: 58", "scale: 1.12"] },
  "timeline-control": { initial: ["progress: 0", "x: 0", "rotation: 0"], target: ["x: 230", "rotation: 180", "repeat: 1", "yoyo: true"] },
  "register-scrolltrigger": { initial: ["drawSVG: '0% 0%'", "box.x: 0", "ease: none"], target: ["drawSVG: '0% 100%'", "box.x: 250", "simulated scrub progress: 1"] },
  "scroll-trigger-config": { initial: ["start: top 70%", "drawSVG: '0% 0%'", "box.x: 0"], target: ["end: bottom 30%", "drawSVG: '0% 100%'", "box.x: 250", "scrub: true"] },
  "scroll-callbacks": { initial: ["trigger outside viewport", "box.x: 0"], target: ["onEnter x: 120", "onUpdate x: 230", "status updated"] },
  "scroll-create": { initial: ["ScrollTrigger.create()", "toggle state: false", "box.x: 0"], target: ["onEnter x: 120", "onUpdate x: 230", "toggle state: true"] },
  "scroll-batch": { initial: ["row.y: 28", "row.autoAlpha: 0", "batchMax: demo dots"], target: ["row.y: 0", "row.autoAlpha: 1", "stagger.each: 0.05"] },
  "container-animation": { initial: ["motionPath progress: 0", "nested box.y: 0", "ease: none"], target: ["motionPath progress: 1", "nested box.y: -36", "containerAnimation: scrollTween"] },
  "scroll-refresh-kill": { initial: ["drawSVG: '0% 100%'", "active triggers: current page"], target: ["ScrollTrigger.refresh()", "drawSVG: '30% 70%' -> '0% 100%'", "cleanup intent: kill by id/list"] },
  "scroller-proxy": { initial: ["smooth scroller owns scrollTop", "ScrollTrigger reads native scroll"], target: ["scrollTop(value) proxy", "getBoundingClientRect()", "smooth.addListener(update)"] },
  "register-plugin": { initial: ["plugin registry ready", "title.y: 0", "box.x: 0"], target: ["title.y: -6", "title.color: '#6fb936'", "box.x: 120"] },
  "scroll-to": { initial: ["motionDot.x: 0", "box.x: 0"], target: ["motionDot.x: 280", "box.x: 180", "ease: power2.inOut"] },
  "scroll-smoother": { initial: ["wrapper: #smooth-wrapper", "content: #smooth-content", "smooth: unset"], target: ["ScrollSmoother.create()", "smooth: configured", "content drives ScrollTrigger"] },
  flip: { initial: ["Flip.getState(.core-box)", "x: 0", "y: 0", "scale: 1"], target: ["x: 230", "y: 60", "scale: 1.18", "Flip.from(state)"] },
  draggable: { initial: ["x: 0", "y: 0", "scale: 1", "bounds: stage"], target: ["x: 120", "y: 22", "scale: 1.08", "then drag manually"] },
  inertia: { initial: ["x: 0", "y: 0", "tracked velocity: 0"], target: ["x.velocity: 360 end: 250", "y.velocity: 90 end: 45", "duration: 1.05"] },
  observer: { initial: ["x: 0", "rotation: 0", "direction: idle"], target: ["x: 170", "rotation: 8", "wheel/touch/pointer direction updates"] },
  "split-text": { initial: ["chars.y: 26", "chars.autoAlpha: 0", "mask: words"], target: ["chars.y: 0", "chars.autoAlpha: 1", "stagger: 0.018"] },
  "scramble-text": { initial: ["status text: current", "chars: GSAP01", "revealDelay: 0.15"], target: ["text: 插件已激活", "duration: 0.9"] },
  "draw-svg": { initial: ["drawSVG: '0% 0%'", "stroke visible length: 0"], target: ["drawSVG: '0% 100%'", "stroke visible length: full path"] },
  "morph-svg": { initial: ["shape: #morph-start", "path: triangle"], target: ["shape: #morph-target", "type: rotational", "shapeIndex: 1"] },
  "morph-svg-utils": { initial: ["input: SVG shape/path", "rawPath: source data"], target: ["convertToPath()", "stringToRawPath()", "rawPathToString()"] },
  "motion-path": { initial: ["path progress: 0", "align: #motion-path", "autoRotate: true"], target: ["path progress: 1", "alignOrigin: [0.5, 0.5]", "duration: 1.15"] },
  "motion-path-helper": { initial: ["path progress: 0", "helper: dev-only"], target: ["path progress: 1", "runtime shows path target only"] },
  "custom-ease": { initial: ["x: 0", "ease: default"], target: ["x: 100 back.out", "x: 210 elastic.out", "x: 60 coach-snap"] },
  "ease-pack": { initial: ["ease: built-in default", "x: 0"], target: ["SlowMo / RoughEase / ExpoScaleEase", "selected ease drives x: 120"] },
  "custom-wiggle": { initial: ["rotation: 0", "ease: coach-wiggle"], target: ["rotation: 12", "wiggles: 6", "type: easeOut"] },
  "custom-bounce": { initial: ["ball.y: 0", "ease: default"], target: ["ball.y: -90", "then y: 0", "ease: coach-bounce"] },
  "physics-2d": { initial: ["x: 0", "y: 0", "velocity: 250", "angle: 70"], target: ["gravity: 460", "duration: 1.15", "ease: none"] },
  "physics-props": { initial: ["x: 0", "rotation: 0"], target: ["x.velocity: 120 end: 230", "rotation.velocity: 180 acceleration: -60"] },
  "gs-devtools": { initial: ["timeline: tl", "debug UI: not mounted"], target: ["GSDevTools.create({ animation: tl })", "dev-only, not shipped"] },
  "pixi-plugin": { initial: ["sprite.x: 0", "sprite.y: 0", "pixi runtime: external"], target: ["pixi.x: 200", "pixi.y: 100", "pixi.scale: 1.5"] },
  "utils-clamp": { initial: ["raw: 65", "range: 0..100"], target: ["clamped: 65", "box.x: 130"] },
  "utils-map-range": { initial: ["input: 65", "in: 0..1", "out: 0..360"], target: ["mapped: 234", "box.x: 194", "rotation: +=210_cw"] },
  "utils-normalize": { initial: ["input: 65", "range: 0..100"], target: ["normalized: 0.65", "mapped angle: 234"] },
  "utils-interpolate": { initial: ["start: #f6b63d", "end: #19bfe8", "progress: 0.65"], target: ["color: interpolated", "dot.backgroundColor: result"] },
  "utils-random": { initial: ["raw: random(-40,140,5)", "snap increment: 5"], target: ["clamp -> normalize -> mapRange", "box.x and rotation derived from random raw"] },
  "utils-snap": { initial: ["mapped angle: 234", "snap increment: 15"], target: ["snapped: 240", "rotation uses snapped pipeline"] },
  "utils-shuffle": { initial: ["dot order: 0..12", "y: 0"], target: ["shuffled order", "stagger delay: index * 0.02"] },
  "utils-distribute": { initial: ["dot.y: 0", "from: center", "grid: auto"], target: ["y: distribute(-8..8)", "ease: power1.inOut"] },
  "utils-get-unit": { initial: ["value: '42px'", "raw input: 65"], target: ["unit: 'px'", "unitized: '65px'"] },
  "utils-unitize": { initial: ["value: 65", "unit: px"], target: ["unitized: '65px'", "displayed as output value"] },
  "utils-split-color": { initial: ["color: interpolated hex", "returnHSL: true"], target: ["colorHsl: h/s/l channels", "dot.backgroundColor: color"] },
  "utils-selector": { initial: ["scope: rootRef", "selector: '.pulse-dot'"], target: ["targets: scoped pulse dots only", "dot.y: -12"] },
  "utils-to-array": { initial: ["selector/NodeList", "array length: 13"], target: ["Array<HTMLElement>", "y: -18", "stagger: 0.035"] },
  "utils-pipe": { initial: ["raw: 65", "pipe: normalize -> mapRange -> snap"], target: ["piped angle: 210", "rotation: +=210_cw"] },
  "utils-wrap": { initial: ["mapped: 234", "range: -40..240"], target: ["wrapped x: 194", "rotation: +=210_cw"] },
  "utils-wrap-yoyo": { initial: ["raw + 70: 135", "range: 0..100"], target: ["yoyo value: 65", "rotation uses yoyo value"] },
  "use-gsap": { initial: ["component mounted", "scope: container", "animation context empty"], target: ["useGSAP callback creates tween", "cleanup: automatic revert"] },
  "context-safe": { initial: ["event callback outside render", "context not yet recording"], target: ["contextSafe(callback)", "created tween joins cleanup context"] },
  "gsap-context": { initial: ["ctx = gsap.context(callback, scope)", "mounted DOM"], target: ["ctx.revert()", "inline styles and ScrollTriggers cleaned"] },
  "vue-lifecycle": { initial: ["onMounted", "scope: component root"], target: ["animation created", "onUnmounted -> ctx.revert()"] },
  "nuxt-lazy-plugin": { initial: ["plugin not loaded", "client-side composable ready"], target: ["lazyLoadPlugin('SplitText')", "plugin registered on demand"] },
  "svelte-on-mount": { initial: ["onMount", "container bound"], target: ["ctx created", "return cleanup -> ctx.revert()"] },
  "perf-transform-opacity": { initial: ["xPercent: 0", "y: 0", "scale: 1", "autoAlpha: 1"], target: ["xPercent: 18", "y: -12", "scale: 1.14", "autoAlpha: 0.9"] },
  "perf-will-change": { initial: ["willChange: unset", "input value: 65"], target: ["willChange: transform", "animated transform values only"] },
  "perf-batch": { initial: ["items.y: 28", "items.autoAlpha: 0"], target: ["items.y: 0", "items.autoAlpha: 1", "stagger.each: 0.05"] },
  "quick-to": { initial: ["quickTo channel: reusable", "raw input: 65"], target: ["box.x: wrapped mapped value", "ease: power3.out", "no new tween per input"] },
};

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

function px(value: number) {
  return `${formatNumber(value)}px`;
}

function deg(value: number) {
  return `${formatNumber(value)}deg`;
}

function sec(value: number) {
  return `${formatNumber(value)}s`;
}

function percent(value: number) {
  return `${formatNumber(value)}%`;
}

function baseSpec(api: ApiItem): DemoParameterSpec {
  return specByApiId[api.id] ?? {
    initial: ["scene: clean canvas", `api: ${api.name}`, "progress: 0"],
    target: ["scene: closest visual cue", "progress: 1", `snippet: ${api.signature}`],
  };
}

function getDynamicParameterSpec(api: ApiItem, values: DemoParameterValues): DemoParameterSpec {
  const x = numberParam(values, "x", 220);
  const y = numberParam(values, "y", 42);
  const rotation = numberParam(values, "rotation", 180);
  const scale = numberParam(values, "scale", 1.12);
  const duration = numberParam(values, "duration", 0.55);
  const stagger = numberParam(values, "stagger", 0.035);
  const velocity = numberParam(values, "velocity", 250);
  const angle = numberParam(values, "angle", 70);
  const gravity = numberParam(values, "gravity", 460);
  const drawEnd = numberParam(values, "drawEnd", 100);
  const raw = numberParam(values, "raw", 65);
  const ease = stringParam(values, "ease", "power2.out");
  const autoRotate = booleanParam(values, "autoRotate", true);

  switch (api.id) {
    case "gsap-to":
      return { initial: ["x: 0", "y: 0", "rotation: 0", "scale: 1"], target: [`x: ${px(x)}`, `y: ${px(y)}`, `rotation: '${formatNumber(rotation)}_cw'`, `scale: ${formatNumber(scale)}`, `duration: ${sec(duration)}`, `ease: ${ease}`] };
    case "gsap-from":
      return { initial: ["x: -40px", "y: -24px", "autoAlpha: 0", `scale: ${formatNumber(Math.min(scale, 0.9))}`], target: [`x: ${px(x)}`, `y: ${px(y)}`, "autoAlpha: 1", "layout position restored", `duration: ${sec(duration)}`] };
    case "gsap-fromto":
      return { initial: ["box.x: 0px", "box.scale: 0.72", "box.autoAlpha: 0.2", "drawSVG: '0% 0%'"], target: [`box.x: ${px(x)}`, `box.y: ${px(y)}`, `box.scale: ${formatNumber(scale)}`, `box.rotation: ${deg(rotation)}`, `drawSVG: '0% ${percent(drawEnd)}'`] };
    case "gsap-set":
      return { initial: [`set x: ${px(x * 0.68)}`, `set y: ${px(y)}`, "set rotation: -10deg", "set backgroundColor: '#19bfe8'"], target: [`dot.scale: ${formatNumber(scale + 0.33)}`, `stagger.each: ${sec(stagger)}`, "box.rotation: 0", "clearProps: 'backgroundColor'"] };
    case "core-vars":
      return { initial: ["x: 0px", "y: 0px", "repeat: 0", "overwrite: default"], target: [`x: ${px(x)}`, `y: ${px(y)}`, "delay: 0.12s", "repeat: 1", "yoyo: true", `ease: ${ease}`] };
    case "immediate-render":
      return { initial: ["from #1 x: -80px", "from #1 autoAlpha: 0", "from #2 y: 80px"], target: ["x: 0px", "y: 0px", "rotation: 16deg", "immediateRender: false"] };
    case "transform-aliases":
    case "perf-transform-opacity":
      return { initial: ["x: 0px", "y: 0px", "scale: 1", "rotationY: 0deg"], target: [`x: ${px(x)}`, `y: ${px(y)}`, `scale: ${formatNumber(scale)}`, `rotationY: ${deg(rotation / 4)}`, "autoAlpha: 0.9"] };
    case "transform-origin":
      return { initial: ["transformOrigin: 'left center'", "x: 0px", "y: 0px", "rotation: 0deg"], target: [`x: ${px(x)}`, `y: ${px(y)}`, `rotation: ${deg(rotation)}`, "pivot: left center"] };
    case "auto-alpha":
      return { initial: ["dot.autoAlpha: 1", "dot.visibility: inherit"], target: ["autoAlpha: 0 -> 1", `stagger: 0.035s`, `duration: ${sec(duration)}`, `ease: ${ease}`] };
    case "css-vars":
      return { initial: ["--stage-hue: 92", "--stage-glow: 0.18", "box.x: 0px"], target: [`--stage-hue: ${formatNumber(Math.min(190, Math.max(60, x)))}`, `--stage-glow: ${formatNumber(Math.min(0.72, Math.max(0.16, scale / 2)))}`, `box.x: ${px(x)}`] };
    case "svg-origin":
      return { initial: ["rotation: 0deg", "svgOrigin: '120 72'"], target: ["rotation: '+=220_cw'", "svgOrigin: '120 72'", "duration: 0.9s"] };
    case "directional-rotation":
      return { initial: ["x: 0px", "rotation: 0deg"], target: ["x: 160px", "rotation: '-170_short'", "then '+=120_cw'", "then '-=80_ccw'"] };
    case "clear-props":
      return { initial: ["x: 0px", "scale: 1", "backgroundColor: card"], target: ["x: 0px", "scale: 1", "clearProps: 'backgroundColor,transform'"] };
    case "targets":
    case "utils-to-array":
      return { initial: ["targets: scoped .pulse-dot[]", "dot.y: 0px"], target: [`dot.y: ${px(y)}`, `stagger: ${sec(stagger)}`, `duration: ${sec(duration)}`] };
    case "stagger":
      return { initial: ["dot.scale: 0.4", `dot.y: ${px(Math.abs(y))}`, "from: center"], target: [`dot.scale: ${formatNumber(scale)}`, `dot.y: ${px(-Math.abs(y))}`, `stagger.each: ${sec(stagger)}`, "repeat: 1", "yoyo: true"] };
    case "eases":
    case "custom-ease":
      return { initial: ["x: 0px", "ease: default"], target: ["x: 100px + back.out(1.7)", "x: 210px + elastic.out(1,0.3)", "x: 60px + coach-snap"] };
    case "tween-control":
    case "timeline-control":
      return { initial: ["progress: 0", "x: 0px", "y: 0px", "rotation: 0deg"], target: [`x: ${px(x)}`, `y: ${px(y)}`, `rotation: ${deg(rotation)}`, "repeat: 1", "yoyo: true"] };
    case "function-values":
      return { initial: ["dot.x: 0px", "dot.y: 0px", "index: 0...12"], target: [`x: index * ${formatNumber(Math.max(4, x / 28))}`, `y: odd ? ${px(-Math.abs(y))} : ${px(Math.abs(y))}`, `stagger: ${sec(stagger)}`] };
    case "relative-values":
      return { initial: ["x: current", "rotation: current"], target: [`x: '+=${Math.round(x * 0.45)}' then '+=${Math.round(x * 0.35)}'`, `rotation: '+=${Math.round(rotation * 0.45)}_cw' then '-=${Math.round(rotation * 0.3)}_ccw'`] };
    case "gsap-defaults":
      return { initial: ["global duration: project default", "global ease: project default"], target: ["duration: 0.42s", "ease: back.out(1.7)", "box.x: 190px", "then restore defaults"] };
    case "match-media":
      return { initial: ["x: 0px", "media query unresolved"], target: ["desktop x: 250px", "mobile x: 120px", "reduceMotion duration: 0"] };
    case "match-media-refresh":
      return { initial: ["registered media handlers", "x: 0px"], target: ["gsap.matchMediaRefresh()", "x: 150px", "rotation: 8deg"] };
    case "timeline-create":
      return { initial: ["tl.progress: 0", "x: 0px", "y: 0px", "rotation: 0deg"], target: [`x phase: ${px(x * 0.55)} -> ${px(x * 0.55)}`, `y: ${px(y)}`, `scale: ${formatNumber(scale)}`, `rotation: ${deg(rotation)}`] };
    case "timeline-chain":
      return { initial: ["box.x: 0px", "dot.y: 0px", "motionDot.x: 0px"], target: [`box.x: ${px(x * 0.65)}`, `dot.y: ${px(-Math.abs(y))}`, `motionDot.x: ${px(x)}`, "position: '<' / '+=0.1'"] };
    case "position-parameter":
      return { initial: ["box.x: 0px", "box.y: 0px", "dot.scale: 1"], target: [`box.x: ${px(x)} at 0`, `dot.scale: ${formatNumber(scale)} at '<0.12'`, `box.y: ${px(y)} at '+=0.2'`] };
    case "timeline-labels":
      return { initial: ["label intro: 0", "x: 0px", "scale: 1"], target: [`intro x: ${px(x * 0.36)}`, `focus x: ${px(x)}`, `scale: ${formatNumber(scale)}`, `outro dot.y: ${px(-Math.abs(y))}`] };
    case "timeline-nesting":
      return { initial: ["child tl x: 0px", "master tl progress: 0"], target: [`child x: ${px(x * 0.4)}`, `child y: ${px(-Math.abs(y) * 0.35)}`, `master x: ${px(x)}`, `master y: ${px(y)}`, `scale: ${formatNumber(scale)}`] };
    case "register-scrolltrigger":
    case "scroll-trigger-config":
      return { initial: ["scroll progress: 0", "drawSVG: '0% 0%'", "box.x: 0px"], target: [`box.x: ${px(x)}`, `drawSVG: '0% ${percent(drawEnd)}'`, "ease: none", `duration: ${sec(duration)}`] };
    case "scroll-callbacks":
    case "scroll-create":
      return { initial: ["trigger outside viewport", "box.x: 0px"], target: [`onEnter x: ${px(x * 0.52)}`, `onUpdate x: ${px(x)}`, `duration: ${sec(duration)}`, `ease: ${ease}`] };
    case "scroll-batch":
    case "perf-batch":
      return { initial: [`items.y: ${px(Math.abs(y))}`, "items.autoAlpha: 0"], target: ["items.y: 0px", "items.autoAlpha: 1", `stagger.each: ${sec(stagger)}`] };
    case "container-animation":
      return { initial: ["motionPath progress: 0", "nested box.y: 0px", "ease: none"], target: ["motionPath progress: 1", `nested box.y: ${px(y)}`, `duration: ${sec(duration)}`] };
    case "scroll-refresh-kill":
      return { initial: ["drawSVG: '0% 100%'", "active triggers: current page"], target: ["ScrollTrigger.refresh()", `drawSVG: '30% 70%' -> '0% ${percent(drawEnd)}'`, "cleanup intent: kill by id/list"] };
    case "register-plugin":
      return { initial: ["plugin registry ready", "title.y: 0px", "box.x: 0px"], target: ["title.y: -6px", "title.color: '#6fb936'", `box.x: ${px(x)}`] };
    case "scroll-to":
      return { initial: ["motionDot.x: 0px", "box.x: 0px", "box.y: 0px"], target: [`motionDot.x: ${px(x)}`, `box.x: ${px(x * 0.65)}`, `box.y: ${px(y)}`, `ease: ${ease}`] };
    case "scroller-proxy":
      return { initial: ["drawSVG: '0% 12%'", "motionDot.x: 0px", "box.y: 0px"], target: [`drawSVG: '0% ${percent(drawEnd)}'`, `motionDot.x: ${px(x)}`, `box.y: ${px(y)}`, "ease: none"] };
    case "scroll-smoother":
      return { initial: ["drawSVG: current", "motionPath progress: 0", "box.y: 0px", "box.scale: 1"], target: ["drawSVG: '20% 85%'", "motionPath progress: 1", `box.y: ${px(y)}`, `box.scale: ${formatNumber(scale)}`] };
    case "flip":
      return { initial: ["Flip.getState(.core-box)", "x: 0px", "y: 0px", "scale: 1"], target: [`x: ${px(x)}`, `y: ${px(y)}`, `scale: ${formatNumber(scale)}`, `duration: ${sec(duration)}`, `ease: ${ease}`] };
    case "draggable":
      return { initial: ["x: 0px", "y: 0px", "scale: 1", "bounds: stage"], target: [`x: ${px(x)}`, `y: ${px(y)}`, `scale: ${formatNumber(scale)}`, "then drag manually"] };
    case "inertia":
      return { initial: ["x: 0px", "y: 0px", "tracked velocity: 0"], target: [`x.velocity: ${formatNumber(velocity)}`, `x.end: ${px(x)}`, `y.velocity: ${formatNumber(velocity * 0.25)}`, `y.end: ${px(y)}`, `duration: ${sec(duration)}`] };
    case "observer":
      return { initial: ["x: 0px", "y: 0px", "rotation: 0deg", "direction: idle"], target: [`x: ${px(x)}`, `y: ${px(y)}`, `rotation: ${deg(rotation * 0.1)}`, `dot.y: +/-${px(Math.abs(y))}`] };
    case "split-text":
      return { initial: ["chars.y: 26px", "chars.autoAlpha: 0", "mask: words"], target: ["chars.y: 0px", "chars.autoAlpha: 1", "stagger: 0.018s", "ease: back.out(1.7)"] };
    case "scramble-text":
      return { initial: ["status text: current", "chars: GSAP01", "revealDelay: 0.15"], target: ["text: 插件已激活", `duration: ${sec(duration)}`] };
    case "draw-svg":
      return { initial: ["drawSVG: '0% 0%'", "stroke visible length: 0"], target: [`drawSVG: '0% ${percent(drawEnd)}'`, "stroke visible length: selected path segment"] };
    case "morph-svg":
      return { initial: ["shape: #morph-start", "path: triangle"], target: ["shape: #morph-target", "type: rotational", "shapeIndex: 1", `duration: ${sec(duration)}`] };
    case "morph-svg-utils":
      return { initial: ["input: SVG shape/path", "rawPath: source data", "box.x: 0px"], target: ["convertToPath()", "stringToRawPath()", "rawPathToString()", `box.x: ${px(x * 0.45)}`] };
    case "motion-path":
    case "motion-path-helper":
      return { initial: ["path progress: 0", "align: #motion-path", `autoRotate: ${autoRotate}`], target: ["path progress: 1", "alignOrigin: [0.5, 0.5]", `duration: ${sec(duration)}`, `ease: ${api.id === "motion-path" ? ease : "default"}`] };
    case "ease-pack":
      return { initial: ["x: 0px", "scale: 1", "ease: built-in default"], target: [`x: ${px(x * 0.38)} + SlowMo`, `x: ${px(x * 0.72)} + RoughEase`, `x: ${px(x)} + ExpoScaleEase`, `scale: ${formatNumber(scale)}`] };
    case "custom-wiggle":
      return { initial: ["rotation: 0deg", "ease: coach-wiggle"], target: [`rotation: ${deg(rotation)}`, "wiggles: 6", "type: easeOut"] };
    case "custom-bounce":
      return { initial: ["ball.y: 0px", "ease: default"], target: [`ball.y: ${px(-Math.abs(y))}`, "then y: 0px", "ease: coach-bounce", `duration: ${sec(duration)}`] };
    case "physics-2d":
      return { initial: ["x: 0px", "y: 0px", `velocity: ${formatNumber(velocity)}`, `angle: ${deg(angle)}`], target: [`gravity: ${formatNumber(gravity)}`, `duration: ${sec(duration)}`, "ease: none"] };
    case "physics-props":
      return { initial: ["x: 0px", "rotation: 0deg"], target: [`x.velocity: ${formatNumber(velocity)}`, `x.end: ${px(x)}`, `rotation.velocity: ${deg(rotation)}`, "rotation.acceleration: -60"] };
    case "gs-devtools":
      return { initial: ["timeline.progress: 0", "debug UI: not mounted", "box.x: 0px"], target: [`box.x: ${px(x)}`, `box.y: ${px(y)}`, `dot.scale: ${formatNumber(scale)}`, `rotation: ${deg(rotation * 0.45)}`] };
    case "pixi-plugin":
      return { initial: ["sprite.x: 0px", "sprite.y: 0px", "sprite.scale: 1", "pixi runtime: external"], target: [`pixi.x: ${px(x)}`, `pixi.y: ${px(y)}`, `pixi.scale: ${formatNumber(scale)}`, `pixi.rotation: ${deg(rotation * 0.2)}`] };
    case "utils-clamp":
    case "utils-map-range":
    case "utils-normalize":
    case "utils-interpolate":
    case "utils-random":
    case "utils-snap":
    case "utils-shuffle":
    case "utils-distribute":
    case "utils-get-unit":
    case "utils-unitize":
    case "utils-split-color":
    case "utils-selector":
    case "utils-pipe":
    case "utils-wrap":
    case "utils-wrap-yoyo":
    case "quick-to":
    case "perf-will-change":
      return { initial: [`raw: ${formatNumber(raw)}`, "progress: 0", "targets: scoped dots"], target: [`x limit: ${px(x)}`, `rotation max: ${deg(rotation)}`, `stagger: ${sec(stagger)}`, `duration: ${sec(duration)}`, `ease: ${api.id === "quick-to" ? "power3.out" : ease}`] };
    case "use-gsap":
    case "vue-lifecycle":
    case "svelte-on-mount":
      return { initial: ["component mounted", "scope/container ready", "x: 0px", "y: 0px"], target: [`x: ${px(x)}`, `y: ${px(y)}`, `scale: ${formatNumber(scale)}`, `stagger: ${sec(stagger)}`, `ease: ${ease}`] };
    case "context-safe":
      return { initial: ["event callback idle", "context recording enabled", "x: 0px"], target: [`step 1 x: ${px(x * 0.6)}`, `step 2 x: ${px(x)}`, `y: ${px(y)}`, `rotation: ${deg(rotation * 0.7)}`] };
    case "gsap-context":
      return { initial: ["ctx = gsap.context()", "x: 0px", "dots visible"], target: [`box.x: ${px(x)}`, `box.y: ${px(y)}`, `dot.y: ${px(-Math.abs(y))} -> 0px`, `stagger: ${sec(stagger)}`] };
    case "nuxt-lazy-plugin":
      return { initial: ["plugin not loaded", "client-side composable ready", "box.x: 0px"], target: [`box.x: ${px(x)}`, `box.scale: ${formatNumber(scale)}`, "title.y: -8px", "title.color: '#19bfe8'"] };
    default:
      return baseSpec(api);
  }
}

export function getDemoParameterSpec(api?: ApiItem, values?: DemoParameterValues): DemoParameterSpec {
  if (api && values) return getDynamicParameterSpec(api, values);

  if (!api) return specByApiId["gsap-to"];

  return baseSpec(api);
}
