"use client";
import React, { createContext, useContext, useState } from "react";

const ActiveSpaceIndexContext = createContext();

export const useActiveSpaceIndex = () => {
  return useContext(ActiveSpaceIndexContext);
};

export const ActiveSpaceIndexProvider = ({ children }) => {
  const [activeSpaceIndex, setActiveSpaceIndex] = useState(null);

  return <ActiveSpaceIndexContext.Provider value={{ activeSpaceIndex, setActiveSpaceIndex }}>{children}</ActiveSpaceIndexContext.Provider>;
};
