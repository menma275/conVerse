"use client";
import React, { useState, useEffect, useRef, memo } from "react";
import Moveable from "react-moveable";
import { useAnimationControls, motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import NormalChat from "@/components/space-type/normal-chat";
import { useActiveSpaceIndex } from "@/context/active-space-index-context";
import useTypewriter from "@/components/hooks/use-typewriter";

const SpaceChatNormal = (props) => {
  const [resizable, setResizable] = useState(false);
  const resizeTarget = useRef(null);
  const dragTarget = useRef(null);
  const moveableRef = useRef(null);
  const isMobile = useMediaQuery({ query: "(max-width: 720px)" });
  const { activeSpaceIndex, setActiveSpaceIndex } = useActiveSpaceIndex();
  const style = {
    zIndex: "normal-chat" === activeSpaceIndex ? 3 : 1, // activeSpaceIndexと現在のSpaceのindexが一致すればz-indexを2に、そうでなければ1に設定
    ...props.style, // 他のスタイルもここに追加
  };
  const handleMouseDownOrTouchStart = () => {
    setActiveSpaceIndex("normal-chat");
  };

  const boardContentControls = useAnimationControls();

  //アニメーション後にコントロールボックスをリサイズ
  const updateRect = () => {
    moveableRef.current.updateRect();
    setResizable(true);
  };

  //ボードサイズが変更されたときにコントロールもリサイズ
  const controls = useAnimationControls();

  useEffect(() => {
    // アニメーションを開始
    controls.start({
      width: isMobile ? "240px" : "280px",
      height: isMobile ? "220px" : "340px",
      opacity: 1,
      transition: { duration: 0.2, type: "spring" },
    });
  }, [controls]);
  const description = useTypewriter("Chat", 100, 1000);

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
        }}
        draggable={true}
        dragTarget={dragTarget}
        onDrag={(e) => {
          e.target.style.transform = e.transform;
        }}
      />
      <motion.div initial={{ opacity: 0 }} animate={controls} className={`board chat absolute bottom-10 right-8 pixel-shadow mt-[-40px] sm:mt-0 space-normal`} style={style} onAnimationComplete={() => updateRect()} ref={resizeTarget} onMouseDown={handleMouseDownOrTouchStart} onTouchStart={handleMouseDownOrTouchStart}>
        <div className="board-header pixel-shadow" ref={dragTarget}>
          {description}
        </div>
        <motion.div className="board-content" animate={boardContentControls}>
          <NormalChat />
        </motion.div>
      </motion.div>
    </>
  );
};
export default memo(SpaceChatNormal);
