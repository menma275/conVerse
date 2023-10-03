"use client";
import React, { useState, useEffect, useRef, useCallback, use } from "react";
import { useSocket } from "@/context/socket-context";
import OtherUserCards from "@/components/other-user-cards";
import Follower from "@/components/parts/follower";
import CardLoop from "@/components/card-loop";
import LoadingSpinner from "@/components/loading/loading-spinner";
import { Suspense } from "react";
import BoadAc from "@/components/boad-ac";

import { CARD_PALETTE } from "@/components/utils/card-palette";
import { sendApiSocketChat, saveCard } from "@/components/utils/send-save";
import { isCursorDevice, getRandomPalette } from "@/components/utils/utils";

const OPACITY_VISIBLE = 0.5;
const OPACITY_HIDDEN = 0;

const Container = (props) => {
  // ソケット通信の設定
  const socket = useSocket(`instance_${props.landId}`);

  // 状態管理
  const [isAddingCard, setIsAddingCard] = useState(false);
  const containerRef = useRef(null);
  const followerRef = useRef(null);
  const palette = getRandomPalette(CARD_PALETTE);
  const [lastCardId, setLastCardId] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  const [cardList, setCardList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // カードを作成する関数
  const createCard = (x, y, color) => {
    setCardList((prevCards) => [
      ...prevCards,
      {
        id: cardIndex,
        pos: {
          x: x,
          y: y,
        },
        text: props.message,
        color: color,
      },
    ]);
    setCardIndex(cardIndex + 1);
  };

  // メッセージを配置する関数
  const placeMessage = useCallback(
    (e) => {
      if (!isAddingCard) return;

      const cardnum = containerRef.current.childElementCount;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newX = (e.clientX - containerRect.left) / props.zoom;
      const newY = (e.clientY - containerRect.top) / props.zoom;
      const newColor = palette[Math.floor(Math.random() * palette.length)];

      createCard(newX, newY, newColor);
      setIsAddingCard(false);

      const inputMessage = props.message;
      if (inputMessage === "") {
        return;
      }

      // 作成したメッセージのデータ
      const msg = {
        userid: socket.id,
        postid: cardnum,
        text: inputMessage,
        pos: {
          x: newX,
          y: newY,
        },
        color: newColor,
      };

      // ソケット通信でメッセージを送信
      sendApiSocketChat(msg);

      // データベースにメッセージを保存
      saveCard(msg, props.landId);

      props.setMessage("");
      setLastCardId(cardnum);
    },
    [isAddingCard, props, palette, socket]
  );

  // カーソルが動いたときの動作を定義
  const handleMouseMove = useCallback(
    (e) => {
      if (followerRef.current) {
        if (!isAddingCard || !isCursorDevice()) {
          followerRef.current.style.opacity = OPACITY_HIDDEN;
          return;
        }
        console.log("handleMouseMove");
        const containerRect = containerRef.current.getBoundingClientRect();
        const newX = (e.clientX - containerRect.left) / props.zoom;
        const newY = (e.clientY - containerRect.top) / props.zoom;

        followerRef.current.style.opacity = OPACITY_VISIBLE;
        followerRef.current.style.left = newX + "px";
        followerRef.current.style.top = newY + "px";
      }
    },
    [isAddingCard, props]
  );

  // 何かが入力されたらカードを追加できるようにする
  useEffect(() => {
    if (props.message) {
      setIsAddingCard(true);
    } else {
      setIsAddingCard(false);
    }
  }, [props.message]);

  useEffect(() => {
    if (!socket) return; // socketがnullの場合は、以降の処理をスキップ

    const handleConnect = () => {
      setIsLoading(false);
    };

    const handleError = (error) => {
      console.error("ソケット接続エラー:", error);
      setIsLoading(false);
    };

    // イベントリスナの設定
    socket.on("connect", handleConnect);
    socket.on("connect_error", handleError);

    const { landId } = props;

    // landIdに基づいて部屋に参加するか、すべての部屋から退出するかを決定
    if (landId) {
      socket.emit("joinLand", { landId });
    } else {
      socket.emit("leaveAllLands");
    }

    // コンポーネントがアンマウントされたときのクリーンアップ処理
    return () => {
      if (socket) {
        // ここでもsocketの存在チェックを行う
        socket.off("connect", handleConnect);
        socket.off("connect_error", handleError);

        if (landId) {
          socket.emit("leaveLand", { landId });
        } else {
          socket.emit("leaveAllLands");
        }
      }
    };
  }, [socket, props.landId]);

  // 描画部分
  return (
    <div ref={containerRef} id="container" onClick={placeMessage} onMouseMove={handleMouseMove} style={{ transform: `scale(${props.zoom})` }}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Suspense fallback={<LoadingSpinner />}>
            <BoadAc landId={props.landId} />
          </Suspense>
          <OtherUserCards socket={socket} lastCardId={lastCardId} />
          <CardLoop dataList={cardList} />
          <Follower ref={followerRef} isVisible={!!props.message} />
        </>
      )}
    </div>
  );
};

export default Container;
