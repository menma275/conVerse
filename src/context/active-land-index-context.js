"use client";
import React, { createContext, useContext, useState } from "react";

const ActiveLandIndexContext = createContext();

export const useActiveLandIndex = () => {
  return useContext(ActiveLandIndexContext);
};

export const ActiveLandIndexProvider = ({ children }) => {
  const [activeLandIndex, setActiveLandIndex] = useState(null);

  return <ActiveLandIndexContext.Provider value={{ activeLandIndex, setActiveLandIndex }}>{children}</ActiveLandIndexContext.Provider>;
};
