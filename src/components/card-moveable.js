import React, { useState } from "react";
import Moveable from "react-moveable";
import { sendApiPusherChat } from "@/components/utils/send-api-pusher-chat";
import { updateCardDb } from "@/components/utils/update-card-db";

const CardMoveable = ({ target, userId, transform, setTransform, cardData, position, setPosition, setIsCardDragging }) => {
  const [startMousePosition, setStartMousePosition] = useState({ x: 0, y: 0 });
  const [startCardPosition, setStartCardPosition] = useState({ x: 0, y: 0 });

  const updateCardDataAndNotify = () => {
    const updatedCardData = {
      ...cardData,
      pos: {
        x: position.x,
        y: position.y,
      },
      rotate: transform.rotate,
      scale: transform.scale,
    };
    sendApiPusherChat(userId, updatedCardData, updatedCardData.spaceId);
    updateCardDb(updatedCardData, updatedCardData.spaceId);
    setIsCardDragging(false);
  };

  const handleDragStart = (e) => {
    setIsCardDragging(true);
    setStartMousePosition({ x: e.clientX, y: e.clientY });
    setStartCardPosition({ x: position.x, y: position.y });
  };

  const handleDrag = (e) => {
    const dx = e.clientX - startMousePosition.x;
    const dy = e.clientY - startMousePosition.y;
    const newPosition = {
      x: startCardPosition.x + dx,
      y: startCardPosition.y + dy,
    };
    setPosition(newPosition);
  };

  const handleResize = ({ target, delta }) => {
    const newScaleX = transform.scale[0] + delta[0] / target.offsetWidth;
    const newScaleY = transform.scale[1] + delta[1] / target.offsetHeight;
    setTransform((prev) => ({ ...prev, scale: [newScaleX, newScaleY] }));
  };

  const handleRotate = ({ delta }) => {
    setTransform((prev) => ({ ...prev, rotate: prev.rotate + delta }));
  };

  return <Moveable target={target} draggable={true} resizable={true} rotatable={true} rotation={transform.rotate} scale={transform.scale} onDragStart={handleDragStart} onDrag={handleDrag} onDragEnd={updateCardDataAndNotify} onResize={handleResize} onResizeEnd={updateCardDataAndNotify} onRotate={handleRotate} onRotateEnd={updateCardDataAndNotify} />;
};

export default CardMoveable;
