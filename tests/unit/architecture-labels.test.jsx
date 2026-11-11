import { render, screen } from "@testing-library/react";
import { ChatGPTAdsArchitecture } from "../../src/components/ChatGPTAdsArchitecture";

it("keeps the shared React control names consistent with their visible labels", () => {
  render(<ChatGPTAdsArchitecture id="label-check" />);
  for (const [index, label] of ["Paths", "Tools", "Delivery", "Reports", "Our build"].entries()) {
    const button = screen.getByRole("button", { name: new RegExp(`^Stage ${index + 1}:`) });
    expect(button).toHaveTextContent(label);
    expect(button).toHaveAccessibleName(new RegExp(label));
  }
});
