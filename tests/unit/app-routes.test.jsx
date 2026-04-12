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
  });

  it("renders the patterns module", () => {
    renderAt("/patterns");
    expect(
      screen.getByRole("heading", { name: /harness patterns behind reliable marketing ai/i }),
    ).toBeInTheDocument();
  });
});
