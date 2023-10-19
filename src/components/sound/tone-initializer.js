"use client";
import { Reverb, FeedbackDelay, start, getDestination } from "tone";

// エフェクトのインスタンスを一度だけ作成
const reverb = new Reverb(4).toDestination();
const delay = new FeedbackDelay("8n", 0.5).toDestination();

reverb.wet.value = 0.9;
delay.wet.value = 0.8;

// エフェクトの接続
delay.connect(reverb);

export const toneInitializer = async () => {
  if (typeof window !== "undefined") {
    await start();
    console.log("Tone.jsの初期化に成功");
  }
};

export const addEffectsToSynth = (synth) => {
  // 既存のエフェクトのインスタンスをシンセサイザーに接続
  synth.connect(delay);
  // reverbのインスタンスを返さない
};
export const toggleMute = (muteStatus) => {
  getDestination().mute = muteStatus;
};
