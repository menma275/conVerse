"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useOpenSpaceId } from "@/context/open-space-id-context";

import ASCIIArtClock from "../space-type/ascii-art-clock";

const Clock = () => {
  const [isOpen, setIsOpen] = useState(true);
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
    <button
      className="flex w-20 justify-center contents-center h-full pixel-shadow"
      onClick={() => {
        setIsOpen(!isOpen);
      }}
    >
      <p className="my-auto contents-center text-xs text-[var(--cream)]">
        {currentTime}
      </p>
    </button>
  );
};
export default Clock;
