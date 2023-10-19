"use client";
import React, { useEffect, useState } from "react";
import { FaVolumeDown, FaVolumeMute } from "react-icons/fa";
import { toneInitializer, toggleMute } from "@/components/sound/tone-initializer";

const MuteButton = () => {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    toneInitializer();
    console.log("Tone.jsの初期化に成功");
  }, []);

  const handleToggleMute = () => {
    const newMuteStatus = !isMuted;
    setIsMuted(newMuteStatus);
    toggleMute(newMuteStatus);
  };

  return (
    <button onClick={handleToggleMute} className="mute-button pixel-shadow">
      {!isMuted ? <FaVolumeDown /> : <FaVolumeMute />}
    </button>
  );
};

export default MuteButton;
