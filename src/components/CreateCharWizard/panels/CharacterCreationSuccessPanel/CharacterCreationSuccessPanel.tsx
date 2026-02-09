import { useCallback } from "react";

import { WizardFooter } from "@/components/CreateCharWizard/components/WizardFooter/WizardFooter";
import { useCharacterCreationMachine } from "@/components/CreateCharWizard/characterCreationMachine/useCharacterCreationMachine";
import { WizardLayout } from "@/components/CreateCharWizard/components/WizardLayout/WizardLayout";

export const CharacterCreationSuccessPanel = () => {
  const { characterCreationMachineSend, characterCreationMachineContext } =
    useCharacterCreationMachine();

  const handleSubmit = useCallback(() => {
    characterCreationMachineSend({
      type: "CONTINUE",
    });
  }, [characterCreationMachineSend]);

  return (
    <WizardLayout title="Create Character" hasClose={false}>
      <div className="p-6">
        <p>Your character has been successfully created!</p>

        <div className="pt-6">
          <div>
            {`Name: ${characterCreationMachineContext.values.character.name}`}
          </div>
          <div>
            {`Class: ${characterCreationMachineContext.values.character.characterClass}`}
          </div>
          <div>
            {`Item: ${characterCreationMachineContext.values.character.item}`}
          </div>
        </div>
      </div>
      <WizardFooter
        handleContinue={handleSubmit}
        continueButtonText="Sally Forth"
      />
    </WizardLayout>
  );
};
