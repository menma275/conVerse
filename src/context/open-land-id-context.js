"use client";
import React, { createContext, useContext, useState } from "react";

const OpenLandIdContext = createContext();

export const useOpenLandId = () => {
  return useContext(OpenLandIdContext);
};

export const OpenLandIdProvider = ({ children }) => {
  const [openLandId, setOpenLandId] = useState(null);

  return <OpenLandIdContext.Provider value={{ openLandId, setOpenLandId }}>{children}</OpenLandIdContext.Provider>;
};
