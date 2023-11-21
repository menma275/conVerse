"use client";
import React, { useContext, useEffect, useRef, memo } from "react";
import ReceiveOtherUserCards from "@/components/receive-other-user-cards";
import { Suspense } from "react";
import GetCardFromDb from "@/components/get-card-from-db";
import { useCardState } from "@/components/hooks/use-card-state";
import InfinityLineText from "@/components/space-type/infinity-chat/infinity-line-text";
import { UserIdContext } from "@/context/userid-context";
import { sendApiPusherChat } from "@/components/utils/send-api-pusher-chat";
import { playSoundForEmojiCategory } from "@/components/sound/sound-generator";
import { v4 as uuidv4 } from "uuid";

const InfinityChat = (props) => {
  // ステートとリファレンスの定義
  const containerRef = useRef(null); // コンテナのリファレンス
  const { userId } = useContext(UserIdContext); // ユーザーIDを取得
  const { allCards, loadedData, handleReceiveNewCardData, handleReceiveData } = useCardState();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Enterキーが押された場合、何もしない
      if (e.key === "Enter") return;

      // キーの文字をallCardsに追加
      const msg = {
        userId: userId,
        spaceId: props.spaceInfo.spaceId,
        postId: uuidv4(),
        text: e.key,
        pos: { x: 0, y: 0 },
        scale: [1, 1],
        rotate: 0,
        note: "C5",
        color: "#F5F5F5",
      };
      playSoundForEmojiCategory(msg.text, msg.note);
      sendApiPusherChat(userId, msg, props.spaceInfo.spaceId);
      handleReceiveNewCardData(msg);
    };

    // イベントリスナーを追加
    window.addEventListener("keydown", handleKeyDown);

    // コンポーネントがアンマウントされたときにイベントリスナーを削除
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleReceiveNewCardData]);

  return (
    <>
      <div id="container__wrapper" ref={props.targetRef}>
        <div ref={containerRef} id="window-container">
          <Suspense>
            <GetCardFromDb spaceId={props.spaceInfo.spaceId} onReceiveData={handleReceiveData} loadedData={loadedData} />
          </Suspense>
          <ReceiveOtherUserCards spaceId={props.spaceInfo.spaceId} sounds={props.spaceInfo.sounds} onReceiveNewCardData={handleReceiveNewCardData} />
          {/* 無限マークのライン上に文字を配置
           */}
          <InfinityLineText dataList={allCards} />
        </div>
      </div>
    </>
  );
};

export default memo(InfinityChat);
