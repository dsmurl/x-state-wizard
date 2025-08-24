import { assign, fromPromise, setup } from "xstate";
import { createActorContext } from "@xstate/react";
import { crappyNetworkClient } from "@/crappyApiClient/crappyNetworkClient";

import {
  CharacterClass,
  Item,
} from "@/machines/characterCreationMachine/characterCreationMachine.types";

export type Character = {
  name?: string;
  characterClass?: CharacterClass;
  item?: Item;
};

export type CharacterCreationMachineActions = {
  onClose: () => void;
  onComplete: ({ character }: { character: Character }) => void;
};

type CharacterCreationContext = {
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
        onComplete: ({ character }: { character: Character }) => void;
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
  guards: {
    hasValidName: ({ context }) => {
      return Boolean(context.values.character.name?.trim());
    },
    hasValidClass: ({ context }) => {
      return Boolean(context.values.character.characterClass);
    },
    hasValidItem: ({ context }) => {
      return Boolean(context.values.character.item);
    },
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
  /** @xstate-layout N4IgpgJg5mDOIC5QGMAWBDATu5AXMmAwpmOrgJYD2AdgLI6rnVgB0AkgHJsAqAxIQHkOAMTYBxANoAGALqJQAB0qxyFGvJAAPRAFoAbAA4ATCwDsAVilGAjNdMBmK+YP2ANCACeiS3pb3zRnrWBqZGplIAnAYALOYAvnHuaFg4+EQkZFR0DEysnDy8AFTSckggSipq1BraCDoGESYGUub2BrbW5nqmBnruXght9maN0XrR1hHRUtGmeglJGNh4BMSkVfRouSwcAIK0AKIA+gDKBwAyB4TcbEK8Z9xHe4clGhWqWTW69hG+PzZjcIxcwRNyeRD2PTmFh6ezWGamCLhIzTawLEDJZZpNaZGibRjMHb7Y5nS7XW4cfjnARnV5ld5VL51aL2aIseFQ2LNBwxaL9bwRCIsHyRSFGez2FHozGpVYZDY5QnPEkXK43O6CDg3DgAVQOdMUyg+6jKtR04usZhsEXME3hLkFfXBCACQqkiOCjTaBga0qWsvS6yy+O2ytOqvJd2KsjeRsZpt00yFkJt0RZESknXG-IQRgCLAasPFxjT1nspmifpSK0DuOyW0JhHOuxOJ3DZPVlIeRybLZOBvKcc+CYQ0TCLCsUh+cIcoJ6OfLvhts8FUnG1kMVaxcqDeMVrF7rfbaopvDEAiOACFdoQANIDhnD0C1IyBCdGKKSuGw0ymHNjAwzBBKQQNsHxWnmRIMX9GscQVBsD2bI9SRPDVqVpGN6SHE1nwhZoWDHNprFiEFZihHMQSFEVQT0cVJUrKCZVg+Vg33FhDzbFDI0pTVtT1B9sOqEdgInaJBWCNpYhZP9nVdCcPQaYsfQiLcAzg1iEPYpDOIjTsigEyony0RAJhMO0xglWZQXaHMjBCMwgmmQJ2kMMIGMWatsRYvdNJ4A5aGPbj7gOR4-NoAzjSE3CEGsYsCzTCJiMMcZy3MBdGhYOzIQrZFenheJGJgrzd3rAk8m4fzAr088rxve9MMNQycOMmKpBidlHA3Kd-iiNLZMFYU11FWiJSlQrPJ3OsQ0JMKqtPJsaX1BrByaqKWti1kC1TFoohZUUKIG6ixVG9zoIm2t4LK9gKoCri9N4zh+OWx9mtqMs9CFBoWi6H1bD0WEKI-eTEsU71fXG7cLo0q7Zru09o1KRrIqZWLggLboXB+EJpliBcWgIoJPXLd1WSMVTmJK6aDwAJQOXZtTEHsAAldmpm8Kup3gIBoVgmAAN0oABrVgmOKqa2MIWn6c4RnCBZtnrgOamEH5yhkDrEoIvjaLJnw1pQWIrpYQMAIc3+4ZiMcRKx1CbpII8yH1J8q7JbphnmdZ9mld4AhMEoTAWAUAAbMgADN-YAWxYUXJsu7ZXeljhZflr3ldV9Wqk157BJRuZLQCDdLBcUw7HMPqBnN9k9utsJAjmcmxbjxspfduXPcVzmEdjVaUZ9NkNvCHoy3oowFwrPx11-NprIghvY+h+OW4pI5hF2Nhzl4WnuGpgBNLWjLeyvnG6SUy2cQI+WdXpoQrECAhPjdTDnqHncXt3l9X9f9OznuR2CcUCxdDHIRaekocypgnDECUsUQjikRM-J2pU37SyEKcHUhBCAHFbPwIQfElqIxWsjEcKIAEVl5P4c+-1AZugUl6H0DQ0QQzUt5JBzd36oJOOgzB2Cu5YV-tFV8toYSxCiLCLM2N0rDB6JCYwFhCxjSgtQSgEA4AaBji-VhYBu5EOijoKYUgCwtCImBDGToBiFz8L8D8JdLBOXsAglhVN2BcG4No7WLV6h5hhOYOYkk7C9UvgMOS7oQZ0OUg4ymbEwxwyEG4g+iZLB+HorMEIqS7DUOBmWaILgoRQgMBE8WmkOJzViXwnRLV-BujaGXZwrRFyBO8EDEJnolLgwdswyJvkbolI4HE16iA-pCgrJbSULgGkuiaR6VkOSujOAKU3Gm78k4ewVhzPpa03rNEtDaFEtFzCdFPuXbw+MfEgzap+Vk9szqO0cRLJeqDP7nHWbnHoDk-G2myUiAwOZr5mGmC0Ou34n5MIpoUl29yOBoIwVgk4zziHBDZJ1HxrpclTAySElEkJTIbXmQvRs6EZZwuiv4NkHoQI-H+T0boOZbBvkcD6SwlscnAvaaChZ7EU4dx7AIWgAAFS4FUAAiRKWq10+rOeEcwrBpjMSZDKr4ZhwglD8DGCQEhAA */
  id: "characterCreationMachine",
  initial: "INIT",
  context: {
    values: { character: {} },
    actions: {
      onClose: () =>
        console.warn(
          "characterCreationMachine action onClose was called before initialized",
        ),
      onComplete: () =>
        console.warn(
          "characterCreationMachine action onComplete was called before initialized",
        ),
    },
  },
  states: {
    INIT: {
      on: {
        CONFIG: {
          actions: [
            assign(({ event, context }) => ({
              ...context,
              actions: {
                ...context.actions,
                onClose: event.data.onClose,
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
        CLOSE: {
          target: "CLOSING",
        },
        CONTINUE: {
          guard: "hasValidName",
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
        GO_BACK: {
          target: "NAME_SELECTION",
        },
        CLOSE: {
          target: "CLOSING",
        },
        CONTINUE: {
          guard: "hasValidClass",
          target: "ITEM_SELECTION",
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
        CLOSE: {
          target: "CLOSING",
        },
        CONTINUE: {
          guard: "hasValidItem",
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
          target: "CHARACTER_COMPLETED",
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
          context.actions.onClose();
        },
        assign({
          values: () => ({ character: {} }), // Reset values
        }),
      ],
    },
    CHARACTER_COMPLETED: {
      type: "final",
      entry: [
        ({ context }) => {
          context.actions.onComplete({ character: context.values.character });
        },
        assign({
          values: () => ({ character: {} }), // Reset values
        }),
      ],
    },
  },
});

export const characterCreationContext = createActorContext(
  characterCreationMachine,
);
