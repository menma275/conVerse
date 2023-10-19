"use client";
import React, { createContext, useContext, useState } from "react";

const CardContext = createContext();

export const useCardContext = () => {
  return useContext(CardContext);
};

export const CardProvider = ({ children }) => {
  const [postId, setPostId] = useState(null);

  return <CardContext.Provider value={{ postId, setPostId }}>{children}</CardContext.Provider>;
};
