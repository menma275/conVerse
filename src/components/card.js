"use client";
import React from "react";
import { playSoundForEmojiCategory } from "@/components/parts/mute-button";

const Card = (props) => {
  const cardStyle = {
    left: `${props?.data?.pos?.x}px`,
    top: `${props?.data?.pos?.y}px`,
    boxShadow: `0 0 1rem 0.1rem ${props?.data?.color}`,
  };

  const handleCardClick = () => {
    if (props?.data?.text) {
      playSoundForEmojiCategory(props.data.text, props.data.note);
    }
  };

  return (
    <div className="card" style={cardStyle} draggable={false} onClick={handleCardClick}>
      {props?.data?.text}
    </div>
  );
};

export default Card;
