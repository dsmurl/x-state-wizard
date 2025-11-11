import { useEffect } from "react";

import { characterCreationContext } from "@/machines/characterCreationMachine/characterCreationMachine";
import { useDebugContext } from "@/components/DebugPanel/DebugContextProvider";

// Just for debugging to the DebugPanel
// This component must be placed inside characterCreationContext.Provider
export const CharacterCreationContextDebugSubscriber = () => {
  const {
    actions: { addMessage, clearMessages, setNewState, setNewContext },
  } = useDebugContext();

  const xStateActor = characterCreationContext.useActorRef();

  useEffect(() => {
    const subscription = xStateActor.subscribe((snapshot) => {
      setNewState({ newState: snapshot.value });
      setNewContext({ newContext: snapshot.context });
    });

    return () => subscription.unsubscribe();
  }, [setNewContext, setNewState, xStateActor]);

  useEffect(() => {
    const subscription = xStateActor.system.inspect((inspectionEvent) => {
      if (inspectionEvent.type === "@xstate.event") {
        addMessage({ message: inspectionEvent.event });
      }
    });

    return () => subscription.unsubscribe();
  }, [addMessage, xStateActor]);

  useEffect(() => {
    return clearMessages;
  }, [clearMessages]);

  return null; // This component only subscribes, doesn't render anything
};
