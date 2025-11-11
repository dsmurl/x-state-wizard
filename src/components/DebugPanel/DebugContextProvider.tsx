import React, { useCallback } from "react";
import { AnyEventObject } from "xstate";

const debugContext = React.createContext({
  values: {
    messageList: [] as AnyEventObject[],
    currentState: "",
    currentContext: "",
  },
  actions: {
    addMessage: ({ message }: { message: AnyEventObject }) => {},
    clearMessages: () => {},
    setNewState: ({ newState }: { newState: string }) => {},
    setNewContext: ({ newContext }: { newContext: any }) => {},
  },
});

export const DebugContextProvider = ({ children }: React.PropsWithChildren) => {
  const [messageList, setMessageList] = React.useState<AnyEventObject[]>([]);
  const [currentState, setSetCurrentState] = React.useState("");
  const [currentContext, setSetCurrentContext] = React.useState("");

  const addMessage = useCallback(
    ({ message }: { message: AnyEventObject }) => {
      const newMessageList: AnyEventObject[] = [...messageList, message];
      setMessageList(newMessageList);
    },
    [messageList],
  );

  const clearMessages = useCallback(() => {
    setMessageList([]);
  }, [setMessageList]);

  const setNewState = useCallback(
    ({ newState }: { newState: string }) => {
      setSetCurrentState(newState);
    },
    [setSetCurrentState],
  );

  const setNewContext = useCallback(
    ({ newContext }: { newContext: string }) => {
      setSetCurrentContext(newContext);
    },
    [setSetCurrentContext],
  );

  const contextValue = React.useMemo(
    () => ({
      values: {
        messageList,
        currentState,
        currentContext,
      },
      actions: {
        addMessage,
        clearMessages,
        setNewState,
        setNewContext,
      },
    }),
    [
      addMessage,
      clearMessages,
      currentContext,
      currentState,
      messageList,
      setNewContext,
      setNewState,
    ],
  );

  return (
    <debugContext.Provider value={contextValue}>
      {children}
    </debugContext.Provider>
  );
};

export const useDebugContext = () => React.useContext(debugContext);
