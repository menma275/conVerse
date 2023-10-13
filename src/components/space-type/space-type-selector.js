"use client";
import EmojiChat from "@/components/space-type/emoji-chat";
import EmojiSound from "@/components/space-type/emoji-sound";
import React from "react";
const SpaceTypeSelector = (props) => {
  return (
    <>
      {props.spaceInfo.spaceType == 2 ? (
        <EmojiSound zoom={props.zoom} setZoom={props.setZoom} targetRef={props.targetRef} message={props.message} setMessage={props.setMessage} spaceId={props.spaceInfo.spaceId} />
      ) : (
        <EmojiChat zoom={props.zoom} setZoom={props.setZoom} targetRef={props.targetRef} message={props.message} setMessage={props.setMessage} spaceId={props.spaceInfo.spaceId} sounds={props.spaceInfo.sounds} />
      )}
    </>
  );
};
export default SpaceTypeSelector;
