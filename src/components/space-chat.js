"use client";
import React, { useState, useEffect, useRef, memo } from "react";
import Moveable from "react-moveable";
import { useAnimationControls, motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import GenerativeArt from "@/components/parts/genarativeart";
import SpaceTypeSelector from "@/components/space-type/space-type-selector";
import SpaceChatHeader from "@/components/parts/space-chat-header";
import { useOpenSpaceId } from "@/context/open-space-id-context";

const SpaceChat = (props) => {
  const [resizable, setResizable] = useState(false);
  const resizeTarget = useRef(null);
  const dragTarget = useRef(null);
  const moveableRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const isMobile = useMediaQuery({ query: "(max-width: 720px)" });
  const [boardSize, setBoardSize] = useState({ width: isMobile ? "90%" : "500px", height: "500px" });
  const { setOpenSpaceId } = useOpenSpaceId();

  const style = {
    zIndex: props.spaceInfo.spaceId === props.activeSpaceIndex ? 3 : 1, // activeSpaceIndexと現在のSpaceのindexが一致すればz-indexを2に、そうでなければ1に設定
    ...props.style, // 他のスタイルもここに追加
  };
  const handleMouseDownOrTouchStart = () => {
    props.setActiveSpaceIndex(props.spaceInfo.spaceId);
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  const boardContentControls = useAnimationControls();
  const closeModal = () => {
    // アニメーションを定義して実行
    boardContentControls.start({ opacity: 0 }).then(() => {
      controls
        .start({
          // 元のサイズに戻るアニメーション
          width: isMobile ? "90%" : "300px",
          height: "300px",
          transition: { duration: 0.2, type: "spring" },
        })
        .then(() => {
          // アニメーション完了後に実行
          setOpenSpaceId(null);
          // SpaceEntrance の位置を中央に設定
          const windowWidth = window.innerWidth;
          const windowHeight = window.innerHeight;
          props.setSpacePositions((prev) => ({
            ...prev,
            [props.spaceInfo.spaceId]: {
              left: `${windowWidth / 2 - 150}px`,
              top: `${windowHeight / 2 - 150}px`,
            },
          }));
        });
    });
  };
  //スクロール位置をセンターに
  const targetRef = useRef();

  const handleResize = () => {
    const rx = 2500 - targetRef.current.clientWidth / 2;
    const ry = 2500 - targetRef.current.clientHeight / 2;
    targetRef.current.scrollLeft = rx;
    targetRef.current.scrollTop = ry;
    let boardSize = {
      width: targetRef.current.clientWidth,
      height: targetRef.current.clientHeight,
    };
    boardSize = JSON.stringify(boardSize);
    localStorage.setItem("boardSize", boardSize);
  };

  //アニメーション後にコントロールボックスをリサイズ
  const updateRect = () => {
    moveableRef.current.updateRect();
    setResizable(true);
    //resize
    handleResize();
  };

  //ボードサイズが変更されたときにコントロールもリサイズ
  const controls = useAnimationControls();

  useEffect(() => {
    controls.start({
      width: boardSize.width,
      height: boardSize.height,
      transition: { duration: 0.2, type: "spring" },
    });
  }, [boardSize]);

  //モバイルとデスクトップで異なるアニメーション・サイズで展開
  useEffect(() => {
    isMobile
      ? controls.start({
          width: "90%",
          height: "500px",
          transition: { duration: 0.2, type: "spring" },
        })
      : controls.start({
          width: "80%",
          height: "80%",
          transition: { duration: 0.2, type: "spring" },
        });
  }, [isMobile, controls]);

  return (
    <>
      <Moveable
        target={resizeTarget}
        ref={moveableRef}
        resizable={resizable}
        keepRatio={false}
        edge={false}
        onResize={(e) => {
          const newWidth = `${e.width}px`;
          const newHeight = `${e.height}px`;
          e.target.style.width = newWidth;
          e.target.style.height = newHeight;
          e.target.style.transform = e.drag.transform;
          setBoardSize({ width: newWidth, height: newHeight });
        }}
        draggable={true}
        dragTarget={dragTarget}
        onDrag={(e) => {
          e.target.style.transform = e.transform;
        }}
      />
      <motion.div animate={controls} className={`board chat absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pixel-shadow mt-[-40px] sm:mt-0 space${props.spaceInfo.spaceId}`} style={style} onAnimationComplete={() => updateRect()} ref={resizeTarget} onMouseDown={handleMouseDownOrTouchStart} onTouchStart={handleMouseDownOrTouchStart}>
        <div className="board-header pixel-shadow" ref={dragTarget}>
          <SpaceChatHeader name={props.spaceInfo.name} />
          <div>
            <button onMouseUp={toggleModal} onTouchEnd={toggleModal} className="mr-4">
              Generate
            </button>
            <button onMouseUp={closeModal} onTouchEnd={closeModal}>
              Close
            </button>
          </div>
        </div>
        <motion.div className="board-content" animate={boardContentControls}>
          <GenerativeArt isOpen={isOpen} toggleModal={toggleModal} />
          <div id="tap-anywhere" style={{ display: message ? "" : "none" }}>
            <p>👇 Tap anywhere to post.</p>
          </div>

          <SpaceTypeSelector zoom={zoom} setZoom={setZoom} message={message} targetRef={targetRef} setMessage={setMessage} spaceInfo={props.spaceInfo} />
        </motion.div>
      </motion.div>
    </>
  );
};
export default memo(SpaceChat);
