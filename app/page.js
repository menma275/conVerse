"use client";

import React, { useState } from "react";
import Room from "@/components/room";

const Index = () => {
  return (
    <div>
      <header>
        <div className="header pixel-shadow">
          <h1>conVerse</h1>
          <div className="user">
            <p>sakamura</p>
            <img src="/icon1.jpg" alt="icon" className="user-icon" />
          </div>
        </div>
      </header>
      <main>
        <Room />
        <button className="pixel-shadow" id="create-room">
          Create Room
        </button>
      </main>
    </div>
  );
};

export default Index;
