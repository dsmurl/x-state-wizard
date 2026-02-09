import { useCallback } from "react";

import { WizardFooter } from "@/components/CreateCharWizard/components/WizardFooter/WizardFooter";
import { useCharacterCreationMachine } from "@/components/CreateCharWizard/characterCreationMachine/useCharacterCreationMachine";
import { WizardLayout } from "@/components/CreateCharWizard/components/WizardLayout/WizardLayout";

export const CharacterCreationFailPanel = () => {
  const { characterCreationMachineSend } = useCharacterCreationMachine();

  const handleRetryClicked = useCallback(() => {
    characterCreationMachineSend({
      type: "RETRY",
    });
  }, [characterCreationMachineSend]);

  return (
    <WizardLayout title="Create Character" hasClose={false}>
      <div className="p-6">
        <p>Something went wrong :(</p>
      </div>
      <WizardFooter
        handleContinue={handleRetryClicked}
        continueButtonText="Retry"
      />
    </WizardLayout>
  );
};
