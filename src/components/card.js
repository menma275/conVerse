"use client";
import React, { useState, useContext, useEffect, useRef } from "react";
import { playSoundForEmojiCategory } from "@/components/parts/mute-button";
import { UserIdContext } from "@/context/userid-context";
import { sendApiPusherChat } from "@/components/utils/send-api-pusher-chat";
import { updateCardDb } from "@/components/utils/update-card-db";
import { useCardContext } from "@/context/card-context";
import { motion } from "framer-motion";

const Card = (props) => {
  console.log("props", props);
  // ステートの定義
  const [startMousePosition, setStartMousePosition] = useState({ x: 0, y: 0 });
  const [startCardPosition, setStartCardPosition] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isBouncing, setIsBouncing] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [isCardDragging, setIsCardDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { postId, setPostId } = useCardContext();

  // カードの現在の位置を保存するためのref
  const positionRef = useRef({ x: props?.data?.pos?.x || 0, y: props?.data?.pos?.y || 0 });

  // ユーザーIDをコンテキストから取得
  const { userId } = useContext(UserIdContext);
  const isDraggable = props.data.userId === userId;

  // マウス移動時のハンドラ
  const handleMouseMove = (e) => {
    if (isCardDragging) {
      const dx = e.clientX - startMousePosition.x;
      const dy = e.clientY - startMousePosition.y;
      const newPosition = {
        x: startCardPosition.x + dx,
        y: startCardPosition.y + dy,
      };

      positionRef.current = newPosition;
      setPosition(newPosition);
    }
  };

  // マウスアップ時のハンドラ
  const handleMouseUp = async () => {
    setIsCardDragging(false);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);

    const cardData = {
      ...props.data,
      pos: {
        x: positionRef.current.x,
        y: positionRef.current.y,
      },
    };
    await sendApiPusherChat(cardData, props?.data?.spaceId);
    await updateCardDb(cardData, props?.data?.spaceId);
  };

  // マウスダウン時のハンドラ
  const handleMouseDown = (e) => {
    if (!isDraggable) return;
    setIsCardDragging(true);
    setStartMousePosition({ x: e.clientX, y: e.clientY });
    setStartCardPosition({ x: positionRef.current.x, y: positionRef.current.y });
  };

  //SPのタッチ対応
  const handleTouchStart = (e) => {
    if (!isDraggable) return;
    if (e.touches.length === 1) {
      setIsCardDragging(true);
      setStartMousePosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      setStartCardPosition({ x: positionRef.current.x, y: positionRef.current.y });
    }
  };

  const handleTouchMove = (e) => {
    if (isCardDragging && e.touches.length === 1) {
      // タッチポイントが1つの場合のみ処理を実行
      const dx = e.touches[0].clientX - startMousePosition.x;
      const dy = e.touches[0].clientY - startMousePosition.y;
      const newPosition = {
        x: startCardPosition.x + dx,
        y: startCardPosition.y + dy,
      };
      positionRef.current = newPosition;
      setPosition(newPosition);
    }
  };

  const handleTouchEnd = async (e) => {
    if (e.touches.length === 0 && isCardDragging) {
      setIsCardDragging(false);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);

      const cardData = {
        ...props.data,
        pos: {
          x: positionRef.current.x,
          y: positionRef.current.y,
        },
      };
      await sendApiPusherChat(cardData, props?.data?.spaceId);
      await updateCardDb(cardData, props?.data?.spaceId);
    }
  };

  // propsからの位置変更を監視して、positionRefとstateを更新する
  useEffect(() => {
    positionRef.current = {
      x: props.data.pos.x,
      y: props.data.pos.y,
    };
    setPosition({
      x: props.data.pos.x,
      y: props.data.pos.y,
    });
  }, [props.data.pos.x, props.data.pos.y]);

  // isDraggingの変化を監視して、適切なイベントリスナーを登録/解除する
  useEffect(() => {
    if (isCardDragging) {
      console.log("Adding event listeners for dragging");
      window.addEventListener("mousemove", handleMouseMove, { passive: false });
      window.addEventListener("mouseup", handleMouseUp, { passive: false });
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd, { passive: false });
    }
    return () => {
      console.log("Removing event listeners for dragging");
      window.removeEventListener("mousemove", handleMouseMove, { passive: false });
      window.removeEventListener("mouseup", handleMouseUp, { passive: false });
      window.removeEventListener("touchmove", handleTouchMove, { passive: false });
      window.removeEventListener("touchend", handleTouchEnd, { passive: false });
    };
  }, [isCardDragging, startMousePosition]);

  // カードクリック時のサウンド再生ハンドラ
  const handleCardClick = () => {
    if (props?.data?.text) {
      setIsBouncing(true);
      playSoundForEmojiCategory(props.data.text, props.data.note);
      console.log("props.data", props.data);
      // カードクリックの情報をPusherを使って他のユーザーに送信
      sendApiPusherChat(props.data, props?.data?.spaceId, "card-clicked");
    }
  };

  useEffect(() => {
    console.log("postId", postId);
    console.log("props.data.id", props.data.postId);
    // カードがクリックされたかどうかを判定
    if (isBouncing || postId == props.data.postId) {
      setIsBouncing(true);
    }
  }, [postId]);

  useEffect(() => {
    if (isBouncing) {
      const timer = setTimeout(() => {
        setIsBouncing(false);
        setPostId(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isBouncing]);

  useEffect(() => {
    // コンポーネントがマウントされた後、次のフレームで初回レンダリングではないとマークする。
    const timer = setTimeout(() => {
      setIsInitialRender(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // カードのスタイル定義
  const cardWrapperCardStyle = {
    transform: `translate(${position.x}px, ${position.y}px)`,
    touchAction: "none",
  };

  const cardStyle = {
    boxShadow: isCardDragging ? `0 0 var(--hover-shadow-distance, 1rem) 0.1rem ${props?.data?.color}` : isHovered ? `0 0 3rem 0.1rem ${props?.data?.color}` : `0 0 var(--default-shadow-distance, 0.5rem) 0.05rem ${props?.data?.color}`,
    animationDelay: `${props.animationDelay}s`,
  };
  // カードのクラス名定義
  const cardWrapperClassName = `card-wrapper ${isInitialRender ? "transition" : ""}`;
  const cardClassName = `card popIn ${isDraggable ? "draggable-card" : ""} ${isBouncing ? "jello-animation" : ""}`;

  const delayDuration = 0.1; // Adjust this value as you see fit

  const popInWithBounce = {
    initial: { opacity: 0, scale: 0.8, y: 0 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: props.custom * delayDuration,
        type: "spring",
        stiffness: 500,
        damping: 30,
      },
    },
  };

  return (
    <div className={cardWrapperClassName} style={cardWrapperCardStyle} onClick={handleCardClick} onMouseDown={handleMouseDown} onTouchMove={handleTouchMove} onTouchStart={handleTouchStart}>
      <motion.div variants={popInWithBounce}>
        <div style={cardStyle} className={cardClassName} onMouseEnter={() => isDraggable && setIsHovered(true)} onMouseLeave={() => isDraggable && setIsHovered(false)}>
          {props?.data?.text}
        </div>
      </motion.div>
    </div>
  );
};

export default Card;
