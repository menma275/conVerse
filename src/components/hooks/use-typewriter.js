import { useState, useEffect } from "react";

function useTypewriter(text, speed = 100, delay = 0) {
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      let index = 0;
      const intervalId = setInterval(() => {
        if (index < text.length) {
          setTypedText((current) => current + text.charAt(index));
          index++;
        } else {
          clearInterval(intervalId);
        }
      }, speed);

      return () => clearInterval(intervalId);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [text, speed, delay]);

  return typedText;
}

export default useTypewriter;
