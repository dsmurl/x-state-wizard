import { renderHook, act } from "@testing-library/react";

import { characterCreationContext } from "@/machines/characterCreationMachine/characterCreationMachine";
import { useCharacterCreationMachine } from "@/machines/characterCreationMachine/useCharacterCreationMachine";
import { crappyNetworkClient } from "@/crappyApiClient/crappyNetworkClient";

// Mock the network client with a flexible mock function
vi.mock("@/crappyApiClient/crappyNetworkClient", () => ({
  crappyNetworkClient: {
    createCharacter: vi.fn(),
  },
}));
const mockedCreateCharacter = vi.mocked(crappyNetworkClient.createCharacter);

describe("# Hook: useCharacterCreationMachine()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setup = () => {
    const Wrapper = ({ children }: any) => (
      <characterCreationContext.Provider>
        {children}
      </characterCreationContext.Provider>
    );

    const { result } = renderHook(() => useCharacterCreationMachine(), {
      wrapper: Wrapper,
    });

    return { useCharacterCreationMachine: result };
  };

  describe("## State: INIT", () => {
    it("returns expected values from hook", async () => {
      const { useCharacterCreationMachine } = setup();

      expect(
        useCharacterCreationMachine.current.characterCreationMachineState,
      ).toBe("INIT");

      expect(
        useCharacterCreationMachine.current.characterCreationMachineContext,
      ).toEqual({
        values: { character: {} },
        actions: {
          onClose: expect.any(Function),
          onFlowSuccess: expect.any(Function),
        },
      });

      expect(typeof useCharacterCreationMachine.current.configureMachine).toBe(
        "function",
      );
      expect(
        typeof useCharacterCreationMachine.current.characterCreationMachineSend,
      ).toBe("function");
    });

    it("configures the machine when configureMachine is called", async () => {
      const { useCharacterCreationMachine } = setup();
      const mockOnClose = vi.fn();
      const mockOnFlowSuccess = vi.fn();

      expect(
        useCharacterCreationMachine.current.characterCreationMachineState,
      ).toBe("INIT");

      await act(async () => {
        useCharacterCreationMachine.current.configureMachine({
          onClose: mockOnClose,
          onFlowSuccess: mockOnFlowSuccess,
        });
      });

      expect(
        useCharacterCreationMachine.current.characterCreationMachineContext
          .actions.onFlowSuccess,
      ).toBeDefined();

      expect(
        useCharacterCreationMachine.current.characterCreationMachineState,
      ).toBe("NAME_SELECTION");
    });
  });

  describe("## State: NAME_SELECTION", () => {
    it("handles SET_NAME event", async () => {
      const { useCharacterCreationMachine } = setup();
      const mockOnClose = vi.fn();
      const mockOnFlowSuccess = vi.fn();

      await act(async () => {
        useCharacterCreationMachine.current.configureMachine({
          onClose: mockOnClose,
          onFlowSuccess: mockOnFlowSuccess,
        });
      });

      expect(
        useCharacterCreationMachine.current.characterCreationMachineState,
      ).toBe("NAME_SELECTION");

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "SET_NAME",
          data: { name: "Aragorn" },
        });
      });

      expect(
        useCharacterCreationMachine.current.characterCreationMachineContext
          .values.character.name,
      ).toBe("Aragorn");
    });

    it("does not transition to CLASS_SELECTION on CONTINUE event if no class is selected", async () => {
      const { useCharacterCreationMachine } = setup();
      const mockOnClose = vi.fn();
      const mockOnFlowSuccess = vi.fn();

      await act(async () => {
        useCharacterCreationMachine.current.configureMachine({
          onClose: mockOnClose,
          onFlowSuccess: mockOnFlowSuccess,
        });
      });

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "CONTINUE",
        });
      });

      // Still name selection state because no name is selected
      expect(
        useCharacterCreationMachine.current.characterCreationMachineState,
      ).toBe("NAME_SELECTION");
    });

    it("transitions to CLASS_SELECTION on CONTINUE event", async () => {
      const { useCharacterCreationMachine } = setup();
      const mockOnClose = vi.fn();
      const mockOnFlowSuccess = vi.fn();

      await act(async () => {
        useCharacterCreationMachine.current.configureMachine({
          onClose: mockOnClose,
          onFlowSuccess: mockOnFlowSuccess,
        });
      });

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "SET_NAME",
          data: { name: "Aragorn" },
        });
      });

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "CONTINUE",
        });
      });

      expect(
        useCharacterCreationMachine.current.characterCreationMachineState,
      ).toBe("CLASS_SELECTION");
    });
  });

  describe("## State: CLASS_SELECTION", () => {
    it("handles SET_CLASS event", async () => {
      const { useCharacterCreationMachine } = setup();
      const mockOnClose = vi.fn();
      const mockOnFlowSuccess = vi.fn();

      await act(async () => {
        useCharacterCreationMachine.current.configureMachine({
          onClose: mockOnClose,
          onFlowSuccess: mockOnFlowSuccess,
        });
      });

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "SET_NAME",
          data: { name: "Aragorn" },
        });
      });

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "CONTINUE",
        });
      });

      expect(
        useCharacterCreationMachine.current.characterCreationMachineState,
      ).toBe("CLASS_SELECTION");

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "SET_CLASS",
          data: { characterClass: "warrior" },
        });
      });

      expect(
        useCharacterCreationMachine.current.characterCreationMachineContext
          .values.character.characterClass,
      ).toBe("warrior");
    });

    it("transitions to ITEM_SELECTION on CONTINUE event", async () => {
      const { useCharacterCreationMachine } = setup();
      const mockOnClose = vi.fn();
      const mockOnFlowSuccess = vi.fn();

      await act(async () => {
        useCharacterCreationMachine.current.configureMachine({
          onClose: mockOnClose,
          onFlowSuccess: mockOnFlowSuccess,
        });
      });

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "SET_NAME",
          data: { name: "Aragorn" },
        });
      });

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "CONTINUE",
        });
      });

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "SET_CLASS",
          data: { characterClass: "warrior" },
        });
      });

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "CONTINUE",
        });
      });

      expect(
        useCharacterCreationMachine.current.characterCreationMachineState,
      ).toBe("ITEM_SELECTION");
    });

    it("transitions back to NAME_SELECTION on GO_BACK event", async () => {
      const { useCharacterCreationMachine } = setup();
      const mockOnClose = vi.fn();
      const mockOnFlowSuccess = vi.fn();

      await act(async () => {
        useCharacterCreationMachine.current.configureMachine({
          onClose: mockOnClose,
          onFlowSuccess: mockOnFlowSuccess,
        });
      });
      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "SET_NAME",
          data: { name: "Aragorn" },
        });
      });

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "CONTINUE",
        });
      });

      expect(
        useCharacterCreationMachine.current.characterCreationMachineState,
      ).toBe("CLASS_SELECTION");

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "GO_BACK",
        });
      });

      expect(
        useCharacterCreationMachine.current.characterCreationMachineState,
      ).toBe("NAME_SELECTION");
    });
  });

  describe("## State: ITEM_SELECTION", () => {
    it("handles SET_ITEM event", async () => {
      const { useCharacterCreationMachine } = setup();
      const mockOnClose = vi.fn();
      const mockOnFlowSuccess = vi.fn();

      // Navigate to ITEM_SELECTION
      await act(async () => {
        useCharacterCreationMachine.current.configureMachine({
          onClose: mockOnClose,
          onFlowSuccess: mockOnFlowSuccess,
        });
      });

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "SET_NAME",
          data: { name: "Aragorn" },
        });
      });

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "CONTINUE",
        });
      });

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "SET_CLASS",
          data: { characterClass: "warrior" },
        });
      });

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "CONTINUE",
        });
      });

      expect(
        useCharacterCreationMachine.current.characterCreationMachineState,
      ).toBe("ITEM_SELECTION");

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "SET_ITEM",
          data: { item: "crown" },
        });
      });

      expect(
        useCharacterCreationMachine.current.characterCreationMachineContext
          .values.character.item,
      ).toBe("crown");
    });

    // it("transitions to CREATING_CHARACTER on CONTINUE event", async () => {
    //   const { useCharacterCreationMachine } = setup();
    //   const mockOnFlowSuccess = vi.fn();
    //
    //   // Navigate to ITEM_SELECTION
    //   await act(async () => {
    //     useCharacterCreationMachine.current.configureMachine({
    //       onFlowSuccess: mockOnFlowSuccess,
    //     });
    //   });
    //
    //   await act(async () => {
    //     useCharacterCreationMachine.current.characterCreationMachineSend({
    //       type: "CONTINUE",
    //     });
    //   });
    //
    //   await act(async () => {
    //     useCharacterCreationMachine.current.characterCreationMachineSend({
    //       type: "CONTINUE",
    //     });
    //   });
    //
    //   await act(async () => {
    //     useCharacterCreationMachine.current.characterCreationMachineSend({
    //       type: "CONTINUE",
    //     });
    //   });
    //
    //   expect(
    //     useCharacterCreationMachine.current.characterCreationMachineState,
    //   ).toBe("CREATING_CHARACTER");
    // });

    it("transitions back to CLASS_SELECTION on GO_BACK event", async () => {
      const { useCharacterCreationMachine } = setup();
      const mockOnClose = vi.fn();
      const mockOnFlowSuccess = vi.fn();

      // Navigate to ITEM_SELECTION
      await act(async () => {
        useCharacterCreationMachine.current.configureMachine({
          onClose: mockOnClose,
          onFlowSuccess: mockOnFlowSuccess,
        });
      });

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "SET_NAME",
          data: { name: "Aragorn" },
        });
      });

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "CONTINUE",
        });
      });

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "SET_CLASS",
          data: { characterClass: "warrior" },
        });
      });

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "CONTINUE",
        });
      });

      expect(
        useCharacterCreationMachine.current.characterCreationMachineState,
      ).toBe("ITEM_SELECTION");

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "GO_BACK",
        });
      });

      expect(
        useCharacterCreationMachine.current.characterCreationMachineState,
      ).toBe("CLASS_SELECTION");
    });
  });

  describe("## State: CREATION_FAIL", () => {
    it("transitions to NAME_SELECTION on RETRY event", async () => {
      // Mock API to throw an error - this will trigger the invoke onError
      mockedCreateCharacter.mockRejectedValueOnce(
        new Error("API request failed"),
      );

      const { useCharacterCreationMachine } = setup();
      const mockOnClose = vi.fn();
      const mockOnFlowSuccess = vi.fn();

      await act(async () => {
        useCharacterCreationMachine.current.configureMachine({
          onClose: mockOnClose,
          onFlowSuccess: mockOnFlowSuccess,
        });
      });

      // Navigate through the complete flow to trigger character creation
      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "SET_NAME",
          data: { name: "Aragorn" },
        });
      });

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "CONTINUE",
        });
      });

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "SET_CLASS",
          data: { characterClass: "warrior" },
        });
      });

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "CONTINUE",
        });
      });

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "SET_ITEM",
          data: { item: "potion" },
        });
      });

      // Trigger character creation which should fail
      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "CONTINUE",
        });
      });

      // Should be in CREATION_FAIL state
      expect(
        useCharacterCreationMachine.current.characterCreationMachineState,
      ).toBe("CREATION_FAIL");

      // Test RETRY event transitions back to NAME_SELECTION
      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "RETRY",
        });
      });

      expect(
        useCharacterCreationMachine.current.characterCreationMachineState,
      ).toBe("NAME_SELECTION");
    });
  });

  describe("## State: CREATION_SUCCESS", () => {
    it("transitions to CHARACTER_COMPLETED on CONTINUE event", async () => {
      // Mock API to succeed - this will trigger the invoke onDone
      mockedCreateCharacter.mockResolvedValueOnce({ message: "Done" });

      const { useCharacterCreationMachine } = setup();
      const mockOnClose = vi.fn();
      const mockOnFlowSuccess = vi.fn();

      await act(async () => {
        useCharacterCreationMachine.current.configureMachine({
          onClose: mockOnClose,
          onFlowSuccess: mockOnFlowSuccess,
        });
      });

      // Navigate through the complete flow to trigger character creation
      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "SET_NAME",
          data: { name: "Aragorn" },
        });
      });

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "CONTINUE",
        });
      });

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "SET_CLASS",
          data: { characterClass: "warrior" },
        });
      });

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "CONTINUE",
        });
      });

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "SET_ITEM",
          data: { item: "ring" },
        });
      });

      // Trigger character creation which should succeed
      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "CONTINUE",
        });
      });

      // Should be in CREATION_SUCCESS state
      expect(
        useCharacterCreationMachine.current.characterCreationMachineState,
      ).toBe("CREATION_SUCCESS");

      // Test CONTINUE event transitions to CHARACTER_COMPLETED
      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "CONTINUE",
        });
      });

      expect(
        useCharacterCreationMachine.current.characterCreationMachineState,
      ).toBe("CLOSING");

      // Verify onFlowSuccess was called with the character data
      expect(mockOnFlowSuccess).toHaveBeenCalledWith({
        character: {
          name: "Aragorn",
          characterClass: "warrior",
          item: "ring",
        },
      });
    });
  });

  describe("## Message: CLOSE functionality", () => {
    it("transitions to CLOSING on CLOSE event from NAME_SELECTION", async () => {
      const { useCharacterCreationMachine } = setup();
      const mockOnClose = vi.fn();
      const mockOnFlowSuccess = vi.fn();

      await act(async () => {
        useCharacterCreationMachine.current.configureMachine({
          onClose: mockOnClose,
          onFlowSuccess: mockOnFlowSuccess,
        });
      });

      expect(
        useCharacterCreationMachine.current.characterCreationMachineState,
      ).toBe("NAME_SELECTION");

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "CLOSE",
        });
      });

      expect(
        useCharacterCreationMachine.current.characterCreationMachineState,
      ).toBe("CLOSING");

      expect(mockOnClose).toHaveBeenCalled();
    });

    it("transitions to CLOSING on CLOSE event from CLASS_SELECTION", async () => {
      const { useCharacterCreationMachine } = setup();
      const mockOnClose = vi.fn();
      const mockOnFlowSuccess = vi.fn();

      await act(async () => {
        useCharacterCreationMachine.current.configureMachine({
          onClose: mockOnClose,
          onFlowSuccess: mockOnFlowSuccess,
        });
      });

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "SET_NAME",
          data: { name: "Aragorn" },
        });
      });

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "CONTINUE",
        });
      });

      expect(
        useCharacterCreationMachine.current.characterCreationMachineState,
      ).toBe("CLASS_SELECTION");

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "CLOSE",
        });
      });

      expect(
        useCharacterCreationMachine.current.characterCreationMachineState,
      ).toBe("CLOSING");

      expect(mockOnClose).toHaveBeenCalled();
    });

    it("transitions to CLOSING on CLOSE event from ITEM_SELECTION", async () => {
      const { useCharacterCreationMachine } = setup();
      const mockOnClose = vi.fn();
      const mockOnFlowSuccess = vi.fn();

      await act(async () => {
        useCharacterCreationMachine.current.configureMachine({
          onClose: mockOnClose,
          onFlowSuccess: mockOnFlowSuccess,
        });
      });

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "SET_NAME",
          data: { name: "Aragorn" },
        });
      });

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "CONTINUE",
        });
      });

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "SET_CLASS",
          data: { characterClass: "warrior" },
        });
      });

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "CONTINUE",
        });
      });

      expect(
        useCharacterCreationMachine.current.characterCreationMachineState,
      ).toBe("ITEM_SELECTION");

      await act(async () => {
        useCharacterCreationMachine.current.characterCreationMachineSend({
          type: "CLOSE",
        });
      });

      expect(
        useCharacterCreationMachine.current.characterCreationMachineState,
      ).toBe("CLOSING");

      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
