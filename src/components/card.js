"use client";
import React, { useState, useContext, useEffect } from "react";
import { playSoundForEmojiCategory } from "@/components/parts/mute-button";
import { UserIdContext } from "@/context/userid-context";

const Card = (props) => {
  const [isDragging, setIsDragging] = useState(false);
  const { userId } = useContext(UserIdContext);
  const isDraggable = props.data.userId === userId;

  const [position, setPosition] = useState({
    x: props?.data?.pos?.x || 0,
    y: props?.data?.pos?.y || 0,
  });

  const [startMousePosition, setStartMousePosition] = useState({ x: 0, y: 0 });

  if (!props?.data?.pos) {
    console.error("Position data is missing in props!");
    return null;
  }

  const cardStyle = {
    left: `${position.x}px`,
    top: `${position.y}px`,
    boxShadow: `0 0 1rem 0.1rem ${props?.data?.color}`,
  };

  const handleCardClick = () => {
    console.log("Card clicked");
    if (props?.data?.text) {
      playSoundForEmojiCategory(props.data.text, props.data.note);
    }
  };

  const handleMouseDown = (e) => {
    console.log("Mouse down on card");
    if (!isDraggable) return;
    setIsDragging(true);
    setStartMousePosition({
      x: e.clientX,
      y: e.clientY,
    });
    window.addEventListener("mousemove", handleMouseMove);
  };

  useEffect(() => {
    console.log("Setting up global mouse events");
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      console.log("Cleaning up global mouse events");
      if (isDragging) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseMove = (e) => {
    console.log("Mouse moving while dragging");
    try {
      if (isDragging) {
        const dx = e.clientX - startMousePosition.x;
        const dy = e.clientY - startMousePosition.y;
        setPosition((prevPosition) => ({
          x: prevPosition.x + dx,
          y: prevPosition.y + dy,
        }));
        setStartMousePosition({
          x: e.clientX,
          y: e.clientY,
        });
      }
    } catch (error) {
      console.error("Error during mouse move:", error);
    }
  };

  const handleMouseUp = () => {
    console.log("Mouse up (drag end)");
    setIsDragging(false);
    window.removeEventListener("mousemove", handleMouseMove);
  };

  return (
    <div className="card" style={cardStyle} draggable={false} onClick={handleCardClick} onMouseDown={handleMouseDown}>
      {props?.data?.text}
    </div>
  );
};

export default Card;
