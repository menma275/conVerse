"use client";
import React, { createContext, useContext, useState } from "react";

const LandEntranceContext = createContext();

export const useLandEntrance = () => {
  return useContext(LandEntranceContext);
};

export const LandEntranceProvider = ({ children }) => {
  const [openLandId, setOpenLandId] = useState(null);
  const [activeLandIndex, setActiveLandIndex] = useState(null); // 追加

  return <LandEntranceContext.Provider value={{ openLandId, setOpenLandId, activeLandIndex, setActiveLandIndex }}>{children}</LandEntranceContext.Provider>;
};
