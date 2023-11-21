"use client";
import EmojiChat from "@/components/space-type/emoji-chat";
import React from "react";

const SpaceTypeSelector = (props) => {
  const { spaceInfo, zoom, setZoom, targetRef, message, setMessage } = props;
  const { spaceType } = spaceInfo;
  let Component;

  switch (spaceType) {
    case "infinitychat":
      Component = EmojiChat;
      break;
    // 他の場合分けを追加する場合はここにcaseを追加してください。
    default:
      Component = EmojiChat;
  }

  return <Component zoom={zoom} setZoom={setZoom} targetRef={targetRef} message={message} setMessage={setMessage} spaceInfo={spaceInfo} />;
};

export default SpaceTypeSelector;
