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
    setActiveSpaceIndex(spaceId);
    // console.log(spaceId);
  };

  return (
    <>
      {openSpaceId !== list.spaceId ? (
        <button
          onClick={() => {
            openSpace(list.spaceId);
          }}
          className="w-fit bg-[var(--accent)] pixel-shadow text-xs text-[var(--cream)] h-full px-3 whitespace-nowrap overflow-hidden overflow-ellipsis"
        >
          <p className="opacity-50">{list.name}</p>
        </button>
      ) : (
        <button
          className="w-fit bg-[var(--accent)] pixel-shadow text-xs text-[var(--cream)] h-full px-3"
          onClick={closeSpace}
        >
          <p className="opacity-100">{list.name}</p>
        </button>
      )}
    </>
  );
};

export default Tab;
