"use client";
import React, { useState, useEffect, useRef } from "react";
import Moveable from "react-moveable";
import { useOpenSpaceId } from "@/context/open-space-id-context";
import { useAnimationControls, motion } from "framer-motion";
import { useActiveSpaceIndex } from "@/context/active-space-index-context";
import { useMediaQuery } from "react-responsive";
import ClockDisplay from "@/components/space-type/clock-display";
import useTypewriter from "@/components/hooks/use-typewriter";
const Start = () => {
  const { activeSpaceIndex, setActiveSpaceIndex } = useActiveSpaceIndex();
  const [isShowDesc, setIsShowDesc] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);

  const resizeTarget = useRef(null);
  const moveableRef = useRef(null);
  const dragTarget = useRef(null);
  const [resizable, setResizable] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 720px)" });
  const size = isMobile ? 15 : 19;
  const style = {
    zIndex: "start-page" === activeSpaceIndex ? 3 : 1,
  };
  const handleMouseDownOrTouchStart = () => {
    setActiveSpaceIndex("start-page");
  };
  //ボードサイズが変更されたときにコントロールもリサイズ
  const controls = useAnimationControls();
  const boardContentControls = useAnimationControls();

  useEffect(() => {
    controls.start({
      width: isMobile ? "100%" : "90%",
      height: isMobile ? "calc(100dvh - 32px)" : "90%",
      opacity: 1,
      bottom: "32px",
      left: "calc(50%)",
      transform: "translate(-50%, -0%)",
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

  const description = useTypewriter("Welcome to Gundi !", 100, 1000);

  const startStyle = {
    textAlign: "center", // テキストを中央揃えにする
    whiteSpace: "pre-wrap", // 長い行を適切に折り返す
    fontFamily: "monospace", // 等幅フォントを使用
    display: "flex", // Flexboxを使用して中央揃えを行う
    justifyContent: "center", // Flexboxの中央揃え
  };

  return (
    <>
      {isModalOpen && (
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
            <motion.div
              className="board-content"
              animate={boardContentControls}
            >
              <div
                id="container__wrapper"
                className="bg-[var(--accent)] p-6 flex text-[var(--cream)]"
              >
                <div
                  id="window-container"
                  className="flex flex-col items-center justify-center gap-6"
                >
                  {!isShowDesc ? (
                    <>
                      <p className="text-sans text-sm">
                        Decentralized Chat System
                      </p>
                      <div className="w-36 lg:w-72">
                        <img src="/gundi-logo.svg" />
                      </div>
                      <div className="flex justify-between gap-8">
                        <button
                          onClick={() => setIsShowDesc(true)}
                          className="rounded-full border-2 border-[var(--black)] text-xs pixel-shadow px-4 py-2"
                        >
                          使い方を見る
                        </button>
                        <button
                          onClick={() => setIsModalOpen(false)}
                          className="rounded-full border-2 border-[var(--black)] text-xs pixel-shadow px-4 py-2"
                        >
                          あそぶ
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col gap-6 w-full md:w-[500px]">
                      <div>
                        <h3 className="text-sm">Spaceの作成</h3>
                        <div className="font-sans">
                          <p>
                            画面右下の🚀をクリックして《Create New
                            Space》のウィンドウを開きます。
                            <br />
                            Spaceの名前と説明を記入し、各種設定を行なってください。
                          </p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm">Spaceの使い方</h3>
                        <div className="font-sans">
                          <p>
                            1. 《Input your
                            message》欄にメッセージを入力します。この際、欄内右端の絵文字アイコンをクリックすると、絵文字ピッカーの使用が可能になります。
                            <br />
                            2.フィールド内の任意の場所をクリックして、メッセージを配置します。
                            <br />
                            3.《Generate》ボタンを押すとジェネラティブアートが生成されます。《Back》ボタンを押すとフィールドに戻ります。
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="rounded-full border-2 border-[var(--black)] text-xs pixel-shadow px-4 py-2"
                      >
                        あそぶ
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </>
  );
};

export default Start;
