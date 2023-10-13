"use client";
import React, { createContext, useContext, useState } from "react";

const OpenSpaceIdContext = createContext();

export const useOpenSpaceId = () => {
  return useContext(OpenSpaceIdContext);
};

export const OpenSpaceIdProvider = ({ children }) => {
  const [openSpaceId, setOpenSpaceId] = useState(null);

  return <OpenSpaceIdContext.Provider value={{ openSpaceId, setOpenSpaceId }}>{children}</OpenSpaceIdContext.Provider>;
};
