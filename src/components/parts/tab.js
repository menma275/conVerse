"use client";

import React from "react";
import SpaceChat from "@/components/space-chat";
import SpaceEntrance from "@/components/space-entrance";
import { useActiveSpaceIndex } from "@/context/active-space-index-context";
import { useOpenSpaceId } from "@/context/open-space-id-context";

const Tab = ({ list }) => {
  const { openSpaceId, setOpenSpaceId } = useOpenSpaceId();
  const { activeSpaceIndex, setActiveSpaceIndex } = useActiveSpaceIndex();

  const closeSpace = () => {
    setOpenSpaceId(null);
  };

  const openSpace = (spaceId) => {
    setOpenSpaceId(spaceId);
  };

  return (
    <>
      {openSpaceId !== list.spaceId ? (
        <button className="w-fit bg-[var(--accent)] pixel-shadow text-xs text-[var(--cream)] h-full px-3">
          <p className="opacity-50 truncate">{list.name}</p>
        </button>
      ) : (
        // <SpaceEntrance
        //   activeSpaceIndex={activeSpaceIndex}
        //   onPositionChange={props.onPositionChange}
        //   delay={props.delay}
        //   setActiveSpaceIndex={setActiveSpaceIndex}
        //   spaceInfo={props.spaceInfo}
        //   style={props.style}
        //   setOpenSpaceId={setOpenSpaceId}
        //   openSpaceId={openSpaceId}
        // />
        <button
          className="w-fit bg-[var(--accent)] pixel-shadow text-xs text-[var(--cream)] h-full px-3"
          onClick={closeSpace}
        >
          <p className="opacity-100">{list.name}</p>
        </button>
        // <SpaceChat
        //   setSpacePositions={props.setSpacePositions}
        //   activeSpaceIndex={activeSpaceIndex}
        //   setActiveSpaceIndex={setActiveSpaceIndex}
        //   spaceInfo={props.spaceInfo}
        // />
      )}
    </>
  );
};

export default Tab;
