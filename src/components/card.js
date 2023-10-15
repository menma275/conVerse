"use client";
import React, { useState, useContext, useEffect, useRef } from "react";
import { playSoundForEmojiCategory } from "@/components/parts/mute-button";
import { UserIdContext } from "@/context/userid-context";
import { sendApiPusherChat } from "@/components/utils/send-api-pusher-chat";
import { updateCardDb } from "@/components/utils/update-card-db";

const Card = (props) => {
  // ステートの定義
  const [isDragging, setIsDragging] = useState(false);
  const [startMousePosition, setStartMousePosition] = useState({ x: 0, y: 0 });
  const [startCardPosition, setStartCardPosition] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // カードの現在の位置を保存するためのref
  const positionRef = useRef({ x: props?.data?.pos?.x || 0, y: props?.data?.pos?.y || 0 });

  // ユーザーIDをコンテキストから取得
  const { userId } = useContext(UserIdContext);
  const isDraggable = props.data.userId === userId;

  // マウス移動時のハンドラ
  const handleMouseMove = (e) => {
    if (isDragging) {
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
    setIsDragging(false);
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
    setIsDragging(true);
    setStartMousePosition({ x: e.clientX, y: e.clientY });
    setStartCardPosition({ x: positionRef.current.x, y: positionRef.current.y });
  };

  // カードのスタイル定義
  const cardStyle = {
    transform: `translate(${position.x}px, ${position.y}px)`,
    boxShadow: isDragging ? `0 0 var(--hover-shadow-distance, 1rem) 0.1rem ${props?.data?.color}` : `0 0 var(--default-shadow-distance, 0.5rem) 0.05rem ${props?.data?.color}`,
  };

  // カードのクラス名定義
  const cardClassName = isDraggable ? "card draggable-card" : "card";

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
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, startMousePosition]);

  // カードクリック時のサウンド再生ハンドラ
  const handleCardClick = () => {
    if (props?.data?.text) {
      playSoundForEmojiCategory(props.data.text, props.data.note);
    }
  };

  return (
    <div
      className={cardClassName}
      style={cardStyle}
      onMouseEnter={(e) => {
        if (isDraggable) {
          e.currentTarget.style.setProperty("--hover-shadow-distance", "3rem");
        }
      }}
      onMouseLeave={(e) => {
        if (isDraggable) {
          e.currentTarget.style.removeProperty("--hover-shadow-distance");
        }
      }}
      onClick={handleCardClick}
      onMouseDown={handleMouseDown}>
      {props?.data?.text}
    </div>
  );
};

export default Card;
