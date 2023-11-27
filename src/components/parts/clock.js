"use client";

import React from "react";
import { useState, useEffect } from "react";

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString([], {
      // year: "numeric",
      // month: "2-digit",
      // day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  );
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString([], {
          // year: "numeric",
          // month: "2-digit",
          // day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }, 1000);

    return () => clearInterval(intervalId);
  }, []); // useEffectのクリーンアップ
  return (
    <div className="flex w-20 justify-center contents-center h-full pixel-shadow">
      <p className="my-auto contents-center text-xs text-[var(--cream)]">
        {currentTime}
      </p>
    </div>
  );
};
export default Clock;
