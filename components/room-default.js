import { RxDragHandleHorizontal } from "react-icons/rx";
import React, { useRef } from "react";
import Moveable from "react-moveable";
const RoomDefault = (Props) => {
  const resizeTarget = useRef(null);
  const dragTarget = useRef(null);
  return (
    <>
      <Moveable
        target={resizeTarget}
        draggable={true}
        dragTarget={dragTarget}
        onDrag={(e) => {
          e.target.style.transform = e.transform;
        }}
      />
      <div className="board pixel-shadow" id="board_01" ref={resizeTarget}>
        <div className="board-header pixel-shadow" ref={dragTarget}>
          <div className="board-header-set">
            <h1>emoji Room</h1>
          </div>
          <RxDragHandleHorizontal className="handle text-2xl m-0 p-0" />
        </div>
        <div className="board-description" id="board-description-01">
          <div className="desc-jp-en">
            <p className="jp-desc">えもじだけで話す部屋。</p>
            <p className="en-desc">room to chat only with emojis.</p>
          </div>
          <button id="board-description-button" className="pixel-shadow" onClick={Props.toggleRoom}>
            さんかする
          </button>
        </div>
      </div>
    </>
  );
};
export default RoomDefault;