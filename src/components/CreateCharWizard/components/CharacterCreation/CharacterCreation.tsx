import { ProgressBar } from "@/ui/ProgressBar";

export const CharacterCreation = () => {
  return (
    <div>
      <div className="p-6">
        <p>Creating your character. (50/50 success rate)</p>

        <div className="p-6">
          <ProgressBar waitTime={2000} />
        </div>
      </div>
    </div>
  );
};
