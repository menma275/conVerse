"use client";
import React, { useRef } from "react";
import Moveable from "react-moveable";
import SpaceChatHeader from "@/components/parts/space-chat-header";

const SpaceEntrance = (props) => {
  const target = useRef(null);
  const dragTarget = useRef(null);
  const style = {
    zIndex: props.spaceInfo.spaceId === props.activeSpaceIndex ? 2 : 1, // activeSpaceIndexと現在のSpaceのindexが一致すればz-indexを2に、そうでなければ1に設定
    ...props.style, // 他のスタイルもここに追加
  };
  const handleMouseDownOrTouchStart = () => {
    props.setActiveSpaceIndex(props.spaceInfo.spaceId);
  };
  return (
    <>
      <Moveable
        target={target}
        draggable={true}
        dragTarget={dragTarget}
        onDrag={(e) => {
          e.target.style.transform = e.transform;
        }}
      />
      <div className={`board pixel-shadow absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 space${props.spaceInfo.spaceId}`} style={style} ref={target} onMouseDown={handleMouseDownOrTouchStart}>
        <div className="board-header pixel-shadow" ref={dragTarget}>
          <SpaceChatHeader name={props.spaceInfo.name} />
        </div>
        <div className="board-description">
          <div className="desc-jp-en">
            <p className="jp-desc">{props.spaceInfo.description}</p>
          </div>
          <button
            id="board-description-button"
            className="pixel-shadow"
            onClick={() => {
              console.log(props.spaceInfo.spaceId);
              props.setOpenSpaceId(props.spaceInfo.spaceId); // ここでspaceIdを設定
            }}>
            {"さんかする"}
          </button>
        </div>
      </div>
    </>
  );
};
export default SpaceEntrance;
