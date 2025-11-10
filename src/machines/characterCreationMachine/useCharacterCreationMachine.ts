import { useCallback } from "react";

import {
  CharacterCreationEvent,
  CharacterCreationMachineActions,
} from "./characterCreationMachine";
import { characterCreationContext } from "./characterCreationMachine";

export const useCharacterCreationMachine = () => {
  const xStateActor = characterCreationContext.useActorRef();
  const characterCreationMachineState = characterCreationContext.useSelector(
    (state) => state.value,
  );
  const characterCreationMachineContext = characterCreationContext.useSelector(
    (state) => state.context,
  );

  const configureMachine = useCallback(
    ({ onFlowSuccess, onClose }: CharacterCreationMachineActions) => {
      if (characterCreationMachineState === "INIT") {
        // Send configuration to the machine to choose next state
        xStateActor.send({
          type: "CONFIG",
          data: { onClose, onFlowSuccess },
        });

        // xStateActor.start();  // xState v5 may auto start the machine
      }
    },
    [characterCreationMachineState, xStateActor],
  );

  const wrappedSend = (event: CharacterCreationEvent) => {
    // log or watch state changes here
    // console.log(
    //   `[ characterCreationMachine, state: ${characterCreationMachineState} ] Sending event to machine ::: `,
    //   event,
    // );
    xStateActor.send(event);
  };

  return {
    configureMachine,
    characterCreationMachineSend: wrappedSend,
    characterCreationMachineState,
    characterCreationMachineContext,
  };
};
