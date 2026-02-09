import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ClassSelectPanel } from "../ClassSelectPanel";
import { useCharacterCreationMachine } from "@/components/CreateCharWizard/characterCreationMachine/useCharacterCreationMachine";
import { characters } from "@/components/CreateCharWizard/characterCreationMachine/characterCreationMachine.types";

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
      characterClass: undefined,
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
  return render(<ClassSelectPanel />);
};

describe("# <ClassSelectPanel /> ", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("## Design ", () => {
    it("renders all character options", () => {
      setup();

      expect(screen.getByText("Please select a class")).toBeInTheDocument();
      characters.forEach((char) => {
        expect(screen.getByText(char)).toBeInTheDocument();
      });
    });

    it("disables continue button when no class is selected", () => {
      setup();

      const continueButton = screen.getByTestId(
        "wizard-layout-continue-button",
      );
      expect(continueButton).toBeDisabled();
    });
  });

  describe("## Machine events ", () => {
    it("sends SET_CLASS event when a character is clicked", () => {
      setup();

      const warriorButton = screen.getByRole("button", { name: /warrior/i });
      fireEvent.click(warriorButton);

      expect(mockSend).toHaveBeenCalledWith({
        type: "SET_CLASS",
        data: {
          characterClass: "warrior",
        },
      });
    });

    it("sends CONTINUE event when continue button is clicked and class is selected", () => {
      setup({
        values: {
          character: {
            characterClass: "warrior",
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
