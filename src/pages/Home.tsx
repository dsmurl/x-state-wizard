import reactLogo from "../assets/react.svg?url";

import { CreateCharDialog } from "@/components/CreateCharDialog/CreateCharDialog";
import { DebugContextProvider } from "@/components/DebugPanel/DebugContextProvider";

const HomeContent = () => {
  return (
    <div className="flex flex-col items-center min-h-screen pt-20">
      <img src={reactLogo} className="logo react" alt="React logo" />
      <h1 className="text-3xl font-bold underline">xState Wizard!</h1>
      <div className="pt-20">
        <CreateCharDialog />
      </div>
    </div>
  );
};

export const Home = () => (
  <DebugContextProvider>
    <HomeContent />
  </DebugContextProvider>
);
