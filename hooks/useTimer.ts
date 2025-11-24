// hooks/useTimer.ts
import { useState, useEffect, useRef } from 'react';

export const useTimer = (
  durationInSeconds: number,
  onTimeUp: () => void,
  paused: boolean = false // Add a 'paused' parameter
) => {
  const [secondsLeft, setSecondsLeft] = useState(durationInSeconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update initial time if duration changes (e.g., on load)
  useEffect(() => {
    setSecondsLeft(durationInSeconds);
  }, [durationInSeconds]);

  useEffect(() => {
    // If we are paused, or time is 0, do nothing.
    if (paused || secondsLeft <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    // Start the timer
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          onTimeUp(); // Call the callback when time is up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Clear interval on unmount or if paused
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [onTimeUp, paused, secondsLeft]); // Re-run when 'paused' changes

  // Function to format time (e.g., 125 seconds -> "02:05")
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0'
    )}`;
  };

  return {
    secondsLeft,
    formattedTime: formatTime(secondsLeft),
  };
};