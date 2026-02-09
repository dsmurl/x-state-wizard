import { FC, useCallback } from "react";

import { ClassSelectPanel } from "@/components/CreateCharWizard/panels/ClassSelectPanel/ClassSelectPanel";
import { ItemSelectPanel } from "@/components/CreateCharWizard/panels/ItemSelectPanel/ItemSelectPanel";
import { NameSelectPanel } from "@/components/CreateCharWizard/panels/NameSelectPanel/NameSelectPanel";

import { ProcessingPanel } from "@/components/CreateCharWizard/panels/ProcessingPanel/ProcessingPanel";
import { CharacterCreationSuccessPanel } from "@/components/CreateCharWizard/panels/CharacterCreationSuccessPanel/CharacterCreationSuccessPanel";
import { CharacterCreationFailPanel } from "@/components/CreateCharWizard/panels/CharacterCreationFailPanel/CharacterCreationFailPanel";
import { characterCreationContext } from "@/components/CreateCharWizard/characterCreationMachine/characterCreationMachine";
import { CharacterCreationContextDebugSubscriber } from "@/components/DebugArea/CharacterCreationContextDebugSubscriber";
import { useCharacterCreationMachine } from "@/components/CreateCharWizard/characterCreationMachine/useCharacterCreationMachine";
import { Character } from "@/components/CreateCharWizard/characterCreationMachine/characterCreationMachine.types";

type CreateCharWizardProps = {
  setIsOpen: (open: boolean) => void;
};

const CreateCharacterWizardPanelRouter: FC<CreateCharWizardProps> = ({
  setIsOpen,
}) => {
  const { configureMachine, characterCreationMachineState } =
    useCharacterCreationMachine();

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const onFlowSuccess = ({ character }: { character: Character }) => {
    console.log("Character creation completed with values:", character);
  };

  switch (characterCreationMachineState) {
    case "INIT":
      configureMachine({
        onClose,
        onFlowSuccess,
      });
      return null; // No UI to render in this state
    case "NAME_SELECTION": {
      return <NameSelectPanel />;
    }
    case "CLASS_SELECTION": {
      return <ClassSelectPanel />;
    }
    case "ITEM_SELECTION": {
      return <ItemSelectPanel />;
    }
    case "CREATING_CHARACTER": {
      return <ProcessingPanel />;
    }
    case "CREATION_FAIL": {
      return <CharacterCreationFailPanel />;
    }
    case "CREATION_SUCCESS": {
      return <CharacterCreationSuccessPanel />;
    }

    default:
      return null; // Fallback for unhandled states
  }
};

export const CreateCharacterWizard: FC<CreateCharWizardProps> = ({
  setIsOpen,
}) => {
  return (
    <characterCreationContext.Provider>
      <CharacterCreationContextDebugSubscriber />
      <CreateCharacterWizardPanelRouter setIsOpen={setIsOpen} />
    </characterCreationContext.Provider>
  );
};
