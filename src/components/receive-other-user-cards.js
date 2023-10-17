import React, { useEffect, useState, useContext } from "react";
import CardLoop from "@/components/card-loop";
import { getPusherInstance } from "@/components/utils/pusher-config";
import { UserIdContext } from "@/context/userid-context";
import { playSoundForEmojiCategory } from "@/components/parts/mute-button";
import { useCardContext } from "@/context/card-context";

const wrapEmojisInSpans = (emojis, maxLength) => {
  let currentLine = "";
  let wrappedEmojis = [];

  for (let i = 0; i < emojis.length; i++) {
    currentLine += emojis[i];

    if (currentLine.length >= maxLength) {
      wrappedEmojis.push(currentLine);
      currentLine = "";
    }
  }
  if (currentLine.length > 0) {
    wrappedEmojis.push(currentLine);
  }
  return wrappedEmojis;
};

const ReceiveOtherUserCards = (props) => {
  const [cardList, setCardList] = useState([]);
  const { postId, setPostId } = useCardContext();
  const { userId } = useContext(UserIdContext);
  const sounds = props.sounds;

  // new-message
  const handleNewMessage = (data) => {
    console.log("Received Data:", data);

    if (data.message.userId !== userId) {
      if (sounds) {
        try {
          playSoundForEmojiCategory(data.message.text);
        } catch (error) {
          console.error("Error playing emoji sound:", error);
        }
      }

      const newCard = {
        postId: data.message.postId,
        spaceId: props.spaceId,
        pos: {
          x: data.message.pos.x,
          y: data.message.pos.y,
        },
        text: wrapEmojisInSpans(data.message.text, 20),
        note: data.message.note,
        color: data.message.color,
      };

      setCardList((prevCards) => {
        const updatedCards = [...prevCards];
        const cardIndex = updatedCards.findIndex((card) => card.postId === newCard.postId);
        if (cardIndex !== -1) {
          updatedCards[cardIndex] = newCard;
        } else {
          updatedCards.push(newCard);
        }
        console.log("Updated Card List:", updatedCards);
        return updatedCards;
      });
    }
  };

  // card-clicked
  const handleCardClicked = (data) => {
    //自分じゃない時
    if (data.message.userId !== userId) {
      console.log("Card Clicked:", data);
      if (sounds) {
        try {
          playSoundForEmojiCategory(data.message.text, data.message.note);
          setPostId(data.message.postId);
        } catch (error) {
          console.error("Error playing sound on card click:", error);
        }
      }
    }
  };

  useEffect(() => {
    const pusher = getPusherInstance();
    const channel = pusher.subscribe(`room-${props.spaceId}`);

    channel.bind("new-message", handleNewMessage);
    channel.bind("card-clicked", handleCardClicked);

    return () => {
      channel.unbind("new-message", handleNewMessage);
      channel.unbind("card-clicked", handleCardClicked);
      channel.unsubscribe();
    };
  }, [props.spaceId, userId, sounds]);

  return <CardLoop dataList={cardList} clickedCardIds={postId} />;
};

export default ReceiveOtherUserCards;
