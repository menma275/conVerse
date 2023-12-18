"use client";

import React from "react";
import Clock from "@/components/parts/clock";
import { useState, useEffect } from "react";
import CreateButtonFooter from "@/components/parts/create-button-footer";
import Start from "@/components/space-type/start";

const Footer = ({ children }) => {
  const [isOpenStartMenu, setIsOpenStartMenu] = useState(true);
  return (
    <>
      {/* {isOpenStartMenu && <Start />} */}
      <footer className="fixed bottom-0 left-0 w-full bg-[var(--accent)] h-8 pixel-shadow z-50">
        <div className="h-full flex justify-between">
          <div className="flex">
            <button
              onClick={() => setIsOpenStartMenu(!isOpenStartMenu)}
              className="h-full flex pixel-shadow px-3 gap-3"
            >
              <img
                className="h-1/3 my-auto"
                src="/gundi-logo-g.svg"
                alt="Gundi"
              />
              <p className="my-auto text-xs text-[var(--cream)]">Welcome</p>
            </button>
            {children}
          </div>
          <div className="flex">
            <CreateButtonFooter />
            <Clock />
          </div>
        </div>
      </footer>
    </>
  );
};
export default Footer;
