import { sendApiPusherChat } from "@/components/utils/send-api-pusher-chat";
import { getRandomPalette } from "@/components/utils/utils";
import { CARD_PALETTE } from "@/components/utils/card-palette";
import { getNoteFromYPosition } from "@/components/utils/get-note-from-y-position";
import { playSoundForEmojiCategory } from "@/components/parts/mute-button";

export const placeNewMessage = (e, setNewMessage, userId, spaceId, isAddingCard, container, zoom, message, setMessage) => {
  if (!isAddingCard || !message) return null;

  const palette = getRandomPalette(CARD_PALETTE);
  const cardnum = container.childElementCount;
  const containerRect = container.getBoundingClientRect();
  const newX = (e.clientX - containerRect.left) / zoom;
  const newY = (e.clientY - containerRect.top) / zoom;
  const newColor = palette[Math.floor(Math.random() * palette.length)];
  const yPositionRelativeToCenter = (e.clientY - containerRect.top) / zoom - containerRect.height / (2 * zoom);

  const msg = {
    userId: userId,
    spaceId: spaceId,
    postId: cardnum,
    text: message,
    pos: { x: newX, y: newY },
    note: getNoteFromYPosition(yPositionRelativeToCenter),
    color: newColor,
  };
  setNewMessage((prevMessages) => [...prevMessages, msg]);
  playSoundForEmojiCategory(msg.text, msg.note);
  sendApiPusherChat(userId, msg, spaceId);
  setMessage("");
};
