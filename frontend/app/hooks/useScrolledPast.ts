"use client";

import { useEffect, useRef, useState } from "react";

/** The ancestor that actually scrolls the element: Modal's body when the
 *  content sits in a dialog, the app shell's main otherwise. html/body never
 *  scroll here — the shell is a fixed-height flex layout — so hitting them
 *  means "no scroll parent", and the observer falls back to the viewport. */
const findScrollParent = (element: HTMLElement): HTMLElement | null => {
  for (
    let node = element.parentElement;
    node && node !== document.body;
    node = node.parentElement
  ) {
    const { overflowY } = getComputedStyle(node);
    if (overflowY === "auto" || overflowY === "scroll") return node;
  }
  return null;
};

/**
 * Tracks whether the referenced element has all but scrolled out of the top of
 * whatever is scrolling it, so a condensed bar can take its place.
 *
 * @param revealAt - how much of the element may still show when it flips, in px.
 *   Defaults to HeroToolbar's height, so the bar it reveals lands exactly over
 *   the sliver of hero that is left rather than beside it.
 */
export function useScrolledPast<T extends HTMLElement>(revealAt = 40) {
  const ref = useRef<T>(null);
  const [scrolledPast, setScrolledPast] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only the top edge matters: the element starts on screen and can only
        // leave upwards, so losing the intersection means it has gone up.
        setScrolledPast(!entry.isIntersecting);
      },
      {
        root: findScrollParent(element),
        // Pulls the top of the intersection box down, so the flip happens with
        // the last sliver of the element still showing rather than after it
        rootMargin: `-${revealAt}px 0px 0px 0px`,
        threshold: 0,
      },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [revealAt]);

  return { ref, scrolledPast };
}
