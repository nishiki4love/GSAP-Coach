import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CustomBounce } from "gsap/CustomBounce";
import { CustomEase } from "gsap/CustomEase";
import { CustomWiggle } from "gsap/CustomWiggle";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Draggable } from "gsap/Draggable";
import { EasePack } from "gsap/EasePack";
import { Flip } from "gsap/Flip";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { Observer } from "gsap/Observer";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";
import { PhysicsPropsPlugin } from "gsap/PhysicsPropsPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

let isRegistered = false;

/**
 * 注册演示站会实际用到的 GSAP 插件，并创建教程中复用的自定义 ease。
 *
 * 注意：GSDevTools、MotionPathHelper、PixiPlugin 在本项目中只作为教程覆盖，
 * 不注册进运行时代码，避免把开发工具或额外图形运行时带进生产包。
 */
export function setupGsap(): void {
  if (isRegistered) return;

  gsap.registerPlugin(
    useGSAP,
    ScrollTrigger,
    ScrollToPlugin,
    Flip,
    Draggable,
    InertiaPlugin,
    Observer,
    SplitText,
    ScrambleTextPlugin,
    DrawSVGPlugin,
    MorphSVGPlugin,
    MotionPathPlugin,
    CustomEase,
    CustomWiggle,
    CustomBounce,
    Physics2DPlugin,
    PhysicsPropsPlugin,
    EasePack,
  );

  CustomEase.create("coach-snap", "M0,0 C0.17,0.67 0.38,1.26 1,1");
  CustomWiggle.create("coach-wiggle", { wiggles: 6, type: "easeOut" });
  CustomBounce.create("coach-bounce", { strength: 0.55 });

  gsap.defaults({ duration: 0.55, ease: "power2.out" });
  isRegistered = true;
}

export {
  DrawSVGPlugin,
  Draggable,
  Flip,
  gsap,
  InertiaPlugin,
  MorphSVGPlugin,
  Observer,
  Physics2DPlugin,
  PhysicsPropsPlugin,
  ScrollTrigger,
  SplitText,
  useGSAP,
};
