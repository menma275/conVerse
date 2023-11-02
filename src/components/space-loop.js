import Space from "@/components/space";
import React from "react";

const SpaceLoop = ({ spaceList }) => {
  return (
    <>
      {spaceList &&
        spaceList.map((data, index) => (
          <Space
            spaceInfo={data}
            key={index}
            /*spaceId={data.spaceId}
            sounds={data.sounds}
            messageDesign={data.messageDesign}
            resizable={data.resizable}*/
            style={{
              left: `${index * 50 + 50}px`, // 左に10pxずつずらす
              top: `${index * 50 + 50}px`, // 上に10pxずつずらす
              transform: `translate(0, 0)`,
            }}
          />
        ))}
    </>
  );
};
export default SpaceLoop;
