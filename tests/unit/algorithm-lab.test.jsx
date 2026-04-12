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
});
