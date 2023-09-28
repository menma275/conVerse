"use client";

import React, { useState } from "react";
import Header from "@/components/header";
import Room from "@/components/room";

const Index = () => {
  return (
    <div>
      <Header />
      <main>
        <Room />
        <button className="pixel-shadow" id="create-room">
          Create Land
        </button>
      </main>
    </div>
  );
};

export default Index;
