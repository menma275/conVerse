import React from "react";
import Tab from "@/components/parts/tab";

const TabManager = ({ spaceList }) => {
  return (
    <div className="flex flex-row">
      {spaceList.map((data, index) => (
        <div key={index}>
          <Tab list={data} />
        </div>
      ))}
    </div>
  );
};
export default TabManager;
