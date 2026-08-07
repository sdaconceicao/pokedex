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
