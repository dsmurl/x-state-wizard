import { useState } from "react";

import * as Dialog from "@radix-ui/react-dialog";

import { Button } from "@/ui/Button";
import { CreateCharWizard } from "@/components/CreateCharWizard/CreateCharWizard";

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
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-4xs  -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-lg focus:outline-none">
          <CreateCharWizard setIsOpen={setIsOpen} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
