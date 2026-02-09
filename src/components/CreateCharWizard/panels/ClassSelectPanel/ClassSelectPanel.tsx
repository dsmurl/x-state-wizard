import { useCallback } from "react";

import { WizardFooter } from "@/components/CreateCharWizard/components/WizardFooter/WizardFooter";
import { useCharacterCreationMachine } from "@/components/CreateCharWizard/characterCreationMachine/useCharacterCreationMachine";
import {
  type CharacterClass,
  characters,
} from "@/components/CreateCharWizard/characterCreationMachine/characterCreationMachine.types";
import { WizardLayout } from "@/components/CreateCharWizard/components/WizardLayout/WizardLayout";

export const ClassSelectPanel = () => {
  const { characterCreationMachineSend, characterCreationMachineContext } =
    useCharacterCreationMachine();

  const characterClass =
    characterCreationMachineContext.values.character.characterClass;

  const handleCharacterClick = useCallback(
    (character: CharacterClass) => {
      characterCreationMachineSend({
        type: "SET_CLASS",
        data: {
          characterClass: character,
        },
      });
    },
    [characterCreationMachineSend],
  );

  const handleSubmit = useCallback(() => {
    if (characterClass) {
      characterCreationMachineSend({
        type: "CONTINUE",
      });
    }
  }, [characterClass, characterCreationMachineSend]);

  return (
    <WizardLayout title="Create Character" hasBack={true} hasClose={true}>
      <div className="p-6">
        <p>Please select a class</p>

        <div className="grid grid-cols-2 gap-4 mt-6">
          {characters.map((character) => (
            <button
              key={character}
              onClick={() => handleCharacterClick(character)}
              className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all cursor-pointer ${
                characterClass === character
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400 bg-white"
              }`}
            >
              <img
                src={`${import.meta.env.BASE_URL}images/char/${character}.webp`}
                alt={`${character} character`}
                className="w-32 h-32 object-contain mb-2"
              />
              <span className="text-lg font-medium capitalize">
                {character}
              </span>
            </button>
          ))}
        </div>
      </div>

      <WizardFooter
        handleContinue={handleSubmit}
        continueButtonText="Continue"
        continueDisabled={!characterClass}
      />
    </WizardLayout>
  );
};
