"use client";
import React, { useEffect, useState } from "react";
import { MembraneSynth, Reverb, FeedbackDelay, Master, Synth, MonoSynth, FMSynth, AMSynth, PolySynth, FatOscillator, MetalSynth, start } from "tone";
import { FaVolumeDown, FaVolumeMute } from "react-icons/fa"; // mute アイコンをインポート

//サウンドに関するロジックはこちらに全て納めている
const createSounds = (note, lastDigit, oscillator, envelope) => {
  try {
    switch (lastDigit) {
      case 1:
        const synth1 = new Synth({ oscillator, envelope }).toDestination();
        synth1.triggerAttackRelease(note, "8n");
        addEffectsToSynth(synth1);
        break;
      case 2:
        const monoSynth = new MonoSynth({
          oscillator: {
            type: oscillator,
          },
          envelope,
        }).toDestination();
        monoSynth.triggerAttackRelease(note, "8n");
        addEffectsToSynth(monoSynth);
        break;
      case 3:
      case 10:
        const fmSynth = new FMSynth({ oscillator, envelope }).toDestination();
        fmSynth.triggerAttackRelease(note, "8n");
        addEffectsToSynth(fmSynth);
        break;
      case 4:
        const amSynth = new AMSynth({ oscillator, envelope }).toDestination();
        amSynth.triggerAttackRelease(note, "8n");
        addEffectsToSynth(amSynth);
        break;
      case 5:
        const polySynth = new PolySynth({ oscillator, envelope }).toDestination();
        polySynth.triggerAttackRelease([note, note, note], "8n");
        addEffectsToSynth(polySynth);
        break;
      case 6:
        const fatSynth = new Synth({
          oscillator: {
            type: "fatsawtooth",
            spread: 20,
            count: 3,
          },
          envelope,
        }).toDestination();
        fatSynth.triggerAttackRelease(note, "8n");
        addEffectsToSynth(fatSynth);
        break;
      case 7:
        const metalSynth = new MetalSynth({
          frequency: 300,
          envelope: envelope,
          harmonicity: 5.1,
          modulationIndex: 32,
          resonance: 4000,
          octaves: 1.5,
        }).toDestination();
        metalSynth.triggerAttackRelease(note, "8n");
        addEffectsToSynth(metalSynth);
        break;
      case 8:
        const drumSynth = new MembraneSynth({
          octaves: 4,
          pitchDecay: 0.1,
        }).toDestination();
        drumSynth.triggerAttackRelease(note, "8n");
        addEffectsToSynth(drumSynth);
        break;
      case 9:
        const granularEmulation = new FMSynth().toDestination();
        const interval = setInterval(() => {
          granularEmulation.triggerAttackRelease(note, "32n");
        }, 50); // 50ms毎に音を鳴らす

        setTimeout(() => {
          clearInterval(interval);
        }, 500); // 500ミリ秒後に停止
        addEffectsToSynth(granularEmulation);
        break;
      default:
        console.error("Invalid lastDigit value:", lastDigit);
        break;
    }
  } catch (error) {
    console.error("Error playing emoji sound:", error);
  }
};

const getLastDigitFromCharCode = (emoji) => {
  if (typeof emoji !== "string") {
    throw new Error("Expected emoji to be a string, but got: " + typeof emoji);
  }
  const codePoint = emoji.codePointAt(0).toString(16).toUpperCase();

  // 最後の1文字を数字として取得
  const lastDigitHex = codePoint.slice(-1);
  let lastDigitInt = ((parseInt(lastDigitHex, 16) - 1) % 10) + 1;

  // If the result is 0, set it to 10.
  if (lastDigitInt === 0) {
    lastDigitInt = 10;
  }

  console.log("Last Digit (Int):", lastDigitInt);

  // Return the last digit
  return lastDigitInt;
};

const addEffectsToSynth = (synth) => {
  // リバーブを作成
  const reverb = new Reverb(4).toDestination();
  reverb.wet.value = 0.9;

  // フィードバックディレイを作成
  const delay = new FeedbackDelay("8n", 0.5).toDestination();
  delay.wet.value = 0.2; // wet.valueを0.7に増加

  // シンセサイザーをディレイとリバーブに接続
  synth.connect(delay);
  delay.connect(reverb);
};

export const playSoundForEmojiCategory = (emoji, note) => {
  try {
    const lastDigit = getLastDigitFromCharCode(emoji);
    const synth = new Synth().toDestination();

    console.log("playSoundForEmojiCategory: Last Digit (Int):", lastDigit);

    synth.volume.value = -12;

    const envelope = {
      attack: Math.random() * 0.1,
      decay: Math.random() * 0.3,
      sustain: Math.random() * 0.5,
      release: Math.random() * 1,
    };

    const oscillators = ["sine", "square", "triangle", "sawtooth", "fatsine", "fatsquare", "fattriangle", "fatsawtooth"];

    // ランダムにオシレーターを選択
    const randomOscillator = oscillators[Math.floor(Math.random() * oscillators.length)];

    if (lastDigit >= 1 && lastDigit <= 10) {
      createSounds(note, lastDigit, randomOscillator, envelope);
    } else {
      console.error("Invalid lastDigit value:", lastDigit);
    }
  } catch (error) {
    console.error("Error playing emoji sound:", error);
  }
};

const MuteButton = () => {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    Master.mute = !isMuted; // これを追加
  };

  useEffect(() => {
    start();
    console.log("Tone.jsの初期化に成功");
  }, []);

  return (
    <button onClick={toggleMute} className="mute-button pixel-shadow">
      {!isMuted ? <FaVolumeDown /> : <FaVolumeMute />}
    </button>
  );
};

export default MuteButton;
