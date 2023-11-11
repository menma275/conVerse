"use client";
import { useEffect, useContext } from "react";

import { getPusherInstance } from "@/components/utils/pusher-config";
import { UserIdContext } from "@/context/userid-context";
import { playSoundForEmojiCategory } from "@/components/sound/sound-generator";
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
  console.log("ReceiveOtherUserCards props", props);
  const { setPostId } = useCardContext();
  const { userId } = useContext(UserIdContext);
  const sounds = props.sounds;

  // new-message
  const handleNewMessage = (data) => {
    console.log("Received Data:", data);

    if (data.content.userId !== userId) {
      if (sounds) {
        try {
          playSoundForEmojiCategory(data.content.message.text, data.content.message.note);
        } catch (error) {
          console.error("Error playing emoji sound:", error);
        }
      }

      const newCard = {
        postId: data.content.message.postId,
        spaceId: props.spaceId,
        pos: {
          x: data.content.message.pos.x,
          y: data.content.message.pos.y,
        },
        scale: data.content.message.scale,
        rotate: data.content.message.rotate,
        text: wrapEmojisInSpans(data.content.message.text, 20),
        note: data.content.message.note,
        color: data.content.message.color,
      };
      props.onReceiveNewCardData(newCard);
    }
  };

  // card-clicked
  const handleCardClicked = (data) => {
    //自分じゃない時
    if (data.content.userId !== userId) {
      console.log("Card Clicked:", data.content.message.postId);
      if (sounds) {
        try {
          playSoundForEmojiCategory(data.content.message.text, data.content.message.note);
          setPostId(data.content.message.postId);
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

  return null;
};

export default ReceiveOtherUserCards;
