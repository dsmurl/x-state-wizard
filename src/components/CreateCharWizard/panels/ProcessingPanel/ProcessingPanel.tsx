import { ProgressBar } from "@/ui/ProgressBar";
import { WizardLayout } from "@/components/CreateCharWizard/components/WizardLayout/WizardLayout";

export const ProcessingPanel = () => {
  return (
    <WizardLayout title="Create Character" hasClose={false}>
      <div className="p-6">
        <p>Creating your character with a crappy api.</p>
        <div>(50/50 success rate)</div>

        <div className="p-6">
          <ProgressBar waitTime={2000} />
        </div>
      </div>
    </WizardLayout>
  );
};
