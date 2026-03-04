"use client";

import { useEffect, useRef } from "react";

type Direction = "up" | "left" | "right" | "scale";

interface AnimateInProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  direction?: Direction;
  delay?: number; // ms
  threshold?: number; // 0–1
  as?: keyof React.JSX.IntrinsicElements;
}

const dirClass: Record<Direction, string> = {
  up:    "reveal",
  left:  "reveal-left",
  right: "reveal-right",
  scale: "reveal-scale",
};

export default function AnimateIn({
  children,
  className = "",
  style,
  direction = "up",
  delay = 0,
  threshold = 0.12,
  as: Tag = "div",
}: AnimateInProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("visible"), delay);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, threshold]);

  const TagElement = Tag as React.ElementType;

  return (
    <TagElement
      ref={ref}
      className={`${dirClass[direction]} ${className}`}
      style={style}
    >
      {children}
    </TagElement>
  );
}
