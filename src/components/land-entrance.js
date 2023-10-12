"use client";
import React, { useRef, memo } from "react";
import Moveable from "react-moveable";
import LandChatHeader from "@/components/parts/land-chat-header";

const LandEntrance = (props) => {
  const target = useRef(null);
  const dragTarget = useRef(null);
  const style = {
    zIndex: props.landInfo.landId === props.activeLandIndex ? 2 : 1, // activeLandIndexと現在のLandのindexが一致すればz-indexを2に、そうでなければ1に設定
    ...props.style, // 他のスタイルもここに追加
  };
  const handleMouseDownOrTouchStart = () => {
    props.setActiveLandIndex(props.landInfo.landId);
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
      <div className={`board pixel-shadow absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 land${props.landInfo.landId}`} style={style} ref={target} onMouseDown={handleMouseDownOrTouchStart}>
        <div className="board-header pixel-shadow" ref={dragTarget}>
          <LandChatHeader name={props.landInfo.name} />
        </div>
        <div className="board-description">
          <div className="desc-jp-en">
            <p className="jp-desc">{props.landInfo.description}</p>
          </div>
          <button
            id="board-description-button"
            className="pixel-shadow"
            onClick={() => {
              props.setOpenLandId(props.landInfo.landId); // ここでlandIdを設定
            }}>
            さんかする
          </button>
        </div>
      </div>
    </>
  );
};
export default memo(LandEntrance);
