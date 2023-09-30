"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { io as ClientIO } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socketId, setSocketId] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = new ClientIO({
      path: "/api/socket/io",
      addTrailingSlash: false,
    });

    // log socket connection
    newSocket.on("connect", () => {
      console.log("SOCKET CONNECTED!", newSocket.id);
      setSocketId(newSocket.id);
    });

    setSocket(newSocket);

    // Clean up socket on unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  return <SocketContext.Provider value={{ socketId, socket }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  return useContext(SocketContext);
};
