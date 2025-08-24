import { ChangeEvent, useCallback } from "react";

import * as Form from "@radix-ui/react-form";

import { useCharacterCreationMachine } from "@/machines/characterCreationMachine/useCharacterCreationMachine";
import { WizardFooter } from "@/components/CreateCharWizard/components/WizardFooter/WizardFooter";

export const NameSelect = () => {
  const { characterCreationMachineSend, characterCreationMachineContext } =
    useCharacterCreationMachine();

  const name = characterCreationMachineContext.values.character.name;

  const handleNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      characterCreationMachineSend({
        type: "SET_NAME",
        data: { name: e.target.value },
      });
    },
    [characterCreationMachineSend],
  );

  const handleSubmit = useCallback(() => {
    characterCreationMachineSend({
      type: "CONTINUE",
    });
  }, [characterCreationMachineSend]);

  return (
    <div>
      <div className="p-6">
        <p>Choose your character's name</p>

        <Form.Root className="w-full max-w-md mx-auto" onSubmit={handleSubmit}>
          <Form.Field name="characterName" className="mb-4">
            <div className="flex justify-between items-baseline mb-2">
              <Form.Message
                className="text-sm text-red-500"
                match="valueMissing"
              >
                Please enter a name
              </Form.Message>
            </div>
            <Form.Control asChild>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Name"
                required
              />
            </Form.Control>
          </Form.Field>
        </Form.Root>
      </div>

      <WizardFooter
        handleContinue={handleSubmit}
        continueButtonText="Continue"
        continueDisabled={!name?.trim()}
      />
    </div>
  );
};
