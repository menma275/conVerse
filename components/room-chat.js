import { RxDragHandleHorizontal } from "react-icons/rx";
import React, { useMemo, useState, useEffect, useRef } from "react";
import Moveable from "react-moveable";
import { useAnimationControls, motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import Zoom from "@/components/zoom";
import GenerativeArt from "@/components/genarativeart";
import InputMessage from "@/components/input-message";
import Container from "@/components/container";

const RoomChat = () => {
  const [resizable, setResizable] = useState(false);
  const resizeTarget = useRef(null);
  const dragTarget = useRef(null);
  const moveableRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [message, setMessage] = useState("");
  const isMobile = useMediaQuery({ query: "(max-width: 720px)" });
  const [initial, setInitial] = useState(true);

  const toggleModal = () => {
    setIsOpen(!isOpen);
    console.log(isOpen);
  };

  //スクロール位置をセンターに
  const targetRef = useRef();

  const handleResize = () => {
    // const clientRect = targetRef.current.getBoundingClientRect();
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
    localStorage.removeItem("dataList");
  };

  //アニメーション後にコントロールボックスをリサイズ
  const updateRect = () => {
    moveableRef.current.updateRect();
    setResizable(true);
    console.log("updateRect");
    //resize
    handleResize();
  };

  const controls = useAnimationControls();
  const [boardSize, setBoardSize] = useState({ width: isMobile ? "90%" : "500px", height: "500px" });

  useEffect(() => {
    controls.start({
      width: boardSize.width,
      height: boardSize.height,
      transition: { duration: 0.2, type: "spring" },
    });
  }, [boardSize]);

  useEffect(() => {
    isMobile
      ? controls.start({
          width: "90%",
          height: "500px",
          transition: { duration: 0.2, type: "spring" },
        })
      : controls.start({
          width: "500px",
          height: "500px",
          transition: { duration: 0.2, type: "spring" },
        });
  }, []);

  return (
    <>
      <Moveable
        target={resizeTarget}
        resizable={resizable}
        keepRatio={false}
        onResize={(e) => {
          const newWidth = `${e.width}px`;
          const newHeight = `${e.height}px`;
          e.target.style.width = newWidth;
          e.target.style.height = newHeight;
          e.target.style.transform = e.drag.transform;
          setBoardSize({ width: newWidth, height: newHeight });
          console.log("onResize");
        }}
        draggable={true}
        dragTarget={dragTarget}
        onDrag={(e) => {
          e.target.style.transform = e.transform;
        }}
        ref={moveableRef}
      />
      <motion.div animate={controls} className="board pixel-shadow" id="board_01" onAnimationComplete={() => updateRect()} ref={resizeTarget}>
        <div className="board-header pixel-shadow" ref={dragTarget}>
          <div className="board-header-set">
            <h1>emoji Land</h1>
            <button onClick={setIsOpen}>
              <p>Generate</p>
            </button>
          </div>
          <RxDragHandleHorizontal className="handle text-2xl m-0 p-0" />
        </div>
        <InputMessage message={message} setMessage={setMessage} />
        <GenerativeArt isOpen={isOpen} toggleModal={toggleModal} />
        <div id="tap-anywhere" style={{ display: message ? "" : "none" }}>
          <p>👇 Tap anywhere to post.</p>
        </div>
        <div id="container__wrapper" ref={targetRef}>
          <Container zoom={zoom} message={message} setMessage={setMessage} />
        </div>
        <Zoom setZoom={setZoom} zoom={zoom} />
      </motion.div>
    </>
  );
};
export default RoomChat;
