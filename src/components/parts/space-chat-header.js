"use client";
import React from "react";
import useTypewriter from "@/components/hooks/use-typewriter";
const SpaceChatHeader = (props) => {
  const name = useTypewriter(props?.name, 100, 1000);
  return (
    <div className="board-header-set">
      <h1>{name}</h1>
    </div>
  );
};
export default SpaceChatHeader;
