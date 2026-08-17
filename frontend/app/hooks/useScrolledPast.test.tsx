import { act, render, screen } from "@testing-library/react";
import { useScrolledPast } from "./useScrolledPast";

interface Recorded {
  callback: IntersectionObserverCallback;
  options?: IntersectionObserverInit;
  observed: Element[];
  disconnected: boolean;
}

let observers: Recorded[] = [];
const nativeObserver = globalThis.IntersectionObserver;

beforeEach(() => {
  observers = [];
  globalThis.IntersectionObserver = class {
    private record: Recorded;
    constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
      this.record = { callback, options, observed: [], disconnected: false };
      observers.push(this.record);
    }
    observe(element: Element) {
      this.record.observed.push(element);
    }
    unobserve() {}
    disconnect() {
      this.record.disconnected = true;
    }
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  } as unknown as typeof IntersectionObserver;
});

afterEach(() => {
  globalThis.IntersectionObserver = nativeObserver;
});

/** The element sits inside something that scrolls, as both the page and the
 *  modal do in the app. */
const Harness = ({ revealAt }: { revealAt?: number }) => {
  const { ref, scrolledPast } = useScrolledPast<HTMLDivElement>(revealAt);
  return (
    <div data-testid="scroller" style={{ overflowY: "auto" }}>
      <div ref={ref} data-testid="hero">
        hero
      </div>
      <span data-testid="state">{String(scrolledPast)}</span>
    </div>
  );
};

const report = (isIntersecting: boolean) =>
  act(() => {
    observers[0].callback(
      [{ isIntersecting } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
  });

describe("useScrolledPast", () => {
  it("watches the referenced element", () => {
    render(<Harness />);

    expect(observers[0].observed).toEqual([screen.getByTestId("hero")]);
  });

  it("watches it against whatever scrolls it, not the viewport", () => {
    render(<Harness />);

    expect(observers[0].options?.root).toBe(screen.getByTestId("scroller"));
  });

  it("starts false, since the element begins on screen", () => {
    render(<Harness />);

    expect(screen.getByTestId("state")).toHaveTextContent("false");
  });

  it("flips once the element leaves, and back when it returns", () => {
    render(<Harness />);

    report(false);
    expect(screen.getByTestId("state")).toHaveTextContent("true");

    report(true);
    expect(screen.getByTestId("state")).toHaveTextContent("false");
  });

  it("leaves a sliver of the element showing when it flips", () => {
    render(<Harness revealAt={80} />);

    expect(observers[0].options?.rootMargin).toBe("-80px 0px 0px 0px");
  });

  it("stops watching when unmounted", () => {
    const { unmount } = render(<Harness />);

    unmount();

    expect(observers[0].disconnected).toBe(true);
  });
});
