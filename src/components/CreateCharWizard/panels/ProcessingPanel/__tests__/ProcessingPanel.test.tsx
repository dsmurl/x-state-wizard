import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProcessingPanel } from "../ProcessingPanel";
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
  return render(<ProcessingPanel />);
};

describe("# <ProcessingPanel /> ", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("## Design ", () => {
    it("renders processing message", () => {
      setup();

      expect(
        screen.getByText("Creating your character with a crappy api."),
      ).toBeInTheDocument();
      expect(screen.getByText("(50/50 success rate)")).toBeInTheDocument();
    });

    it("renders progress bar", () => {
      setup();
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });
});
