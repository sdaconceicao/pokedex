import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { useIsAuthenticated } from "./useAuth";

const TOKEN = "test-token";
const USER = { id: "1", email: "test@test.com", username: "test" };

/**
 * A client whose auth cache is already warm before the component under test
 * first renders — the situation every consumer of this hook hits in the app,
 * because `AuthModalProvider` calls it from outside the `<Suspense>` boundary
 * that wraps the header and so resolves both queries first.
 */
function warmClient() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  queryClient.setQueryData(["auth", "token"], TOKEN);
  queryClient.setQueryData(["auth", "user", TOKEN], USER);
  return queryClient;
}

function Probe() {
  const { isAuthenticated } = useIsAuthenticated();
  return <span>{isAuthenticated ? "signed-in" : "signed-out"}</span>;
}

function wrap(children: ReactNode, queryClient: QueryClient) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe("useAuth hydration safety", () => {
  it("reports signed out before mount, even with a signed-in user cached", () => {
    // renderToString runs no effects, so this is both what the server sends and
    // what React must find on the client's first hydration pass. The server has
    // no localStorage and can only ever say signed out, so anything else here
    // means the two disagree and the tree is thrown away.
    const html = renderToString(wrap(<Probe />, warmClient()));

    expect(html).toContain("signed-out");
  });

  it("reports signed in once mounted", () => {
    render(wrap(<Probe />, warmClient()));

    expect(screen.getByText("signed-in")).toBeInTheDocument();
  });
});
