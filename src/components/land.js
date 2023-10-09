"use client";
import LandChat from "@/components/land-chat";
import LandEntrance from "@/components/land-entrance";
import { useActiveLandIndex } from "@/context/active-land-index-context";
import { useOpenLandId } from "@/context/open-land-id-context";
import React from "react";
const Land = (props) => {
  const { openLandId, setOpenLandId } = useOpenLandId();
  const { activeLandIndex, setActiveLandIndex } = useActiveLandIndex();

  return <>{openLandId !== props.landId ? <LandEntrance activeLandIndex={activeLandIndex} setActiveLandIndex={setActiveLandIndex} landInfo={props.landInfo} style={props.style} setOpenLandId={setOpenLandId} openLandId={openLandId} /> : <LandChat activeLandIndex={activeLandIndex} setActiveLandIndex={setActiveLandIndex} landInfo={props.landInfo} />}</>;
};
export default Land;
