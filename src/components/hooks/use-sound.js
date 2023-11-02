import { useCallback } from "react";
import { playSoundForEmojiCategory } from "@/components/sound/sound-generator";

function useSound() {
  const playEmojiSound = useCallback((messageText, note) => {
    console.log("playEmojiSound", messageText, note);
    try {
      playSoundForEmojiCategory(messageText, note);
    } catch (error) {
      console.error("Error playing emoji sound:", error);
    }
  }, []);

  return { playEmojiSound };
}

export default useSound;
