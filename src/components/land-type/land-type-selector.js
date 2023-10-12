"use client";
import EmojiChat from "@/components/land-type/emoji-chat";
import EmojiSound from "@/components/land-type/emoji-sound";
import React from "react";
const LandTypeSelector = (props) => {
  return (
    <>
      {props.landInfo.landType == 2 ? (
        <EmojiSound zoom={props.zoom} setZoom={props.setZoom} targetRef={props.targetRef} message={props.message} setMessage={props.setMessage} landId={props.landInfo.landId} />
      ) : (
        <EmojiChat zoom={props.zoom} setZoom={props.setZoom} targetRef={props.targetRef} message={props.message} setMessage={props.setMessage} landId={props.landInfo.landId} sounds={props.landInfo.sounds} />
      )}
    </>
  );
};
export default LandTypeSelector;
