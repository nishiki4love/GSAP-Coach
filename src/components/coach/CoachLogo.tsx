import { cn } from "@/lib/utils";

interface CoachLogoProps {
  className?: string;
}

/** GSAP Coach 专属 SVG 标识：用轨道、时间轴节点和播放箭头表达动画教学工具。 */
export function CoachLogo({ className }: CoachLogoProps) {
  return (
    <svg viewBox="0 0 40 40" role="img" aria-label="GSAP Coach" className={cn("size-full", className)}>
      <rect width="40" height="40" rx="10" fill="currentColor" opacity="0.12" />
      <path
        d="M9 24.5C12.8 14.2 25.4 13.6 30.8 8.8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <path d="M16 15.5L25.5 20L16 24.5V15.5Z" fill="currentColor" />
      <circle cx="9" cy="24.5" r="2.8" fill="currentColor" />
      <circle cx="30.8" cy="8.8" r="2.8" fill="currentColor" />
      <path
        d="M10 31H30"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
        opacity="0.45"
      />
    </svg>
  );
}
