"use client";
import React, { useState, useContext, useEffect, useRef } from "react";
import { playSoundForEmojiCategory } from "@/components/sound/sound-generator";
import { UserIdContext } from "@/context/userid-context";
import { sendApiPusherChat } from "@/components/utils/send-api-pusher-chat";
import { useCardContext } from "@/context/card-context";
import CardMoveable from "@/components/card-moveable";
import { useCardAnimation } from "@/components/utils/animation";

// ヘルパー関数: hexをRGBAに変換
const hexToRgba = (hex, alpha) => {
  const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const Card = (props) => {
  const { data, messageDesign, index, resizable } = props;
  const { userId } = useContext(UserIdContext);
  const { postId, setPostId } = useCardContext();
  const isDraggable = data.userId === userId;

  // States and Refs
  const [position, setPosition] = useState({ x: data?.pos?.x || 0, y: data?.pos?.y || 0 });
  const [isOpacity, setIsOpacity] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const [isCardDragging, setIsCardDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const targetRef = useRef(null);
  const [transform, setTransform] = useState({
    scale: data.scale || [1, 1], // [x-scale, y-scale]
    rotate: data.rotate || 0,
  });
  const { isBouncing, isInitialRender, setIsBouncing } = useCardAnimation(index, postId, data.postId, setPostId, setIsOpacity, props.isInitialLoad, props.setIsInitialLoad);

  // Effects
  useEffect(() => {
    setPosition({ x: data.pos.x, y: data.pos.y });
  }, [data.pos.x, data.pos.y]);

  useEffect(() => {
    setTransform({ scale: data.scale || [1, 1], rotate: data.rotate || 0 });
  }, [data.rotate, data.scale]);

  const handleCardClick = () => {
    setIsClicked(!isClicked);
    if (data?.text) {
      setIsBouncing(true);
      playSoundForEmojiCategory(data.text, data.note);
      sendApiPusherChat(userId, data, data?.spaceId, "card-clicked");
    }
  };

  // Styling
  const cardWrapperCardStyle = {
    transform: `translate(${position.x}px, ${position.y}px)`,
    transformOrigin: `50% 50%`,
    touchAction: "none",
    transition: !isCardDragging && "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
  };

  const computeTransform = () => {
    const baseTransform = `translateY(-2px) scale(${transform.scale[0]}, ${transform.scale[1]}) rotate(${transform.rotate}deg)`;
    return isHovered ? `${baseTransform} translateY(-2px)` : baseTransform;
  };

  const cardStyle = {
    transform: computeTransform(),
    boxShadow: messageDesign === "card" && (isCardDragging || (isHovered && isDraggable)) ? `0 0 2rem 0.1rem ${data?.color}` : "none",
    textShadow: messageDesign !== "card" && (isCardDragging || (isHovered && isDraggable)) ? `0 0.4rem 0.4rem ${hexToRgba(data?.color, 0.5)}` : `0 0.2rem 0.1rem ${hexToRgba(data?.color, 0.5)}`,
    transition: !isCardDragging && "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
  };

  // Rendering
  return (
    <div className="card-wrapper" style={cardWrapperCardStyle} onClick={handleCardClick}>
      <div className={["hover-overlay", isOpacity ? "opacity-0" : "opacity-100", isInitialRender && "popIn", (isBouncing || isClicked) && "jello-animation"].filter(Boolean).join(" ")} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => isDraggable && setIsHovered(false)}>
        {data && (
          <div ref={targetRef} style={cardStyle} className={[messageDesign == "card" ? "card" : "nocard", isDraggable && "draggable-card"].filter(Boolean).join(" ")}>
            {data?.text}
          </div>
        )}
        {resizable && isDraggable && <CardMoveable target={targetRef.current} position={position} setPosition={setPosition} userId={userId} transform={transform} setTransform={setTransform} setIsCardDragging={setIsCardDragging} isCardDragging={isCardDragging} cardData={data} isDraggable={isDraggable} />}
      </div>
    </div>
  );
};

export default Card;
