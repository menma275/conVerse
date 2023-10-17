"use client";
import React, { createContext, useContext, useState } from "react";

const DraggingContext = createContext();

export const useDraggingContext = () => {
  return useContext(DraggingContext);
};

export const DraggingProvider = ({ children }) => {
  const [isCardDragging, setIsCardDragging] = useState(false);

  return <DraggingContext.Provider value={{ isCardDragging, setIsCardDragging }}>{children}</DraggingContext.Provider>;
};
