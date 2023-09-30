"use client";
import React, { useState } from "react";
import CreateLand from "@/components/create-land";
const CreateButton = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <>
      {isCreateOpen && <CreateLand />}
      <button className="pixel-shadow" id="create-room" onClick={() => setIsCreateOpen(true)}>
        Create Land
      </button>
    </>
  );
};
export default CreateButton;
