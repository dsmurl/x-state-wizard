import { FC, useCallback } from "react";

import { ClassSelect } from "@/components/CreateCharWizard/components/ClassSelect/ClassSelect";
import { ItemSelect } from "@/components/CreateCharWizard/components/ItemSelect/ItemSelect";
import { NameSelect } from "@/components/CreateCharWizard/components/NameSelect/NameSelect";
import { WizardLayout } from "@/components/CreateCharWizard/components/WizardLayout/WizardLayout";
import { CharacterCreation } from "@/components/CreateCharWizard/components/CharacterCreation/CharacterCreation";
import { CharacterCreationSuccess } from "@/components/CreateCharWizard/components/CharacterCreationSuccess/CharacterCreationSuccess";
import { CharacterCreationFail } from "@/components/CreateCharWizard/components/CharacterCreationFail/CharacterCreationFail";
import {
  Character,
  characterCreationContext,
} from "@/machines/characterCreationMachine/characterCreationMachine";
import { CharacterCreationContextDebugSubscriber } from "@/components/DebugPanel/CharacterCreationContextDebugSubscriber";
import { useDebugContext } from "@/components/DebugPanel/DebugContextProvider";
import { useCharacterCreationMachine } from "@/machines/characterCreationMachine/useCharacterCreationMachine";

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
      return (
        <WizardLayout title="Create Character" hasBack={false} hasClose={true}>
          <NameSelect />
        </WizardLayout>
      );
    }
    case "CLASS_SELECTION": {
      return (
        <WizardLayout title="Create Character" hasBack={true} hasClose={true}>
          <ClassSelect />
        </WizardLayout>
      );
    }
    case "ITEM_SELECTION": {
      return (
        <WizardLayout title="Create Character" hasBack={true} hasClose={true}>
          <ItemSelect />
        </WizardLayout>
      );
    }
    case "CREATING_CHARACTER": {
      return (
        <WizardLayout title="Create Character" hasClose={false}>
          <CharacterCreation />
        </WizardLayout>
      );
    }
    case "CREATION_FAIL": {
      return (
        <WizardLayout title="Create Character" hasClose={false}>
          <CharacterCreationFail />
        </WizardLayout>
      );
    }
    case "CREATION_SUCCESS": {
      return (
        <WizardLayout title="Create Character" hasClose={false}>
          <CharacterCreationSuccess />
        </WizardLayout>
      );
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
