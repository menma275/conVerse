"use client";
import { useEffect, useState } from "react";
import CardLoop from "@/components/cardLoop";

const OtherUserCards = ({ socket, lastCardId }) => {
  const [cardList, setCardList] = useState([]);

  useEffect(() => {
    if (!socket) return;

    const addOtherUserCard = (message) => {
      if (message.userid !== socket.id && message.postid > lastCardId) {
        const newCard = {
          id: cardList.length + 1,
          pos: {
            x: message.pos.x,
            y: message.pos.y,
          },
          text: wrapEmojisInSpans(message.text, 20),
          color: message.color,
        };
        console.log("addOtherUserCard", newCard);
        setCardList((prevCards) => [...prevCards, newCard]);
      }
    };

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

    socket.on("receiveMessage", addOtherUserCard);

    return () => {
      socket.off("receiveMessage", addOtherUserCard);
    };
  }, [socket, lastCardId]);

  return (
    <>
      <CardLoop dataList={cardList} />
    </>
  );
};

export default OtherUserCards;
