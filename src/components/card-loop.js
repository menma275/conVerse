import Card from "@/components/card";
import React from "react";
const CardLoop = (props) => {
  return (
    <>
      {props.dataList.map((data, index) => (
        <Card data={data} key={data.postId} index={index} />
      ))}
    </>
  );
};

export default CardLoop;
