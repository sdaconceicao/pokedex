import "@testing-library/jest-dom/vitest";

// jsdom ships no IntersectionObserver, which anything watching an element
// scroll out of view needs to exist. Records nothing and never fires: tests
// that care about the observed state drive it through the observer directly.
class IntersectionObserverStub implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

globalThis.IntersectionObserver = IntersectionObserverStub;

// The rest of this file exists for react-aria, which the lago design system is
// built on. It reads a handful of browser APIs jsdom doesn't implement, at
// import time or on first render, and throws rather than degrading.

// ThemeProvider resolves the "system" theme through this, and react-aria's
// overlays query it for reduced-motion and pointer coarseness. Reports a light
// theme and a fine pointer, which is what the tests assume.
if (!window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

// Popovers and menus measure their trigger to position themselves.
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class ResizeObserverStub implements ResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
}

// Collections scroll the focused option into view as you arrow through them.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
