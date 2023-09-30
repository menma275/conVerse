"use client";

import React, { useState } from "react";
import Header from "@/components/header";
import Room from "@/components/room";

import CreateButton from "@/components/create-button";

const Index = () => {
  return (
    <div>
      <Header />
      <main>
        <Room />
        <CreateButton />
      </main>
    </div>
  );
};

export default Index;
