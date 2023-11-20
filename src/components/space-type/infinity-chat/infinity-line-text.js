import React, { useRef, useEffect, useState } from "react";

const InfinityLineText = ({ dataList }) => {
  // 1. 引数をデストラクチャリング
  const initialText = dataList.map((item) => item.text).join("");

  const [displayText, setDisplayText] = useState("");

  const textRef = useRef(null);

  useEffect(() => {
    setDisplayText(initialText);
    console.log("displayText", displayText);
    const adjustTextLength = () => {
      if (!textRef.current || !document.getElementById("infinityPath")) {
        return;
      }

      const pathLength = document.getElementById("infinityPath").getTotalLength();
      let textArray = [...dataList];

      let textLength = textRef.current.getComputedTextLength();

      // textLengthが0の場合、処理を中断
      if (textLength === 0) return;

      while (textLength > pathLength && textArray.length > 0) {
        textArray.pop(); // 最後の要素を削除
        const newText = textArray.map((item) => item.text).join("");
        setDisplayText(newText);
        textLength = textRef.current.getComputedTextLength();
      }

      console.log("textLength:", textLength);
      console.log("pathLength:", pathLength);
      console.log("textArray length:", textArray.length);
    };

    setTimeout(adjustTextLength, 100);
  }, [dataList, displayText]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="infinity"
      viewBox="0 0 191.8 82.9" // viewBoxを変更
    >
      <path
        d="M91.9,35.5c-14.8-23.6-31.8-35-52-35h0c-22.1,0-39.4,18-39.4,40.9s17.3,40.9,39.4,40.9c20.2,0,37.2-11.5,52-35
		l7.9-11.8c14.8-23.6,31.8-35.1,52-35.1c22.1,0,39.4,18,39.4,40.9s-17.3,40.9-39.4,40.9c-20.2,0-37.2-11.5-52-35"
        fill="none"
        stroke="black"
        id="infinityPath"
      />
      <text fontSize="13" ref={textRef}>
        <textPath href="#infinityPath" startOffset="0%">
          {displayText}
        </textPath>
      </text>
    </svg>
  );
};

export default InfinityLineText;
