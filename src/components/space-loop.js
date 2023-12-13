"use client";
import React, { useEffect, useState } from "react";
import Space from "@/components/space";
import SpaceChatNormal from "@/components/space-chat-normal";
import ASCIIArtClock from "@/components/space-type/ascii-art-clock";
import Start from "@/components/space-type/start";
import { useMediaQuery } from "react-responsive";

const SpaceLoop = ({ spaceList }) => {
  const [spacePositions, setSpacePositions] = useState({});
  const isMobile = useMediaQuery({ query: "(max-width: 720px)" });

  useEffect(() => {
    // ローカルストレージから位置情報を読み込む
    const loadedPositions = {};
    spaceList.forEach((space, index) => {
      const savedPosition = localStorage.getItem(
        `spacePosition-${space.spaceId}`
      );
      if (savedPosition) {
        loadedPositions[space.spaceId] = JSON.parse(savedPosition);
      } else {
        // モバイルの場合は位置を index * 20 + 20 に、そうでない場合は index * 50 + 50 に設定
        const defaultLeftTop = isMobile
          ? `${index * 20 + 20}px`
          : `${index * 40 + 20}px`;
        loadedPositions[space.spaceId] = {
          left: defaultLeftTop,
          top: defaultLeftTop,
        }; // デフォルトの位置
      }
    });
    setSpacePositions(loadedPositions);
  }, [spaceList, isMobile]); // isMobileも依存配列に追加

  return (
    <>
      <SpaceChatNormal />
      <ASCIIArtClock />
      {spaceList.map((data, index) => (
        <Space
          setSpacePositions={setSpacePositions}
          spaceInfo={data}
          key={data.spaceId}
          style={spacePositions[data.spaceId]}
          delay={index * 0.2}
        />
      ))}
    </>
  );
};

export default SpaceLoop;
