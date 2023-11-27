"use client";
import React, { useState, memo, useContext } from "react";
import ReceiveOtherUserCards from "@/components/receive-other-user-cards";
import CardLoop from "@/components/card-loop";
import { Suspense } from "react";
import GetCardFromDb from "@/components/get-card-from-db";
import { UserIdContext } from "@/context/userid-context";
import { placeNewMessage } from "@/components/utils/place-new-message";
import { useCardState } from "@/components/hooks/use-card-state";

const NormalChat = () => {
  // ステートとリファレンスの定義
  const { userId } = useContext(UserIdContext); // ユーザーIDを取得
  const [isInitialLoad, setIsInitialLoad] = useState(true); // 初回読み込みかどうかのステート
  const { allCards, loadedData, handleReceiveNewCardData, handleReceiveData } = useCardState();
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    placeNewMessage(e, handleReceiveNewCardData, userId, "normal-chat", true, null, 1, message, setMessage);
  };
  const handleKeyPress = (e) => {
    // Enterキーが押されたときに送信
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };
  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <>
      <div id="container__wrapper">
        <div id="window-container">
          <Suspense>
            {/* DBからカードを取得 */}
            <GetCardFromDb spaceId="normal-chat" onReceiveData={handleReceiveData} loadedData={loadedData} />
          </Suspense>
          {/* カードのループ表示 */}
          <CardLoop dataList={allCards} messageDesign="timeline" resizable={false} isInitialLoad={isInitialLoad} setIsInitialLoad={setIsInitialLoad} />
          {/* 他のユーザーからのカードを受信 */}
          <ReceiveOtherUserCards spaceId="normal-chat" sounds="false" onReceiveNewCardData={handleReceiveNewCardData} />
        </div>
      </div>
      <div className="flex absolute bottom-4 left-4 right-4">
        <div className="post rounded-full border-2 mr-2 border-[var(--accent)]">
          <input id="input-post" type="text" placeholder="Input your message." value={message} onChange={handleChange} onKeyDown={handleKeyPress} className="focus:outline-none" />
        </div>
        <button onClick={handleSubmit} className="normal-submit pixel-shadow">
          Send
        </button>
      </div>
    </>
  );
};

export default memo(NormalChat);
