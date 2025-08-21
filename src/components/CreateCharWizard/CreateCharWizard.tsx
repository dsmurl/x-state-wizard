import { FC } from "react";

import { ClassSelect } from "@/components/CreateCharWizard/components/ClassSelect/ClassSelect";
import { ItemSelect } from "@/components/CreateCharWizard/components/ItemSelect/ItemSelect";
import { NameSelect } from "@/components/CreateCharWizard/components/NameSelect/NameSelect";
import { WizardLayout } from "@/components/CreateCharWizard/components/WizardLayout/WizardLayout";
import { CharacterCreation } from "@/components/CreateCharWizard/components/CharacterCreation/CharacterCreation";
import { CharacterCreationSuccess } from "@/components/CreateCharWizard/components/CharacterCreationSuccess/CharacterCreationSuccess";
import { CharacterCreationFail } from "@/components/CreateCharWizard/components/CharacterCreationFail/CharacterCreationFail";

import { characterCreationContext } from "@/machines/characterCreationMachine/characterCreationMachine";
import { useCharacterCreationMachine } from "@/machines/characterCreationMachine/useCharacterCreationMachine";

type CreateCharWizardProps = {
  setIsOpen: (open: boolean) => void;
};

const CreateCharWizardRenderer: FC<CreateCharWizardProps> = ({ setIsOpen }) => {
  const { configureMachine, characterCreationMachineState } =
    useCharacterCreationMachine();

  // TODO:: change to a boolean and WizardLayout just sends CLOSE
  const handleClose = () => {
    setIsOpen(false);
  };

  switch (characterCreationMachineState) {
    case "INIT":
      configureMachine({
        onComplete: handleClose,
      });
      return null; // No UI to render in this state
    case "NAME_SELECTION": {
      return (
        <WizardLayout
          title="Create Character"
          hasBack={false}
          onClose={handleClose}
        >
          <NameSelect />
        </WizardLayout>
      );
    }
    case "CLASS_SELECTION": {
      return (
        <WizardLayout
          title="Create Character"
          hasBack={true}
          onClose={handleClose}
        >
          <ClassSelect />
        </WizardLayout>
      );
    }
    case "ITEM_SELECTION": {
      return (
        <WizardLayout
          title="Create Character"
          hasBack={true}
          onClose={handleClose}
        >
          <ItemSelect />
        </WizardLayout>
      );
    }
    case "CREATING_CHARACTER": {
      return (
        <WizardLayout title="Create Character" onClose={handleClose}>
          <CharacterCreation />
        </WizardLayout>
      );
    }
    case "CREATION_SUCCESS": {
      return (
        <WizardLayout title="Create Character" onClose={handleClose}>
          <CharacterCreationSuccess />
        </WizardLayout>
      );
    }
    case "CREATION_FAIL": {
      return (
        <WizardLayout title="Create Character" onClose={handleClose}>
          <CharacterCreationFail />
        </WizardLayout>
      );
    }

    default:
      return null; // Fallback for unhandled states
  }
};

export const CreateCharWizard: FC<CreateCharWizardProps> = ({ setIsOpen }) => {
  return (
    <characterCreationContext.Provider>
      <CreateCharWizardRenderer setIsOpen={setIsOpen} />
    </characterCreationContext.Provider>
  );
};
