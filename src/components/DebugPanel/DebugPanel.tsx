import { useDebugContext } from "@/components/DebugPanel/DebugContextProvider";

const getBackgroundColor = (index: number) => {
  if (index === 0) return "bg-green-300"; // Brightest - most recent
  if (index === 1) return "bg-green-200"; // Very bright
  if (index === 2) return "bg-green-100"; // Medium bright
  if (index === 3) return "bg-green-50"; // Light
  if (index === 4) return "bg-green-50/70"; // Very light
  return "bg-green-50/50"; // Lightest for older messages
};

export const DebugPanel = () => {
  const {
    values: { messageList, currentState, currentContext },
  } = useDebugContext();

  return (
    <div>
      <div
        data-testid="message-list"
        className="fixed top-0 left-0 z-[9999] w-96 border border-black p-2 rounded bg-blue-100 shadow-lg overflow-y-auto text-[10pt] text-left pointer-events-auto"
      >
        <div>State:</div>
        <div className="pl-2 pb-2">{currentState}</div>
        <div>Context:</div>
        <div className="pl-2 pb-2">
          <pre className="text-[7pt] whitespace-pre-wrap break-words">
            {JSON.stringify(currentContext, null, 2)}
          </pre>
        </div>
      </div>

      <div
        data-testid="message-list"
        className="fixed top-0 right-0 z-[9999]  w-96 border border-black p-2 rounded bg-blue-100 shadow-lg overflow-y-auto text-[10pt] text-left pointer-events-auto"
      >
        <div>Messages:</div>
        {[...messageList].reverse().map((message, index) => (
          <div
            data-testid="message-item"
            key={index}
            className={`mb-2 ${getBackgroundColor(index)} border border-black rounded p-2`}
          >
            <pre className="text-[7pt] whitespace-pre-wrap break-words">
              {JSON.stringify(message, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};
