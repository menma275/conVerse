"use client";
import { Time, Synth, MonoSynth, FMSynth, AMSynth, PolySynth, MetalSynth, MembraneSynth } from "tone";
import { addEffectsToSynth } from "@/components/sound/tone-initializer";

const createAndPlaySynth = (SynthType, options, note) => {
  const synth = new SynthType(options).toDestination();
  let duration = "8n"; // Default duration

  if (synth instanceof PolySynth) {
    synth.triggerAttackRelease([note, note, note], duration);
  } else {
    synth.triggerAttackRelease(note, duration);
  }

  addEffectsToSynth(synth);

  // Reverb decay time + note duration
  const reverbDecayTime = 6;
  const timeToDispose = (Time(duration).toSeconds() + reverbDecayTime) * 1000;

  setTimeout(() => {
    synth.dispose();
    synth.disconnect();
  }, timeToDispose);
};

const createSounds = (note, lastDigit, oscillator, envelope) => {
  try {
    const commonOptions = { oscillator, envelope };
    const synthConfigurations = {
      1: { SynthType: Synth, options: commonOptions },
      2: { SynthType: MonoSynth, options: { oscillator: { type: oscillator }, envelope } },
      3: { SynthType: FMSynth, options: commonOptions },
      4: { SynthType: AMSynth, options: commonOptions },
      5: { SynthType: PolySynth, options: commonOptions },
      6: { SynthType: Synth, options: { oscillator: { type: "fatsawtooth", spread: 20, count: 3 }, envelope } },
      7: {
        SynthType: MetalSynth,
        options: {
          frequency: 300,
          envelope,
          harmonicity: 5.1,
          modulationIndex: 32,
          resonance: 4000,
          octaves: 1.5,
        },
      },
      8: { SynthType: MembraneSynth, options: { octaves: 4, pitchDecay: 0.1 } },
      10: { SynthType: FMSynth, options: commonOptions },
    };

    const configuration = synthConfigurations[lastDigit];

    if (configuration) {
      if (lastDigit !== 9) {
        createAndPlaySynth(configuration.SynthType, configuration.options, note);
      } else {
        // ケース9は特別な処理が必要なので、こちらのロジックを維持
        const granularEmulation = new FMSynth().toDestination();
        const interval = setInterval(() => {
          granularEmulation.triggerAttackRelease(note, "32n");
        }, 50);
        setTimeout(() => {
          clearInterval(interval);
          addEffectsToSynth(granularEmulation);
          granularEmulation.dispose();
        }, 500);
      }
    } else {
      console.error("Invalid lastDigit value:", lastDigit);
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

export const playSoundForEmojiCategory = (emoji, note) => {
  if (!emoji) {
    console.error("Emoji is undefined or null.");
    return;
  }

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
      console.log("playSoundForEmojiCategory: Success", note, lastDigit);
    } else {
      console.error("Invalid lastDigit value:", lastDigit);
    }
  } catch (error) {
    console.error(`Error playing sound for emoji ${emoji} with note ${note}:`, error);
  }
};
