import { assign, fromPromise, setup } from "xstate";
import { createActorContext } from "@xstate/react";
import { crappyNetworkClient } from "@/crappyApiClient/crappyNetworkClient";

export type Character = {
  name?: string;
  characterClass?: string;
  item?: string;
};

type CharacterCreationContext = {
  values: {
    character: Character;
  };
  actions: {
    onComplete?: (character: Character) => void;
  };
};

export type CharacterCreationEvent =
  | {
      type: "CONFIG";
      data: {
        onComplete: (character: Character) => void;
      };
    }
  | { type: "SET_NAME"; data: { name: string } }
  | { type: "SET_CLASS"; data: { characterClass: string } }
  | { type: "SET_ITEM"; data: { item: string } }
  | { type: "CONTINUE" }
  | { type: "GO_BACK" }
  | { type: "RETRY" }
  | { type: "CREATION_FAILED" }
  | { type: "CREATION_SUCCEEDED" }
  | { type: "RESET" };

export const characterCreationMachine = setup({
  types: {
    context: {} as CharacterCreationContext,
    events: {} as CharacterCreationEvent,
  },
  actors: {
    createCharacter: fromPromise(async () => {
      return await crappyNetworkClient.createCharacter();
    }),
  },
  actions: {
    trackUnhandledEvent: ({ event, context }, params: { state: string }) => {
      console.warn(
        `Tracking event: event [${event.type}] from state [${params.state}] with context:`,
        context,
      );
    },
  },
}).createMachine({
  id: "characterCreationMachine",
  initial: "INIT",
  context: {
    values: { character: {} },
    actions: {
      onComplete: undefined,
    },
  },
  states: {
    INIT: {
      entry: assign({}),
      on: {
        CONFIG: {
          actions: [
            assign(({ event, context }) => ({
              ...context,
              actions: {
                ...context.actions,
                onComplete: event.data.onComplete,
              },
            })),
          ],
          target: "NAME_SELECTION",
        },
        "*": {
          actions: [{ type: "trackUnhandledEvent", params: { state: "INIT" } }],
        },
      },
    },
    NAME_SELECTION: {
      on: {
        SET_NAME: {
          actions: [
            assign({
              values: ({ context, event }) => {
                console.log("  MACHINE set new name  ::: ", event.data.name);
                return {
                  ...context.values,
                  character: {
                    ...context.values.character,
                    name: event.data.name,
                  },
                };
              },
            }),
          ],
        },
        CONTINUE: {
          target: "CLASS_SELECTION",
        },
        "*": {
          actions: [
            {
              type: "trackUnhandledEvent",
              params: { state: "NAME_SELECTION" },
            },
          ],
        },
      },
    },
    CLASS_SELECTION: {
      on: {
        SET_CLASS: {
          actions: [
            assign({
              values: ({ context, event }) => {
                console.log(
                  "  MACHINE set new characterClass  ::: ",
                  event.data.characterClass,
                );
                return {
                  ...context.values,
                  character: {
                    ...context.values.character,
                    characterClass: event.data.characterClass,
                  },
                };
              },
            }),
          ],
        },
        CONTINUE: {
          target: "ITEM_SELECTION",
        },
        GO_BACK: {
          target: "NAME_SELECTION",
        },
        "*": {
          actions: [
            {
              type: "trackUnhandledEvent",
              params: { state: "CLASS_SELECTION" },
            },
          ],
        },
      },
    },
    ITEM_SELECTION: {
      on: {
        SET_ITEM: {
          actions: [
            assign({
              values: ({ context, event }) => {
                console.log("  MACHINE set new item  ::: ", event.data.item);
                return {
                  ...context.values,
                  character: {
                    ...context.values.character,
                    item: event.data.item,
                  },
                };
              },
            }),
          ],
        },
        GO_BACK: {
          target: "CLASS_SELECTION",
        },
        CONTINUE: {
          target: "CREATING_CHARACTER",
        },
        "*": {
          actions: [
            {
              type: "trackUnhandledEvent",
              params: { state: "ITEM_SELECTION" },
            },
          ],
        },
      },
    },
    CREATING_CHARACTER: {
      invoke: {
        src: "createCharacter",
        onDone: {
          target: "CREATION_SUCCESS",
        },
        onError: {
          target: "CREATION_FAIL",
        },
      },
      on: {
        "*": {
          actions: [
            {
              type: "trackUnhandledEvent",
              params: { state: "CREATING_CHARACTER" },
            },
          ],
        },
      },
    },
    CREATION_FAIL: {
      on: {
        RETRY: {
          target: "NAME_SELECTION",
        },
        "*": {
          actions: [
            {
              type: "trackUnhandledEvent",
              params: { state: "CREATION_FAIL" },
            },
          ],
        },
      },
    },
    CREATION_SUCCESS: {
      on: {
        CONTINUE: {
          target: "CLOSING",
        },
        "*": {
          actions: [
            {
              type: "trackUnhandledEvent",
              params: { state: "CREATION_SUCCESS" },
            },
          ],
        },
      },
    },
    CLOSING: {
      type: "final",
      entry: [
        ({ context }) => {
          console.log(
            "Character creation completed with values:",
            context.values,
          );
          context.actions.onComplete?.(context.values.character);
        },
        assign({
          values: () => ({ character: {} }), // Reset values after completion
          actions: ({ context }) => ({
            ...context.actions,
            onComplete: undefined, // Clear onComplete callback
          }),
        }),
      ],
    },
  },
});

export const characterCreationContext = createActorContext(
  characterCreationMachine,
);
