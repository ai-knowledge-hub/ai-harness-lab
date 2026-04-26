import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../../src/App";

function renderAt(route) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>,
  );
}

describe("App routing", () => {
  it("renders the homepage", () => {
    renderAt("/");
    expect(
      screen.getByRole("heading", { name: /harness engineering for marketing ai systems/i }),
    ).toBeInTheDocument();
  });

  it("renders the algorithms module", () => {
    renderAt("/algorithms");
    expect(
      screen.getByRole("heading", { name: /algorithms inside marketing agents/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /binary search/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /read control-plane article/i }),
    ).toBeInTheDocument();
  });

  it("renders the patterns module", () => {
    renderAt("/patterns");
    expect(screen.getByRole("heading", { name: /agent control plane/i })).toBeInTheDocument();
    expect(screen.getByText(/personal oauth as agent identity/i)).toBeInTheDocument();
    expect(screen.getByText(/identity \+ policy boundary/i)).toBeInTheDocument();
  });
});
