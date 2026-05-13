"use client";
import { useEffect, useRef, useState } from "react";

const TEMPLATE_WIDTH = 816;

export function useScaleToFit(): {
  containerRef: React.RefObject<HTMLDivElement | null>;
  scale: number;
} {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => setScale(el.clientWidth / TEMPLATE_WIDTH);
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    measure();

    return () => observer.disconnect();
  }, []);

  return { containerRef, scale };
}
