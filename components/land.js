"use client";
import LandChat from "@/components/land-chat";
import LandEntrance from "@/components/land-entrance";
import { useLandEntrance } from "@/context/landEntranceContext";

const Land = (props) => {
  const { openLandId, setOpenLandId, activeLandIndex, setActiveLandIndex } = useLandEntrance();

  return <>{openLandId !== props.landkey ? <LandEntrance activeLandIndex={activeLandIndex} setActiveLandIndex={setActiveLandIndex} landInfo={props.landInfo} style={props.style} setOpenLandId={setOpenLandId} openLandId={openLandId} /> : <LandChat activeLandIndex={activeLandIndex} setActiveLandIndex={setActiveLandIndex} style={props.style} landInfo={props.landInfo} />}</>;
};
export default Land;
