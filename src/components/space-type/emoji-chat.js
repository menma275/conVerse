"use client";
import React, { useState, useEffect, useRef, useCallback, memo, useContext } from "react";
import ReceiveOtherUserCards from "@/components/receive-other-user-cards";
import Follower from "@/components/parts/follower";
import CardLoop from "@/components/card-loop";
import LoadingSpinner from "@/components/loading/loading-spinner";
import { Suspense } from "react";
import GetCardFromDb from "@/components/get-card-from-db";
import { placeNewMessage } from "@/components/utils/place-new-message";
import { handleMouseMove } from "@/components/utils/mousemove-handler";
import { UserIdContext } from "@/context/userid-context";
import MuteButton, { playSoundForEmojiCategory } from "@/components/parts/mute-button";
import InputMessage from "@/components/parts/input-message";
import Zoom from "@/components/parts/zoom";
import { getNoteFromYPosition } from "@/components/utils/get-note-from-y-position";

const EmojiChat = (props) => {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newMessage, setNewMessage] = useState([]);
  const containerRef = useRef(null);
  const followerRef = useRef(null);
  const { userId } = useContext(UserIdContext);
  const onMouseMoveHandler = useCallback(
    (e) => {
      handleMouseMove(e, isAddingCard, followerRef, containerRef, props.zoom);
    },
    [isAddingCard, props]
  );

  const handleContainerClick = (e) => {
    placeNewMessage(e, setNewMessage, userId, props.spaceId, isAddingCard, containerRef.current, props.zoom, props.message, props.setMessage);

    if (props.sounds) {
      const containerRect = containerRef.current.getBoundingClientRect(); // containerRefを使用してDOMの参照を取得します
      const yPositionRelativeToCenter = (e.clientY - containerRect.top) / props.zoom - containerRect.height / (2 * props.zoom);
      const note = getNoteFromYPosition(yPositionRelativeToCenter);

      if (props.message) {
        try {
          console.log("props.message.text", props.content.message.text);
          playSoundForEmojiCategory(props.content.message.text, note);
        } catch (error) {
          console.error("Error playing emoji sound:", error);
        }
      }
    }
  };

  const containerStyle = {
    transform: `scale(${props.zoom})`,
  };

  useEffect(() => {
    if (props.message) {
      setIsAddingCard(true);
    } else {
      setIsAddingCard(false);
    }
  }, [props.message]);

  useEffect(() => {
    console.log("spaceId updated:", props.spaceId);
  }, [props.spaceId]);

  useEffect(() => {
    console.log("newMessage updated:", newMessage);
  }, [newMessage]);

  return (
    <>
      <div id="container__wrapper" ref={props.targetRef}>
        <div ref={containerRef} id="container" onClick={handleContainerClick} onMouseMove={onMouseMoveHandler} style={containerStyle}>
          <Suspense fallback={<LoadingSpinner />}>
            <GetCardFromDb spaceId={props.spaceId} />
          </Suspense>
          <CardLoop dataList={newMessage} />
          <ReceiveOtherUserCards spaceId={props.spaceId} sounds={props.sounds} />
          <Follower ref={followerRef} isVisible={!!props.message} />
        </div>
      </div>
      <InputMessage message={props.message} setMessage={props.setMessage} />
      <div id="manipulate">
        {props.sounds && <MuteButton />}
        <Zoom setZoom={props.setZoom} zoom={props.zoom} />
      </div>
    </>
  );
};
export default memo(EmojiChat);
