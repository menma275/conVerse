import { sendApiPusherChat } from "@/components/utils/send-api-pusher-chat";
import { getRandomPalette } from "@/components/utils/utils";
import { CARD_PALETTE } from "@/components/utils/card-palette";
import { getNoteFromYPosition } from "@/components/utils/get-note-from-y-position";
import { playSoundForEmojiCategory } from "@/components/sound/sound-generator";
import { v4 as uuidv4 } from "uuid";

export const placeNewMessage = (e, handleReceiveNewCardData, userId, spaceId, isAddingCard, container, zoom, message, setMessage) => {
  if (!isAddingCard || !message) return null;

  const palette = getRandomPalette(CARD_PALETTE);
  const newColor = palette[Math.floor(Math.random() * palette.length)];
  const containerRect = container ? container.getBoundingClientRect() : "";
  const newX = container ? (e.clientX - containerRect.left) / zoom : "";
  const newY = container ? (e.clientY - containerRect.top) / zoom : "";
  const yPositionRelativeToCenter = (e.clientY - containerRect.top) / zoom - containerRect.height / (2 * zoom);

  const msg = {
    userId: userId,
    spaceId: spaceId,
    postId: uuidv4(),
    text: message,
    pos: { x: newX, y: newY },
    scale: [1, 1],
    rotate: 0,
    note: getNoteFromYPosition(yPositionRelativeToCenter),
    color: newColor,
  };
  playSoundForEmojiCategory(msg.text, msg.note);
  sendApiPusherChat(userId, msg, spaceId);
  handleReceiveNewCardData(msg);
  setMessage("");
};
