"use client";
import React, { useState } from "react";
import CreateSpace from "@/components/create-space";
import { useActiveSpaceIndex } from "@/context/active-space-index-context";

const CreateButton = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { setActiveSpaceIndex } = useActiveSpaceIndex();

  const handleMouseDownOrTouchStart = () => {
    setActiveSpaceIndex(-1);
  };
  return (
    <>
      {isCreateOpen && <CreateSpace setIsCreateOpen={setIsCreateOpen} />}
      <button className="pixel-shadow" id="create-room" onMouseDown={handleMouseDownOrTouchStart} onClick={() => setIsCreateOpen(true)}>
        Create Space
      </button>
    </>
  );
};
export default CreateButton;
