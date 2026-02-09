import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CharacterCreationSuccessPanel } from "../CharacterCreationSuccessPanel";
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
      name: "Aragorn",
      characterClass: "warrior",
      item: "ring",
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
  return render(<CharacterCreationSuccessPanel />);
};

describe("# <CharacterCreationSuccessPanel /> ", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("## Design ", () => {
    it("renders success message and character details", () => {
      setup();

      expect(
        screen.getByText("Your character has been successfully created!"),
      ).toBeInTheDocument();
      expect(screen.getByText("Name: Aragorn")).toBeInTheDocument();
      expect(screen.getByText("Class: warrior")).toBeInTheDocument();
      expect(screen.getByText("Item: ring")).toBeInTheDocument();
    });

    it("renders continue button with 'Sally Forth' text", () => {
      setup();
      expect(screen.getByText("Sally Forth")).toBeInTheDocument();
    });
  });

  describe("## Machine events ", () => {
    it("sends CONTINUE event when sally forth button is clicked", () => {
      setup();

      const sallyForthButton = screen.getByRole("button", {
        name: /sally forth/i,
      });
      fireEvent.click(sallyForthButton);

      expect(mockSend).toHaveBeenCalledWith({
        type: "CONTINUE",
      });
    });
  });
});
