import { useState, useEffect } from "react";

const useCountdownTimer = (startTime, duration) => {
  const [isParticipationTime, setIsParticipationTime] = useState(true);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (startTime) {
      const [startHours, startMinutes] = startTime.split(":").map(Number);
      let startTimeDate = new Date();
      startTimeDate.setHours(startHours, startMinutes, 0, 0);
      let endTime = new Date(startTimeDate.getTime() + duration * 60000);

      const updateCountdown = () => {
        const now = new Date();
        const participationPeriod = now >= startTimeDate && now <= endTime;
        setIsParticipationTime(participationPeriod);

        if (participationPeriod) {
          const diff = endTime - now;
          if (diff <= 0) {
            setCountdown("");
          } else {
            const hours = Math.floor(diff / (1000 * 60 * 60))
              .toString()
              .padStart(2, "0");
            const minutes = Math.floor((diff / (1000 * 60)) % 60)
              .toString()
              .padStart(2, "0");
            const seconds = Math.floor((diff / 1000) % 60)
              .toString()
              .padStart(2, "0");
            setCountdown(`${hours}:${minutes}:${seconds}`);
          }
        }
      };

      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    } else {
      setIsParticipationTime(true);
      setCountdown("");
    }
  }, [startTime, duration]);

  return { isParticipationTime, countdown };
};

export default useCountdownTimer;
