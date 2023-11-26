import Card from "@/components/card";
import React from "react";
const CardLoop = (props) => {
  return (
    <>
      {props.dataList
        .slice()
        .reverse()
        .map((data, index) => (
          <Card data={data} key={data.postId} index={index} messageDesign={props.messageDesign} resizable={props.resizable} isInitialLoad={props.isInitialLoad} setIsInitialLoad={props.setIsInitialLoad} />
        ))}
    </>
  );
};

export default CardLoop;
