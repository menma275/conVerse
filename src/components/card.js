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
  const [isBouncing, setIsBouncing] = useState(false);

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
  };
  const cardStyle2 = {
    boxShadow: isDragging ? `0 0 var(--hover-shadow-distance, 1rem) 0.1rem ${props?.data?.color}` : `0 0 var(--default-shadow-distance, 0.5rem) 0.05rem ${props?.data?.color}`,
  };

  //SPのタッチ対応
  const handleTouchStart = (e) => {
    if (!isDraggable) return;
    if (e.touches.length === 1) {
      setIsDragging(true);
      setStartMousePosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      setStartCardPosition({ x: positionRef.current.x, y: positionRef.current.y });
    }
  };

  const handleTouchMove = (e) => {
    console.log(e.touches.length);
    if (isDragging && e.touches.length === 1) {
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
    if (e.touches.length === 0 && isDragging) {
      setIsDragging(false);
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
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, startMousePosition]);

  // カードクリック時のサウンド再生ハンドラ
  const handleCardClick = () => {
    if (props?.data?.text) {
      setIsBouncing(true);
      playSoundForEmojiCategory(props.data.text, props.data.note);

      // カードクリックの情報をPusherを使って他のユーザーに送信
      const msg = {
        type: "card-clicked",
        text: props.data.text,
        note: props.data.note,
      };
      sendApiPusherChat(props.data, props?.data?.spaceId, "card-clicked");
    }
  };

  useEffect(() => {
    if (isBouncing) {
      const timer = setTimeout(() => {
        setIsBouncing(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isBouncing]);

  // カードのクラス名定義
  const cardClassName = `${isDraggable ? "card draggable-card" : "card"} ${isBouncing ? "jello-animation" : ""}`;

  return (
    <div
      className="card-wrapper"
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
      onMouseDown={handleMouseDown}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}>
      <div style={cardStyle2} className={cardClassName}>
        {props?.data?.text}
      </div>
    </div>
  );
};

export default Card;
