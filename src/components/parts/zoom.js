"use client";
import React from "react";
const Zoom = (props) => {
  const zoomin = () => {
    props.setZoom((prevCount) => prevCount + 0.2);
  };
  const zoomout = () => {
    if (props.zoom > 0.4) {
      props.setZoom((prevCount) => prevCount - 0.2);
    }
  };

  return (
    <>
      <button id="zoomin" className="pixel-shadow" onClick={zoomin}>
        +
      </button>
      <button id="zoomout" className="pixel-shadow" onClick={zoomout}>
        -
      </button>
    </>
  );
};
export default Zoom;
