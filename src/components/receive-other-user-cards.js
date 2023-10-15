import React, { useEffect, useState, useCallback, useContext } from "react";
import CardLoop from "@/components/card-loop";
import { getPusherInstance } from "@/components/utils/pusher-config";
import { UserIdContext } from "@/context/userid-context";
import { playSoundForEmojiCategory } from "@/components/parts/mute-button";
import Pusher from "pusher-js";

Pusher.log = function (message) {
  if (window.console && window.console.log) {
    window.console.log(message);
  }
};
const ReceiveOtherUserCards = (props) => {
  const [cardList, setCardList] = useState([]);
  const { userId } = useContext(UserIdContext);
  const sounds = props.sounds;

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
        id: data.message.postId.toString(),
        spaceId: props.spaceId,
        pos: {
          x: data.message.pos.x,
          y: data.message.pos.y,
        },
        text: data.message.text,
        note: data.message.note,
        color: data.message.color,
      };

      setCardList((prevCards) => {
        const updatedCards = [...prevCards];
        const cardIndex = updatedCards.findIndex((card) => card.id === newCard.id);
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

  useEffect(() => {
    const pusher = getPusherInstance();
    const channel = pusher.subscribe(`room-${props.spaceId}`);
    channel.bind("new-message", handleNewMessage);
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [props.spaceId, handleNewMessage]);

  return <CardLoop dataList={cardList} />;
};

export default ReceiveOtherUserCards;
/*
const ReceiveOtherUserCards = (props) => {
  const [cardList, setCardList] = useState([]);
  const { userId } = useContext(UserIdContext);
  const sounds = props.sounds;

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

  const handleNewMessage = useCallback(
    (data) => {
      console.log("Handling new message:", data);
      if (data.message.userId !== userId) {
        console.log("Received new message:", data.message.text);
        if (sounds) {
          try {
            playSoundForEmojiCategory(data.message.text);
          } catch (error) {
            console.error("Error playing emoji sound:", error);
          }
        }
        const newCard = {
          id: data.message.postId.toString(),
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
          const existingCard = prevCards.find((card) => card.id === newCard.id);
          if (existingCard) {
            console.log("Updating card with ID:", newCard.id);
            return prevCards.map((card) => (card.id === newCard.id ? newCard : card));
          } else {
            console.log("Adding new card with ID:", newCard.id);
            return [...prevCards, newCard];
          }
        });
      }
    },
    [userId, sounds, props.spaceId]
  );

  useEffect(() => {
    const pusher = getPusherInstance();

    pusher.connection.bind("state_change", function (states) {
      console.log("Pusher connection state:", states);
    });

    const channel = pusher.subscribe(`room-${props.spaceId}`);

    channel.bind("pusher:subscription_error", function (status) {
      console.error("Subscription error:", status);
    });

    channel.bind("new-message", handleNewMessage);

    channel.bind("pusher:subscription_succeeded", function () {
      console.log("Successfully subscribed to channel:", channel.name);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [props.spaceId, handleNewMessage]);

  return (
    <>
      <CardLoop dataList={cardList} />
    </>
  );
};

export default ReceiveOtherUserCards;
*/
