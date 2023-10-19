"use client";
import React, { useState, useContext, useEffect, useRef } from "react";
import { playSoundForEmojiCategory } from "@/components/parts/mute-button";
import { UserIdContext } from "@/context/userid-context";
import { sendApiPusherChat } from "@/components/utils/send-api-pusher-chat";
import { updateCardDb } from "@/components/utils/update-card-db";
import { useCardContext } from "@/context/card-context";

const Card = (props) => {
  // ステートの定義
  const [startMousePosition, setStartMousePosition] = useState({ x: 0, y: 0 });
  const [startCardPosition, setStartCardPosition] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isBouncing, setIsBouncing] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(false);
  const [isOpacity, setIsOpacity] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
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
    try {
      await sendApiPusherChat(userId, cardData, props?.data?.spaceId);
      await updateCardDb(cardData, props?.data?.spaceId);
    } catch (error) {
      console.error("Error updating card data:", error);
      // Here you can also set some state to show an error message to the user
    }
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
      await sendApiPusherChat(userId, cardData, props?.data?.spaceId);
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
    setIsClicked(!isClicked); // クリックする度に状態をトグル

    console.log("card clicked", props.data.postId);
    if (props?.data?.text) {
      setIsBouncing(true);
      console.log("props.data.text", props.data.text);
      playSoundForEmojiCategory(props.data.text, props.data.note);
      // カードクリックの情報をPusherを使って他のユーザーに送信
      sendApiPusherChat(userId, props.data, props?.data?.spaceId, "card-clicked");
    }
  };

  useEffect(() => {
    // カードがクリックされたかどうかを判定
    if (postId == props.data.postId) {
      setIsBouncing(true);
      setPostId(false);
    }
  }, [postId]);

  useEffect(() => {
    if (isBouncing) {
      setIsInitialRender(true);
      const timer = setTimeout(() => {
        setIsBouncing(false);
        setIsInitialRender(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isBouncing]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialRender(true);
      setIsOpacity(false);
    }, 500 + 100 * props.index);
    return () => clearTimeout(timer);
  }, []);

  // カードのスタイル定義
  const cardWrapperCardStyle = {
    transform: `translate(${position.x}px, ${position.y}px)`,
    touchAction: "none",
  };

  const cardStyle = {
    boxShadow: isCardDragging ? `0 0 var(--hover-shadow-distance, 1rem) 0.1rem ${props?.data?.color}` : isHovered ? `0 0 2rem 0.1rem ${props?.data?.color}` : `0 0 var(--default-shadow-distance, 0.5rem) 0.05rem ${props?.data?.color}`,
    animationDelay: `${props.animationDelay}s`,
  };
  // カードのクラス名定義
  const cardClassName = ["card", isOpacity ? "opacity-0" : "opacity-100", isInitialRender ? "popIn" : "", isDraggable ? "draggable-card" : "", isBouncing ? "jello-animation" : "", isClicked ? "jello-animation" : ""].join(" ");

  return (
    <div className="`card-wrapper" style={cardWrapperCardStyle} onClick={handleCardClick} onMouseDown={handleMouseDown} onTouchMove={handleTouchMove} onTouchStart={handleTouchStart}>
      {props?.data && (
        <div style={cardStyle} className={cardClassName} onMouseEnter={() => isDraggable && setIsHovered(true)} onMouseLeave={() => isDraggable && setIsHovered(false)}>
          {props?.data?.text}
        </div>
      )}
    </div>
  );
};

export default Card;
