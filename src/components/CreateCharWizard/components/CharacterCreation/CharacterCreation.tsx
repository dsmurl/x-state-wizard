import { ProgressBar } from "@/ui/ProgressBar";

export const CharacterCreation = () => {
  return (
    <div>
      <div className="p-6">
        <p>Creating your character with a crappy api.</p>
        <div>(50/50 success rate)</div>

        <div className="p-6">
          <ProgressBar waitTime={2000} />
        </div>
      </div>
    </div>
  );
};
