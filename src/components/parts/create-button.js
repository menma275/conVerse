"use client";
import React, { useState } from "react";
import CreateSpace from "@/components/create-space";
const CreateButton = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <>
      {isCreateOpen && <CreateSpace />}
      <button className="pixel-shadow" id="create-room" onClick={() => setIsCreateOpen(true)}>
        Create Space
      </button>
    </>
  );
};
export default CreateButton;
