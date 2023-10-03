import React from "react";

const Card = (props) => {
  const cardStyle = {
    left: `${props?.data?.pos?.x}px`,
    top: `${props?.data?.pos?.y}px`,
    boxShadow: `0 0 1rem 0.1rem ${props?.data?.color}`,
  };

  return (
    <div className="card" style={cardStyle} draggable={false}>
      {props?.data?.text}
    </div>
  );
};

export default Card;
