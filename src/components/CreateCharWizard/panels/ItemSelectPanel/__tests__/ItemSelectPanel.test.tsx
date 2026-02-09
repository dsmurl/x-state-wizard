import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ItemSelectPanel } from "../ItemSelectPanel";
import { useCharacterCreationMachine } from "@/components/CreateCharWizard/characterCreationMachine/useCharacterCreationMachine";
import { items } from "@/components/CreateCharWizard/characterCreationMachine/characterCreationMachine.types";

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
      item: undefined,
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
  return render(<ItemSelectPanel />);
};

describe("# <ItemSelectPanel /> ", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("## Design ", () => {
    it("renders all item options", () => {
      setup();

      expect(screen.getByText("Please select an item")).toBeInTheDocument();
      items.forEach((item) => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    });

    it("disables continue button when no item is selected", () => {
      setup();

      const continueButton = screen.getByTestId(
        "wizard-layout-continue-button",
      );
      expect(continueButton).toBeDisabled();
    });
  });

  describe("## Machine events ", () => {
    it("sends SET_ITEM event when an item is clicked", () => {
      setup();

      const ringButton = screen.getByRole("button", { name: /ring/i });
      fireEvent.click(ringButton);

      expect(mockSend).toHaveBeenCalledWith({
        type: "SET_ITEM",
        data: {
          item: "ring",
        },
      });
    });

    it("sends CONTINUE event when continue button is clicked and item is selected", () => {
      setup({
        values: {
          character: {
            item: "ring",
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

    it("sends GO_BACK event when back button is clicked", () => {
      setup();

      const backButton = screen.getByTestId("wizard-layout-back-button");
      fireEvent.click(backButton);

      expect(mockSend).toHaveBeenCalledWith({
        type: "GO_BACK",
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
