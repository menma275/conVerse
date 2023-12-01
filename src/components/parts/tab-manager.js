"use client";

import React, { use } from "react";
import { useEffect, useState, useRef } from "react";
import Tab from "@/components/parts/tab";
import { useOpenSpaceId } from "@/context/open-space-id-context";
import { useMediaQuery } from "react-responsive";

const TabManager = ({ spaceList }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { openSpaceId, setOpenSpaceId } = useOpenSpaceId();
  const [openSpaceName, setOpenSpaceName] = useState(null);
  const isMobile = useMediaQuery({ query: "(max-width: 720px)" });

  useEffect(() => {
    if (openSpaceId !== null) {
      setIsModalOpen(false);
    }
  }, [openSpaceId]);

  useEffect(() => {
    if (isModalOpen) {
      setOpenSpaceId(null);
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (openSpaceId !== null) {
      spaceList.forEach((data) => {
        if (data.spaceId === openSpaceId) {
          setOpenSpaceName(data.name);
        }
      });
    }
  }, [openSpaceId]);

  return (
    <>
      {isMobile ? (
        <div className="">
          <button
            className="h-full flex pixel-shadow px-3"
            onClick={() => setIsModalOpen(!isModalOpen)}
          >
            <p className="text-xs my-auto text-[var(--cream)]">
              {openSpaceName !== null ? openSpaceName : "open Space"}
            </p>
          </button>
          {isModalOpen && (
            <div className="fixed top-0 left-0 w-full h-full bg-[var(--accent)] z-50">
              <div className="h-full flex flex-col justify-center items-center">
                <div className="flex flex-col gap-3">
                  {spaceList.map((data, index) => (
                    <div
                      key={index}
                      className="h-8 flex flex-row justify-between gap-3"
                    >
                      <Tab list={data} />
                      <p className="my-auto text-xs font-sans text-[var(--cream)]">
                        {data.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              {/* closeボタン */}
              <button
                className="fixed bottom-5 left-1/2 -translate-x-1/2"
                onClick={() => setIsModalOpen(!isModalOpen)}
              >
                <p className="text-[var(--cream)]">close</p>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-row">
          {spaceList.map((data, index) => (
            <div key={index}>
              <Tab list={data} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default TabManager;
