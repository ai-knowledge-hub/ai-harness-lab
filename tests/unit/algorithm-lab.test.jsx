import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AlgorithmLabPage } from "../../src/pages/AlgorithmLabPage";

describe("AlgorithmLabPage", () => {
  it("switches algorithms from the catalogue", () => {
    render(
      <MemoryRouter>
        <AlgorithmLabPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /dijkstra/i }));

    expect(screen.getByRole("heading", { name: "Dijkstra" })).toBeInTheDocument();
    expect(screen.getByText(/weighted graph of tool calls/i)).toBeInTheDocument();
  });

  it("advances steps with the next button", () => {
    render(
      <MemoryRouter>
        <AlgorithmLabPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText(/middle value is 5.80/i)).toBeInTheDocument();
  });

  it("shows control algorithms for agent governance", () => {
    render(
      <MemoryRouter>
        <AlgorithmLabPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Control" }));

    expect(
      screen.getByRole("button", { name: /approval state machine/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /token bucket/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /lease-locked queue/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /rbac \/ abac permission graph/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /audit hash chain/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /lease-locked queue/i }));

    expect(screen.getByRole("heading", { name: "Lease-Locked Queue" })).toBeInTheDocument();
    expect(screen.getByText(/two agents do not execute the same action/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /audit hash chain/i }));

    expect(screen.getByRole("heading", { name: "Audit Hash Chain" })).toBeInTheDocument();
    expect(screen.getByText(/tamper-evident action log/i)).toBeInTheDocument();
  });
});
