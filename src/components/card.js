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

function lowerBrightness(color, amount) {
  // HEXをRGBに変換
  let r = parseInt(color.substring(1, 3), 16);
  let g = parseInt(color.substring(3, 5), 16);
  let b = parseInt(color.substring(5, 7), 16);

  // 明度を下げる
  r = Math.max(0, r - amount);
  g = Math.max(0, g - amount);
  b = Math.max(0, b - amount);

  // RGBをHEXに変換して返す
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

const Card = (props) => {
  const { data, messageDesign, index, resizable } = props;
  const { userId } = useContext(UserIdContext);
  const { postId, setPostId } = useCardContext();
  const isDraggable = props.messageDesign === "timeline" ? false : data.userId === userId;

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
    transition: !isCardDragging && "all 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
  };

  const computeTransform = () => {
    const baseTransform = `translateY(-2px) scale(${transform.scale[0]}, ${transform.scale[1]}) rotate(${transform.rotate}deg)`;
    return isHovered ? `${baseTransform} translateY(-2px)` : baseTransform;
  };

  const amount = 20; // 明度を下げる量
  const newColor = lowerBrightness(data?.color, amount);

  const cardStyle =
    messageDesign == "timeline"
      ? {
          color: newColor,
        }
      : {
          transform: computeTransform(),
          boxShadow: messageDesign === "card" ? (isCardDragging || (isHovered && isDraggable) ? `0 0 1rem 0.2rem ${data?.color}` : `0 0 0.5rem 0.1rem ${data?.color}`) : "none",
          textShadow: messageDesign !== "card" ? (isCardDragging || (isHovered && isDraggable) ? `0 0.4rem 0.4rem ${hexToRgba(data?.color, 0.5)}` : `0 0.2rem 0.1rem ${hexToRgba(data?.color, 0.5)}`) : "none",
          transition: !isCardDragging && "all 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
        };

  // Rendering
  return (
    <>
      {messageDesign && messageDesign !== "timeline" ? (
        <div className="card-wrapper" style={cardWrapperCardStyle} onClick={handleCardClick}>
          <div className={["hover-overlay", isOpacity ? "opacity-0" : "opacity-100", isInitialRender && "popIn", (isBouncing || isClicked) && "jello-animation"].filter(Boolean).join(" ")} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => isDraggable && setIsHovered(false)}>
            <div ref={targetRef} style={cardStyle} className={[messageDesign, isDraggable && "draggable-card"].filter(Boolean).join(" ")}>
              {data?.text}
            </div>
            {resizable && isDraggable && <CardMoveable target={targetRef.current} position={position} setPosition={setPosition} userId={userId} transform={transform} setTransform={setTransform} setIsCardDragging={setIsCardDragging} isCardDragging={isCardDragging} cardData={data} isDraggable={isDraggable} />}
          </div>
        </div>
      ) : (
        data && (
          <div ref={targetRef} style={cardStyle} className={[messageDesign, isDraggable && "draggable-card"].filter(Boolean).join(" ")}>
            {data?.text}
          </div>
        )
      )}
    </>
  );
};

export default Card;
