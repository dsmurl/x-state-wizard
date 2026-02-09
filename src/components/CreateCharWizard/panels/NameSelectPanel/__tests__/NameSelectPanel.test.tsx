import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NameSelectPanel } from "../NameSelectPanel";
import { useCharacterCreationMachine } from "@/components/CreateCharWizard/characterCreationMachine/useCharacterCreationMachine";

// Mock the hook
vi.mock(
  "@/components/CreateCharWizard/characterCreationMachine/useCharacterCreationMachine",
  () => ({
    useCharacterCreationMachine: vi.fn(),
  }),
);

const mockSend = vi.fn();

const mockContext = {
  values: {
    character: {
      name: "",
    },
  },
};

const setup = (contextOverrides = {}) => {
  (useCharacterCreationMachine as any).mockReturnValue({
    characterCreationMachineSend: mockSend,
    characterCreationMachineContext: {
      ...mockContext,
      ...contextOverrides,
    },
  });
  return render(<NameSelectPanel />);
};

describe("# <NameSelectPanel /> ", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("## Design ", () => {
    it("renders name selection message", () => {
      setup();
      expect(
        screen.getByText("Choose your character's name"),
      ).toBeInTheDocument();
    });

    it("disables continue button when name is empty", () => {
      setup();
      const continueButton = screen.getByTestId(
        "wizard-layout-continue-button",
      );
      expect(continueButton).toBeDisabled();
    });

    it("enables continue button when name is provided", () => {
      setup({
        values: {
          character: {
            name: "Aragorn",
          },
        },
      });
      const continueButton = screen.getByTestId(
        "wizard-layout-continue-button",
      );
      expect(continueButton).not.toBeDisabled();
    });
  });

  describe("## Machine events ", () => {
    it("sends SET_NAME event when name input changes", () => {
      setup();
      const input = screen.getByPlaceholderText("Name");
      fireEvent.change(input, { target: { value: "Legolas" } });

      expect(mockSend).toHaveBeenCalledWith({
        type: "SET_NAME",
        data: { name: "Legolas" },
      });
    });

    it("sends CONTINUE event when continue button is clicked and name is provided", () => {
      setup({
        values: {
          character: {
            name: "Aragorn",
          },
        },
      });

      const continueButton = screen.getByTestId(
        "wizard-layout-continue-button",
      );
      fireEvent.click(continueButton);

      expect(mockSend).toHaveBeenCalledWith({
        type: "CONTINUE",
      });
    });

    it("sends CLOSE event when close button is clicked", () => {
      setup();
      const closeButton = screen.getByTestId("wizard-layout-close-button");
      fireEvent.click(closeButton);

      expect(mockSend).toHaveBeenCalledWith({
        type: "CLOSE",
      });
    });
  });
});
