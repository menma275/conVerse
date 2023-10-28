"use client";
import EmojiChat from "@/components/space-type/emoji-chat";
import React from "react";
const SpaceTypeSelector = (props) => {
  return (
    <>
      {props.spaceInfo.spaceType == 2 ? (
        <EmojiChat zoom={props.zoom} setZoom={props.setZoom} targetRef={props.targetRef} message={props.message} setMessage={props.setMessage} spaceId={props.spaceInfo.spaceId} sounds={props.spaceInfo.sounds} messageDesign={props.spaceInfo.messageDesign} resizable={props.spaceInfo.resizable} />
      ) : (
        <EmojiChat zoom={props.zoom} setZoom={props.setZoom} targetRef={props.targetRef} message={props.message} setMessage={props.setMessage} spaceId={props.spaceInfo.spaceId} sounds={props.spaceInfo.sounds} messageDesign={props.spaceInfo.messageDesign} resizable={props.spaceInfo.resizable} />
      )}
    </>
  );
};
export default SpaceTypeSelector;
