"use client";
import React, { useState } from "react";
import CreateSpace from "@/components/create-space";
import { useActiveSpaceIndex } from "@/context/active-space-index-context";
import { FaSpaceAwesome } from "react-icons/fa6";

const CreateButtonFooter = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { setActiveSpaceIndex } = useActiveSpaceIndex();

  const handleMouseDownOrTouchStart = () => {
    setActiveSpaceIndex(-1);
  };

  return (
    <>
      {isCreateOpen && <CreateSpace setIsCreateOpen={setIsCreateOpen} />}
      <button
        className="pixel-shadow w-fit h-full bg-[var(--accent)] text-xs px-3 text-[var(--cream)] flex items-center gap-2"
        onMouseDown={handleMouseDownOrTouchStart}
        onClick={() => setIsCreateOpen(!isCreateOpen)}
      >
        <FaSpaceAwesome />
        <span className="mt-1 hidden">Create Space</span>
      </button>
    </>
  );
};
export default CreateButtonFooter;
