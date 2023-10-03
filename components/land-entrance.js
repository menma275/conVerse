"use client";
import React, { useRef } from "react";
import Moveable from "react-moveable";
const LandEntrance = (props) => {
  const target = useRef(null);
  const dragTarget = useRef(null);
  const style = {
    zIndex: props.landInfo.landId === props.activeLandIndex ? 2 : 1, // activeLandIndexと現在のLandのindexが一致すればz-indexを2に、そうでなければ1に設定
    ...props.style, // 他のスタイルもここに追加
  };
  const handleMouseDownOrTouchStart = (e) => {
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
      <div className={`board pixel-shadow land${props.landInfo.landId}`} style={style} ref={target} onMouseDown={handleMouseDownOrTouchStart}>
        <div className="board-header pixel-shadow" ref={dragTarget}>
          <div className="board-header-set">
            <h1>{props.landInfo.name}</h1>
          </div>
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
export default LandEntrance;
