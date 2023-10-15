"use client";
import SpaceChat from "@/components/space-chat";
import SpaceEntrance from "@/components/space-entrance";
import { useActiveSpaceIndex } from "@/context/active-space-index-context";
import { useOpenSpaceId } from "@/context/open-space-id-context";
import React from "react";
const Space = (props) => {
  const { openSpaceId, setOpenSpaceId } = useOpenSpaceId();
  const { activeSpaceIndex, setActiveSpaceIndex } = useActiveSpaceIndex();
  console.log("openSpaceId:", openSpaceId);
  console.log("props.spaceId:", props.spaceId);
  return <>{openSpaceId !== props.spaceId ? <SpaceEntrance activeSpaceIndex={activeSpaceIndex} setActiveSpaceIndex={setActiveSpaceIndex} spaceInfo={props.spaceInfo} style={props.style} setOpenSpaceId={setOpenSpaceId} openSpaceId={openSpaceId} /> : <SpaceChat activeSpaceIndex={activeSpaceIndex} setActiveSpaceIndex={setActiveSpaceIndex} spaceInfo={props.spaceInfo} />}</>;
};
export default Space;
