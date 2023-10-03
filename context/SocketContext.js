"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { io as ClientIO } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socketInstances, setSocketInstances] = useState({});

  const createSocketInstance = (instanceName) => {
    const newSocket = new ClientIO({
      path: "/api/socket/io",
      addTrailingSlash: false,
    });

    newSocket.on("connect", () => {
      console.log(`SOCKET CONNECTED! [${instanceName}]`, newSocket.id);
    });

    return newSocket;
  };

  const getSocketInstance = (instanceName) => {
    if (socketInstances[instanceName]) {
      return socketInstances[instanceName];
    }
    const newSocket = createSocketInstance(instanceName);
    setSocketInstances((prev) => ({ ...prev, [instanceName]: newSocket }));
    return newSocket;
  };

  return <SocketContext.Provider value={{ getSocketInstance }}>{children}</SocketContext.Provider>;
};

export const useSocket = (instanceName) => {
  const { getSocketInstance } = useContext(SocketContext);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const instance = getSocketInstance(instanceName);
    setSocket(instance);
    return () => {
      instance.disconnect();
    };
  }, [instanceName]);

  return socket;
};
