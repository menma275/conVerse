"use client";
import React, { useRef, useEffect } from "react";
import Moveable from "react-moveable";
import SpaceChatHeader from "@/components/parts/space-chat-header";
import useSpaceTime from "@/components/hooks/use-space-time";
import useTypewriter from "@/components/hooks/use-typewriter";

const SpaceEntrance = (props) => {
  const dragTarget = useRef(null);
  const draggableRef = useRef(null);
  const moveableRef = useRef(null);
  const { isParticipationTime, countdown } = useSpaceTime(props.spaceInfo.startTime, props.spaceInfo.duration);

  const style = {
    zIndex: props.spaceInfo.spaceId === props.activeSpaceIndex ? 3 : 1, // activeSpaceIndexと現在のSpaceのindexが一致すればz-indexを2に、そうでなければ1に設定
    ...props.style, // 他のスタイルもここに追加
  };
  const handleMouseDownOrTouchStart = () => {
    props.setActiveSpaceIndex(props.spaceInfo.spaceId);
  };

  const handleDragEnd = () => {
    // ドラッグ終了時の位置を取得してローカルストレージに保存
    console.log(props.spaceInfo.spaceId);
    const { left, top } = draggableRef.current.getBoundingClientRect();
    localStorage.setItem(`spacePosition-${props.spaceInfo.spaceId}`, JSON.stringify({ left, top }));
  };

  //Close機能でMoveableがアンマウントされる問題を解決するために、z-index値を変更してすぐ戻すことで強制的に再描画。問題が解決したら削除したい
  useEffect(() => {
    // activeSpaceIndexが変更されたときに実行
    if (props.spaceInfo.spaceId === props.activeSpaceIndex) {
      // 一時的にactiveSpaceIndexをnullに設定
      props.setActiveSpaceIndex(null);

      // 次のレンダリングサイクルでactiveSpaceIndexを元の値に戻す
      setTimeout(() => {
        props.setActiveSpaceIndex(props.spaceInfo.spaceId);
      }, 10);
    }
  }, []);

  const description = useTypewriter(props.spaceInfo.description, 100, 1000);

  return (
    <>
      <Moveable
        target={draggableRef}
        ref={moveableRef}
        draggable={true}
        dragTarget={dragTarget}
        onDrag={(e) => {
          draggableRef.current.style.transform = e.transform;
        }}
        onDragEnd={handleDragEnd}
      />
      <div ref={draggableRef} onMouseDown={handleMouseDownOrTouchStart} className="board entrance pixel-shadow absolute" style={style}>
        <div className="board-header pixel-shadow" ref={dragTarget}>
          <SpaceChatHeader name={props.spaceInfo.name} />
        </div>
        <div className="board-description">
          <div className="desc-jp-en">
            <p className="jp-desc">{description}</p>
          </div>
          {isParticipationTime ? (
            <button
              id="board-description-button"
              className="pixel-shadow"
              onClick={() => {
                props.setOpenSpaceId(props.spaceInfo.spaceId);
              }}>
              Join
            </button>
          ) : (
            <div className="board-countdown absolute bottom-4 left-4">{`Starts in：${countdown}`}</div>
          )}
        </div>
      </div>
    </>
  );
};
export default SpaceEntrance;
