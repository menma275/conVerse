"use client";
import Card from "@/components/card";
import React from "react";

const CardLoop = (props) => {
  return (
    <>
      {/* dataListの各データを元にカードをマッピングして表示 */}
      {props.dataList.map((data, index) => (
        <Card data={data} key={index} />
      ))}
    </>
  );
};

export default CardLoop;
