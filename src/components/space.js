import SpaceChat from "@/components/space-chat";
import SpaceEntrance from "@/components/space-entrance";
import { useActiveSpaceIndex } from "@/context/active-space-index-context";
import { useOpenSpaceId } from "@/context/open-space-id-context";
import { motion } from "framer-motion";
import React from "react";
const Space = (props) => {
  const { openSpaceId, setOpenSpaceId } = useOpenSpaceId();
  const { activeSpaceIndex, setActiveSpaceIndex } = useActiveSpaceIndex();
  return (
    <>
      <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2, type: "spring", delay: props.delay }}>
        {openSpaceId !== props.spaceInfo.spaceId ? (
          <SpaceEntrance activeSpaceIndex={activeSpaceIndex} onPositionChange={props.onPositionChange} delay={props.delay} setActiveSpaceIndex={setActiveSpaceIndex} spaceInfo={props.spaceInfo} style={props.style} setOpenSpaceId={setOpenSpaceId} openSpaceId={openSpaceId} />
        ) : (
          <SpaceChat setSpacePositions={props.setSpacePositions} activeSpaceIndex={activeSpaceIndex} setActiveSpaceIndex={setActiveSpaceIndex} spaceInfo={props.spaceInfo} />
        )}
      </motion.div>
    </>
  );
};
export default Space;
