import { sendApiPusherChat } from "@/components/utils/send-api-pusher-chat";
import { getRandomPalette } from "@/components/utils/utils";
import { CARD_PALETTE } from "@/components/utils/card-palette";

export const placeNewMessage = (e, setNewMessage, userId, landId, isAddingCard, container, zoom, message, setMessage) => {
  if (!isAddingCard || !message) return null;

  const palette = getRandomPalette(CARD_PALETTE);
  const cardnum = container.childElementCount;
  const containerRect = container.getBoundingClientRect();
  const newX = (e.clientX - containerRect.left) / zoom;
  const newY = (e.clientY - containerRect.top) / zoom;
  const newColor = palette[Math.floor(Math.random() * palette.length)];

  const msg = {
    userId: userId,
    postId: cardnum,
    text: message,
    pos: { x: newX, y: newY },
    color: newColor,
  };
  setNewMessage(msg);
  sendApiPusherChat(msg, landId);
  setMessage("");
};
