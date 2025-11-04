"use client"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { cn } from "@/lib/utils"

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  direction?: "up" | "down" | "left" | "right" | "scale"
  delay?: 100 | 200 | 300 | 400 | 500
}

export function ScrollReveal({
  children,
  className,
  direction = "up",
  delay,
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal({
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
    triggerOnce: true,
  })

  return (
    <div
      ref={ref}
      className={cn(
        "scroll-reveal",
        `fade-${direction}`,
        delay && `scroll-reveal-delay-${delay}`,
        isVisible && "revealed",
        className
      )}
    >
      {children}
    </div>
  )
}

