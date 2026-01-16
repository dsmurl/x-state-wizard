import { useCallback } from "react";

import { WizardFooter } from "@/components/CreateCharWizard/components/WizardFooter/WizardFooter";
import { useCharacterCreationMachine } from "@/machines/characterCreationMachine/useCharacterCreationMachine";
import {
  type Item,
  items,
} from "@/machines/characterCreationMachine/characterCreationMachine.types";

export const ItemSelect = () => {
  const { characterCreationMachineSend, characterCreationMachineContext } =
    useCharacterCreationMachine();

  const item = characterCreationMachineContext.values.character.item;

  const handleItemClick = useCallback(
    (item: Item) => {
      characterCreationMachineSend({
        type: "SET_ITEM",
        data: {
          item: item,
        },
      });
    },
    [characterCreationMachineSend],
  );

  const handleSubmit = useCallback(() => {
    if (item) {
      characterCreationMachineSend({
        type: "CONTINUE",
      });
    }
  }, [characterCreationMachineSend, item]);

  return (
    <div>
      <div className="p-6">
        <p>Please select an item</p>

        <div className="grid grid-cols-2 gap-4 mt-6">
          {items.map((anItem) => (
            <button
              key={anItem}
              onClick={() => handleItemClick(anItem)}
              className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all cursor-pointer ${
                item === anItem
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400 bg-white"
              }`}
            >
              <img
                src={`${import.meta.env.BASE_URL}images/items/${anItem}.webp`}
                alt={`${anItem} item`}
                className="w-32 h-32 object-contain mb-2"
              />
              <span className="text-lg font-medium capitalize">{anItem}</span>
            </button>
          ))}
        </div>
      </div>

      <WizardFooter
        handleContinue={handleSubmit}
        continueButtonText="Continue"
        continueDisabled={!item}
      />
    </div>
  );
};
