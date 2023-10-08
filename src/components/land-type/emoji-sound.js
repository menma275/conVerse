"use client";
import React, { useState, useEffect, useRef, useCallback, memo, useContext, use } from "react";
import ReceiveOtherUserCards from "@/components/receive-other-user-cards";
import Follower from "@/components/parts/follower";
import Card from "@/components/card";
import LoadingSpinner from "@/components/loading/loading-spinner";
import { Suspense } from "react";
import GetCardFromDb from "@/components/get-card-from-db";
import { placeNewMessage } from "@/components/utils/place-new-message";
import { handleMouseMove } from "@/components/utils/mousemove-handler";
import { UserIdContext } from "@/context/userid-context";

const EmojiSound = (props) => {
  console.log("EmojiChat", props.landId);

  // 状態管理
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const containerRef = useRef(null);
  const followerRef = useRef(null);
  const { userId } = useContext(UserIdContext);

  // カーソルが動いたときの動作
  const onMouseMoveHandler = useCallback((e) => handleMouseMove(e, isAddingCard, followerRef, containerRef, props.zoom), [isAddingCard, props]);

  const handleContainerClick = (e) => {
    placeNewMessage(e, setNewMessage, userId, props.landId, isAddingCard, containerRef.current, props.zoom, props.message, props.setMessage);
  };

  // 何かが入力されたらカードを追加できるようにする
  useEffect(() => {
    console.log("props.message", props.message);
    if (props.message) {
      setIsAddingCard(true);
    } else {
      setIsAddingCard(false);
    }
  }, [props.message]);

  useEffect(() => {
    console.log("landId updated:", props.landId);
  }, [props.landId]);

  useEffect(() => {
    console.log("newMessage updated:", newMessage);
  }, [newMessage]);

  // 描画部分
  return (
    <div ref={containerRef} id="container" onClick={handleContainerClick} onMouseMove={onMouseMoveHandler} style={{ transform: `scale(${props.zoom})` }}>
      <Suspense fallback={<LoadingSpinner />}>
        <GetCardFromDb landId={props.landId} />
      </Suspense>
      <Card data={newMessage} />
      <ReceiveOtherUserCards landId={props.landId} />
      <Follower ref={followerRef} isVisible={!!props.message} />
    </div>
  );
};
export default memo(EmojiSound);
