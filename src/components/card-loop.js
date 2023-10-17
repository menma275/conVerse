import Card from "@/components/card";
import React from "react";
import { motion } from "framer-motion";

const CardLoop = (props) => {
  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };
  return (
    <>
      <motion.div variants={stagger} initial="initial" animate="animate">
        {props.dataList.map((data) => (
          <Card data={data} key={data.postId} />
        ))}
      </motion.div>
    </>
  );
};

export default CardLoop;
