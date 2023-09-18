import { RxDragHandleHorizontal } from "react-icons/rx";
import React, { useRef } from "react";
const RoomDefault = (Props) => {
  return (
    <>
      <div className="board-header pixel-shadow" /*ref={Props.dragTarget}*/>
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
    </>
  );
};
export default RoomDefault;
