"use client";
import React, { useState, useEffect, useRef, useCallback, memo, useContext } from "react";
import ReceiveOtherUserCards from "@/components/receive-other-user-cards";
import Follower from "@/components/parts/follower";
import CardLoop from "@/components/card-loop";
import { Suspense } from "react";
import GetCardFromDb from "@/components/get-card-from-db";
import { placeNewMessage } from "@/components/utils/place-new-message";
import { handleMouseMove } from "@/components/utils/mousemove-handler";
import { UserIdContext } from "@/context/userid-context";
import MuteButton from "@/components/parts/mute-button";
import InputMessage from "@/components/parts/input-message";
import Zoom from "@/components/parts/zoom";
import { useCardState } from "@/components/hooks/use-card-state";
import useLocalStorage from "@/components/hooks/use-local-storage";
import useCountdownTimer from "@/components/hooks/use-countdown-timer";

const EmojiChat = (props) => {
  // ステートとリファレンスの定義
  const [isAddingCard, setIsAddingCard] = useState(false); // カードを追加しているかどうかのステート
  const containerRef = useRef(null); // コンテナのリファレンス
  const followerRef = useRef(null); // フォロワーのリファレンス
  const { userId } = useContext(UserIdContext); // ユーザーIDを取得
  const [isInitialLoad, setIsInitialLoad] = useState(true); // 初回読み込みかどうかのステート
  const { allCards, loadedData, handleReceiveNewCardData, handleReceiveData } = useCardState();
  const { isParticipationTime, countdown } = useCountdownTimer(props.spaceInfo.startTime, props.spaceInfo.duration);

  // localStorageにカードデータをセット
  useLocalStorage("dataList", allCards);

  // マウスの動きをハンドルする関数
  const onMouseMoveHandler = useCallback(
    (e) => {
      handleMouseMove(e, isAddingCard, followerRef, containerRef, props.zoom);
    },
    [isAddingCard, props]
  );

  // コンテナをクリックしたときのハンドラ
  const handleContainerClick = (e) => {
    placeNewMessage(e, handleReceiveNewCardData, userId, props.spaceInfo.spaceId, isAddingCard, containerRef.current, props.zoom, props.message, props.setMessage);
  };

  // コンテナのスタイルを設定
  const containerStyle = {
    transform: `scale(${props.zoom})`,
  };

  // メッセージの変更を監視してカードの追加ステートを更新
  useEffect(() => {
    if (props.message) {
      setIsAddingCard(true);
    } else {
      setIsAddingCard(false);
    }
  }, [props.message]);

  return (
    <>
      <div id="container__wrapper" ref={props.targetRef}>
        <div ref={containerRef} id="container" onClick={handleContainerClick} onMouseMove={onMouseMoveHandler} style={containerStyle}>
          <Suspense>
            {/* DBからカードを取得 */}
            <GetCardFromDb spaceId={props.spaceInfo.spaceId} onReceiveData={handleReceiveData} loadedData={loadedData} />
          </Suspense>
          {/* カードのループ表示 */}
          <CardLoop dataList={allCards} messageDesign={props.spaceInfo.messageDesign} resizable={props.spaceInfo.resizable} isInitialLoad={isInitialLoad} setIsInitialLoad={setIsInitialLoad} />
          {/* 他のユーザーからのカードを受信 */}
          <ReceiveOtherUserCards spaceId={props.spaceInfo.spaceId} sounds={props.spaceInfo.sounds} onReceiveNewCardData={handleReceiveNewCardData} />
          {/* フォロワーの表示 */}
          <Follower ref={followerRef} isVisible={!!props.message} message={props.message} />
        </div>
      </div>
      <div id="manipulate">
        {/* サウンドのミュートボタン */}
        {props.spaceInfo.sounds && <MuteButton />}
        {/* ズームコントロール */}
        <Zoom setZoom={props.setZoom} zoom={props.zoom} />
      </div>
      {isParticipationTime && <div className="countdown">{countdown}</div>}
      {/* メッセージ入力部分 */}
      {isParticipationTime ? <InputMessage message={props.message} setMessage={props.setMessage} /> : <div className="chat-message">This chat has ended. See you tomorrow!</div>}
    </>
  );
};

export default memo(EmojiChat);
