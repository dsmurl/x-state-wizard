import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CharacterCreationFailPanel } from "../CharacterCreationFailPanel";
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
    character: {},
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

  return render(<CharacterCreationFailPanel />);
};

describe("# <CharacterCreationFailPanel /> ", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("## Design ", () => {
    it("renders fail message", () => {
      setup();
      expect(screen.getByText("Something went wrong :(")).toBeInTheDocument();
    });
  });

  describe("## Machine events ", () => {
    it("sends RETRY event when retry button is clicked", () => {
      setup();

      const retryButton = screen.getByRole("button", { name: /retry/i });
      fireEvent.click(retryButton);

      expect(mockSend).toHaveBeenCalledWith({
        type: "RETRY",
      });
    });
  });
});
