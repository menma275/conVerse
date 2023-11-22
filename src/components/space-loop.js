"use client";
import React, { useEffect, useState } from "react";
import Space from "@/components/space";

const SpaceLoop = ({ spaceList }) => {
  const [spacePositions, setSpacePositions] = useState({});

  useEffect(() => {
    // ローカルストレージから位置情報を読み込む
    const loadedPositions = {};
    spaceList.forEach((space, index) => {
      const savedPosition = localStorage.getItem(`spacePosition-${space.spaceId}`);
      loadedPositions[space.spaceId] = savedPosition ? JSON.parse(savedPosition) : { left: `${index * 50 + 50}px`, top: `${index * 50 + 50}px` }; // デフォルトの位置
    });
    setSpacePositions(loadedPositions);
  }, [spaceList]);

  return (
    <>
      {spaceList.map((data, index) => (
        <Space setSpacePositions={setSpacePositions} spaceInfo={data} key={data.spaceId} style={spacePositions[data.spaceId]} delay={index * 0.1} />
      ))}
    </>
  );
};

export default SpaceLoop;
