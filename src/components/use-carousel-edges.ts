"use client";

import { useEffect, useState, type RefObject } from "react";

export function useCarouselEdges(ref: RefObject<HTMLDivElement | null>) {
  const [edges, setEdges] = useState({ start: true, end: true });
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const start = element.scrollLeft < 4;
      const end = element.scrollLeft + element.clientWidth >= element.scrollWidth - 4;
      // Keep the same state object while scrolling between the two ends.
      setEdges((previous) => previous.start === start && previous.end === end
        ? previous : { start, end });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const resize = new ResizeObserver(schedule);
    const mutation = new MutationObserver(schedule);
    resize.observe(element);
    mutation.observe(element, { childList: true });
    element.addEventListener("scroll", schedule, { passive: true });
    update();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      mutation.disconnect();
      element.removeEventListener("scroll", schedule);
    };
  }, [ref]);
  return edges;
}
