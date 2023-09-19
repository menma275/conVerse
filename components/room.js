"use client";
import React, { useEffect, useState } from "react";
import RoomDefault from "@/components/room-default";
import RoomChat from "@/components/room-chat";

const Room = () => {
  const [isRoomOpen, setIsRoomOpen] = useState(false);

  useEffect(() => {
    console.log(isRoomOpen);
  }, [isRoomOpen]);

  return <>{!isRoomOpen ? <RoomDefault setIsRoomOpen={setIsRoomOpen} /> : <RoomChat />}</>;
};
export default Room;
