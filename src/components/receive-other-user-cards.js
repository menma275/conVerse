"use client";
import React, { useEffect, useState, memo, useCallback, useMemo, useContext } from "react";
import CardLoop from "@/components/card-loop";
import { getPusherInstance } from "@/components/utils/pusher-config";
import { UserIdContext } from "@/context/userid-context";
import { playSoundForEmojiCategory } from "@/components/parts/mute-button";

const ReceiveOtherUserCards = (props) => {
  const [cardList, setCardList] = useState([]);
  const [messages, setMessages] = useState([]);
  const { userId } = useContext(UserIdContext);
  const sounds = props.sounds;

  const handleNewMessage = useCallback((data) => {
    // 自分が送信したメッセージかどうかを確認
    if (data.message.userId !== userId) {
      console.log("Received new message:", data.message.text);
      //おとを再生
      if (sounds) {
        try {
          playSoundForEmojiCategory(data.message.text);
        } catch (error) {
          console.error("Error playing emoji sound:", error);
        }
      }
      setMessages((prevMessages) => {
        if (prevMessages.some((message) => message.postId === data.message.postId)) {
          return prevMessages;
        }
        return [...prevMessages, data.message];
      });
    }
  }, []);

  const latestMessage = useMemo(() => messages[messages.length - 1], [messages]); // <-- useMemoを使用して最適化

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

  useEffect(() => {
    const pusher = getPusherInstance();
    console.log("state_change", props.spaceId);

    pusher.connection.bind("state_change", function (states) {
      console.log("Pusher connection state:", states);
    });

    // roomIdに基づいてチャネルを購読
    const channel = pusher.subscribe(`room-${props.spaceId}`);
    console.log("Subscribed to channel:", `room-${props.spaceId}`); // ここでログ出力

    channel.bind("pusher:subscription_error", function (status) {
      console.error("Subscription error:", status);
    });

    // 新しいメッセージが来た場合の処理
    channel.bind("new-message", handleNewMessage);

    channel.bind("pusher:subscription_succeeded", function () {
      console.log("Successfully subscribed to channel:", channel.name);
    });
    return () => {
      console.log("Preparing to unsubscribe from channel:", channel.name);

      channel.unbind_all();
      channel.unsubscribe();

      console.log("Unsubscribed from channel:", channel.name);
    };
  }, [props.spaceId]);

  useEffect(() => {
    if (!latestMessage) {
      console.warn("No latest message available.");
      return;
    }

    console.log("Processing latest message: ", latestMessage);
    const newCard = {
      id: "",
      pos: {
        x: latestMessage.pos.x,
        y: latestMessage.pos.y,
      },
      text: wrapEmojisInSpans(latestMessage.text, 20),
      note: latestMessage.note,
      color: latestMessage.color,
    };
    setCardList((prevCards) => [...prevCards, newCard]);
  }, [latestMessage, props.spaceId]);

  useEffect(() => {
    console.log("spaceId in OtherUserCards:", props.spaceId);
  }, [props.spaceId]);
  return (
    <>
      <CardLoop dataList={cardList} />
    </>
  );
};

export default memo(ReceiveOtherUserCards);
