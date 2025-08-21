import { useCallback } from "react";
import { WizardFooter } from "@/components/CreateCharWizard/components/WizardFooter/WizardFooter";
import { useCharacterCreationMachine } from "@/machines/characterCreationMachine/useCharacterCreationMachine";

export const CharacterCreationFail = () => {
  const { characterCreationMachineSend } = useCharacterCreationMachine();

  const handleRetryClicked = useCallback(() => {
    characterCreationMachineSend({
      type: "RETRY",
    });
  }, [characterCreationMachineSend]);

  return (
    <div>
      <div className="p-6">
        <p>Something went wrong :(</p>
      </div>
      <WizardFooter
        handleContinue={handleRetryClicked}
        continueButtonText="Retry"
      />
    </div>
  );
};
