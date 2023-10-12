import Land from "@/components/land";
import React from "react";

const LandLoop = ({ landList }) => {
  return (
    <>
      {landList &&
        landList.map((data, index) => (
          <Land
            landInfo={data}
            key={index}
            landId={data.landId}
            sounds={data.sounds}
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
export default LandLoop;
