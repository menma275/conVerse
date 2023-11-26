"use client";

import React from "react";
import { useState, useEffect } from "react";
import CreateButtonFooter from "@/components/parts/create-button-footer";

const Footer = () => {
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
    <footer className="fixed bottom-0 left-0 w-full bg-[var(--accent)] h-8 pixel-shadow z-50">
      <div className="h-full flex justify-between">
        {/* Gundiロゴ */}
        <button className="h-full flex pixel-shadow px-3 gap-3">
          <img className="h-1/3 my-auto" src="/gundi-logo-g.svg" alt="Gundi" />
          <p className="my-auto text-xs text-[var(--cream)]">Welcome</p>
        </button>
        <div className="flex">
          <CreateButtonFooter />
          <div className="flex w-20 justify-center contents-center h-full pixel-shadow">
            <p className="my-auto contents-center text-xs text-[var(--cream)]">
              {currentTime}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
