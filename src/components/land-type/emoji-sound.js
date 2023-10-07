"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import OtherUserCards from "@/components/other-user-cards";
import Follower from "@/components/parts/follower";
import LoadingSpinner from "@/components/loading/loading-spinner";
import { Suspense } from "react";
import BoadAc from "@/components/boad-ac";

import { placeNewMessage } from "@/components/utils/place-new-message";
import { handleMouseMove } from "@/components/utils/mousemove-handler";

const EmojiSound = (props) => {
  console.log("EmojiSound ", props.landId);

  // 状態管理
  const [isAddingCard, setIsAddingCard] = useState(false);
  const containerRef = useRef(null);
  const followerRef = useRef(null);

  // カーソルが動いたときの動作
  const onMouseMoveHandler = useCallback((e) => handleMouseMove(e, isAddingCard, followerRef, containerRef, props.zoom), [isAddingCard, props]);

  const handleContainerClick = (e) => {
    placeNewMessage(e, props.landId, isAddingCard, containerRef.current, props.zoom, props.message, props.setMessage);
  };

  // 何かが入力されたらカードを追加できるようにする
  useEffect(() => {
    if (props.message) {
      setIsAddingCard(true);
    } else {
      setIsAddingCard(false);
    }
  }, [props.message]);

  // 描画部分
  return (
    <div ref={containerRef} id="container" onClick={handleContainerClick} onMouseMove={onMouseMoveHandler} style={{ transform: `scale(${props.zoom})` }}>
      <Suspense fallback={<LoadingSpinner />}>
        <BoadAc landId={props.landId} />
      </Suspense>
      <OtherUserCards landId={props.landId} />
      <Follower ref={followerRef} isVisible={!!props.message} />
    </div>
  );
};
export default EmojiSound;
