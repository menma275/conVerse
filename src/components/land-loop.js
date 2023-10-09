import Land from "@/components/land";
import React from "react";

const LandLoop = ({ landList }) => {
  console.log("LandLoop");
  return (
    <>
      {landList &&
        landList.map((data, index) => (
          <Land
            landInfo={data}
            key={index}
            landId={data.landId}
            style={{
              left: `${index * 50 + 50}px`, // 左に10pxずつずらす
              top: `${index * 50 + 50}px`, // 上に10pxずつずらす
            }}
          />
        ))}
    </>
  );
};
export default LandLoop;
