import { useState } from "react";

import * as Dialog from "@radix-ui/react-dialog";

import { Button } from "@/ui/Button";
import { CreateCharacterWizard } from "@/components/CreateCharWizard/CreateCharacterWizard";
import { DebugPanel } from "@/components/DebugPanel/DebugPanel";

export const CreateCharDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild className="cursor-pointer">
        <Button
          aria-label="Close"
          data-testid="launch-wizard-button"
          variant="enlightened"
        >
          Open Wizard
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 pointer-events-none" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 max-h-[85vh] w-4xs  -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-lg focus:outline-none pointer-events-auto"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <CreateCharacterWizard setIsOpen={setIsOpen} />
        </Dialog.Content>
        <DebugPanel />
      </Dialog.Portal>
    </Dialog.Root>
  );
};
