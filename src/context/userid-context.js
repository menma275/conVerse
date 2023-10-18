"use client";
import React, { createContext, useState } from "react";

// Contextを作成
const UserIdContext = createContext();

// Contextプロバイダー
const UserIdProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  console.log("UserIdProvider", userId);
  return <UserIdContext.Provider value={{ userId, setUserId }}>{children}</UserIdContext.Provider>;
};

export { UserIdProvider, UserIdContext };
