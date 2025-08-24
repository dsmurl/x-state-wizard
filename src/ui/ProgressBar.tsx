// src/components/ProgressTimer/ProgressTimer.tsx
import { useEffect, useState } from "react";
import { Progress } from "@radix-ui/react-progress";

interface ProgressBarProps {
  waitTime: number; // Duration in milliseconds
  className?: string;
  onComplete?: () => void;
}

export const ProgressBar = ({
  waitTime,
  className = "",
  onComplete,
}: ProgressBarProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Update interval in ms
    const updateInterval = 50;
    // Calculate the progress increment per interval
    const progressIncrement = (updateInterval / waitTime) * 100;

    // Set the interval to update progress
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + progressIncrement;

        if (newProgress >= 100) {
          onComplete?.();
          return 100;
        }

        return newProgress;
      });
    }, updateInterval);

    // Clear the interval after waitTime
    const cleanup = setTimeout(() => {
      clearInterval(timer);
    }, waitTime);

    // Cleanup on component unmount
    return () => {
      clearInterval(timer);
      clearTimeout(cleanup);
    };
  }, [waitTime, onComplete]);

  return (
    <div className={`w-full ${className}`}>
      <Progress
        value={progress}
        className="h-2 w-full overflow-hidden rounded-full bg-gray-200"
      >
        <div
          className="h-full bg-blue-500 transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </Progress>
    </div>
  );
};
