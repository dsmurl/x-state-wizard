import { FC, ReactNode, useCallback } from "react";

import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeftIcon, Cross1Icon } from "@radix-ui/react-icons";

import { Button } from "@/ui/Button";
import { useCharacterCreationMachine } from "@/machines/characterCreationMachine/useCharacterCreationMachine";

type WizardLayoutProps = {
  title: string;
  children: ReactNode;
  hasBack?: boolean;
  hasClose?: boolean;
};

export const WizardLayout: FC<WizardLayoutProps> = ({
  title,
  children,
  hasBack,
  hasClose,
}) => {
  const { characterCreationMachineSend } = useCharacterCreationMachine();

  const handleClose = useCallback(() => {
    characterCreationMachineSend({ type: "CLOSE" });
  }, [characterCreationMachineSend]);

  const handleBack = useCallback(() => {
    characterCreationMachineSend({ type: "GO_BACK" });
  }, [characterCreationMachineSend]);

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-md overflow-hidden min-w-[320px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white gap-3 border-b border-b-gray-300">
        <div className="flex items-center">
          {hasBack ? (
            <Button
              onClick={handleBack}
              aria-label="Back"
              data-testid="wizard-layout-back-button"
              className="mr-5"
            >
              <ChevronLeftIcon className="h-5 w-5 text-black" />
            </Button>
          ) : null}
          <h2 className="text-xl font-medium text-gray-900">{title}</h2>
        </div>
        {hasClose ? (
          <Dialog.Close asChild>
            <Button
              onClick={handleClose}
              aria-label="Close"
              data-testid="wizard-layout-close-button"
            >
              <Cross1Icon className="h-5 w-5" />
            </Button>
          </Dialog.Close>
        ) : null}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-white">{children}</div>
    </div>
  );
};
