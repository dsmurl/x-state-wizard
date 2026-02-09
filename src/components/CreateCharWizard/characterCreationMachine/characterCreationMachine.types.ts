// Character types
import { fromPromise, setup } from "xstate";
import { createCharacterPost } from "@/components/CreateCharWizard/characterCreationMachine/api/createCharacterPost";

export const characters = ["warrior", "wizard", "archer", "nerd"] as const;
export type CharacterClass = (typeof characters)[number];

// Item types
export const items = ["ring", "potion", "crown", "calc"] as const;
export type Item = (typeof items)[number];

export type Character = {
  name?: string;
  characterClass?: CharacterClass;
  item?: Item;
};

export type CharacterCreationMachineActions = {
  onClose: () => void;
  onFlowSuccess: ({ character }: { character: Character }) => void;
};

export type CharacterCreationContext = {
  values: {
    character: Character;
  };
  actions: CharacterCreationMachineActions;
};

export type CharacterCreationEvent =
  | {
      type: "CONFIG";
      data: {
        onClose: () => void;
        onFlowSuccess: ({ character }: { character: Character }) => void;
      };
    }
  | { type: "SET_NAME"; data: { name: string } }
  | { type: "SET_CLASS"; data: { characterClass: CharacterClass } }
  | { type: "SET_ITEM"; data: { item: Item } }
  | { type: "CONTINUE" }
  | { type: "CLOSE" }
  | { type: "GO_BACK" }
  | { type: "RETRY" }
  | { type: "RESET" };
