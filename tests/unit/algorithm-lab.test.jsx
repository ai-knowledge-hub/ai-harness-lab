import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AlgorithmLabPage } from "../../src/views/AlgorithmLabPage";

describe("AlgorithmLabPage", () => {
  it("switches algorithms from the catalogue", () => {
    render(
      <MemoryRouter>
        <AlgorithmLabPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /dijkstra/i }));

    expect(screen.getByRole("heading", { name: "Dijkstra" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /dijkstra/i })).toHaveAttribute(
      "aria-pressed", "true",
    );
  });

  it("advances steps with the next button", () => {
    const { container } = render(
      <MemoryRouter>
        <AlgorithmLabPage />
      </MemoryRouter>,
    );

    const note = container.querySelector(".explain-row article p");
    const initialNote = note.textContent;

    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(container.querySelector(".step-meter span")).toHaveTextContent("2");
    expect(note.textContent).not.toBe(initialNote);
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

    fireEvent.click(screen.getByRole("button", { name: /audit hash chain/i }));

    expect(screen.getByRole("heading", { name: "Audit Hash Chain" })).toBeInTheDocument();
  });
});
