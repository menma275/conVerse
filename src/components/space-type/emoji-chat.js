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
import { playSoundForEmojiCategory } from "@/components/sound/sound-generator";
import MuteButton from "@/components/parts/mute-button";
import InputMessage from "@/components/parts/input-message";
import Zoom from "@/components/parts/zoom";
import { getNoteFromYPosition } from "@/components/utils/get-note-from-y-position";

const EmojiChat = (props) => {
  const [allCards, setAllCards] = useState([]);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const containerRef = useRef(null);
  const followerRef = useRef(null);
  const { userId } = useContext(UserIdContext);
  const [loadedData, setLoadedData] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const onMouseMoveHandler = useCallback(
    (e) => {
      handleMouseMove(e, isAddingCard, followerRef, containerRef, props.zoom);
    },
    [isAddingCard, props]
  );

  const handleContainerClick = (e) => {
    placeNewMessage(e, setAllCards, userId, props.spaceId, isAddingCard, containerRef.current, props.zoom, props.message, props.setMessage);

    if (props.sounds) {
      const containerRect = containerRef.current.getBoundingClientRect(); // containerRefを使用してDOMの参照を取得します
      const yPositionRelativeToCenter = (e.clientY - containerRect.top) / props.zoom - containerRect.height / (2 * props.zoom);
      const note = getNoteFromYPosition(yPositionRelativeToCenter);

      if (props.message) {
        try {
          console.log("props.message.text", props.message.text);
          playSoundForEmojiCategory(props.message.text, note);
        } catch (error) {
          console.error("Error playing emoji sound:", error);
        }
      }
    }
  };

  const containerStyle = {
    transform: `scale(${props.zoom})`,
  };

  const handleReceiveNewCardData = useCallback((newCard) => {
    setAllCards((prevCards) => {
      const cardIndex = prevCards.findIndex((card) => card.postId === newCard.postId);
      if (cardIndex === -1) {
        return [...prevCards, newCard];
      } else {
        return prevCards.map((card) => (card.postId === newCard.postId ? newCard : card));
      }
    });
  }, []);

  const handleReceiveData = (newData) => {
    setAllCards(() => newData);
    setLoadedData(true);
  };

  // localStorageにデータをセットする関数
  const setDetaList = (allCards) => {
    localStorage.removeItem("dataList");
    const jsonString = JSON.stringify(allCards);
    localStorage.setItem("dataList", jsonString);
  };

  useEffect(() => {
    if (props.message) {
      setIsAddingCard(true);
    } else {
      setIsAddingCard(false);
    }
  }, [props.message]);

  useEffect(() => {
    setDetaList(allCards);
  }, [allCards]);

  return (
    <>
      <div id="container__wrapper" ref={props.targetRef}>
        <div ref={containerRef} id="container" onClick={handleContainerClick} onMouseMove={onMouseMoveHandler} style={containerStyle}>
          <Suspense fallback={<LoadingSpinner />}>
            <GetCardFromDb spaceId={props.spaceId} onReceiveData={handleReceiveData} loadedData={loadedData} />
          </Suspense>
          <CardLoop dataList={allCards} messageDesign={props.messageDesign} resizable={props.resizable} isInitialLoad={isInitialLoad} setIsInitialLoad={setIsInitialLoad} />
          <ReceiveOtherUserCards spaceId={props.spaceId} sounds={props.sounds} cardList={allCards} onReceiveNewCardData={handleReceiveNewCardData} />
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
