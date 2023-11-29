"use client";
import React, { useState, useEffect, useRef } from "react";
import Moveable from "react-moveable";
import { useAnimationControls, motion } from "framer-motion";
import { useActiveSpaceIndex } from "@/context/active-space-index-context";
import { useMediaQuery } from "react-responsive";
import ClockDisplay from "@/components/space-type/clock-display";
import useTypewriter from "@/components/hooks/use-typewriter";
const ASCIIArtClock = () => {
  const { activeSpaceIndex, setActiveSpaceIndex } = useActiveSpaceIndex();
  const resizeTarget = useRef(null);
  const moveableRef = useRef(null);
  const dragTarget = useRef(null);
  const [resizable, setResizable] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 720px)" });
  const size = isMobile ? 15 : 19;
  const style = {
    zIndex: "ascii-art-clock" === activeSpaceIndex ? 3 : 1,
  };
  const handleMouseDownOrTouchStart = () => {
    setActiveSpaceIndex("ascii-art-clock");
  };
  //ボードサイズが変更されたときにコントロールもリサイズ
  const controls = useAnimationControls();
  const boardContentControls = useAnimationControls();

  useEffect(() => {
    controls.start({
      width: isMobile ? "160px" : "220px",
      height: isMobile ? "230px" : "270px",
      opacity: 1,
      bottom: "80px",
      left: "1rem",
      transition: { duration: 0.2, type: "spring" },
    });

    boardContentControls.set({ opacity: 0 });

    // フェードインアニメーションを開始（透明度を1に）
    boardContentControls.start({
      opacity: 1,
      transition: { duration: 0.5 }, // 遷移時間を設定
    });
  }, [controls, boardContentControls]);

  //アニメーション後にコントロールボックスをリサイズ
  const updateRect = () => {
    moveableRef.current.updateRect();
    setResizable(true);
  };

  const asciiArtStyle = {
    textAlign: "center", // テキストを中央揃えにする
    whiteSpace: "pre-wrap", // 長い行を適切に折り返す
    fontFamily: "monospace", // 等幅フォントを使用
    display: "flex", // Flexboxを使用して中央揃えを行う
    justifyContent: "center", // Flexboxの中央揃え
  };

  const description = useTypewriter("ASCII Clock", 100, 1000);

  return (
    <>
      <Moveable
        target={resizeTarget}
        resizable={resizable}
        keepRatio={false}
        ref={moveableRef}
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={controls}
        className={`board chat absolute pixel-shadow mt-[-40px] sm:mt-0 space-normal`}
        style={style}
        onAnimationComplete={() => updateRect()}
        ref={resizeTarget}
        onMouseDown={handleMouseDownOrTouchStart}
        onTouchStart={handleMouseDownOrTouchStart}
      >
        <div className="board-header pixel-shadow" ref={dragTarget}>
          {description}
        </div>
        <motion.div className="board-content" animate={boardContentControls}>
          <div id="container__wrapper">
            <div id="window-container" style={asciiArtStyle}>
              <ClockDisplay size={size} /> {/* 時計の表示 */}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default ASCIIArtClock;
