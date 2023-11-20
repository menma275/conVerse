"use client";
import React, { useRef, useEffect, useState } from "react";
import Moveable from "react-moveable";

import SpaceChatHeader from "@/components/parts/space-chat-header";

const SpaceEntrance = (props) => {
  const target = useRef(null);
  const dragTarget = useRef(null);
  const [isParticipationTime, setIsParticipationTime] = useState(true);
  const [countdown, setCountdown] = useState("");

  const style = {
    zIndex: props.spaceInfo.spaceId === props.activeSpaceIndex ? 3 : 1, // activeSpaceIndexと現在のSpaceのindexが一致すればz-indexを2に、そうでなければ1に設定
    ...props.style, // 他のスタイルもここに追加
  };
  const handleMouseDownOrTouchStart = () => {
    props.setActiveSpaceIndex(props.spaceInfo.spaceId);
  };

  useEffect(() => {
    if (props.spaceInfo.startTime) {
      const [startHours, startMinutes] = props.spaceInfo.startTime.split(":").map(Number);
      let startTime = new Date();
      startTime.setHours(startHours, startMinutes, 0, 0);
      let endTime = new Date(startTime.getTime() + props.spaceInfo.duration * 60000);

      const updateCountdownAndParticipation = () => {
        const now = new Date();

        // 現在時刻が終了時間を過ぎている場合、startTime を次の日に更新
        if (now > endTime) {
          startTime.setDate(startTime.getDate() + 1);
          endTime = new Date(startTime.getTime() + props.spaceInfo.duration * 60000);
        }

        const participationPeriod = now >= startTime && now < endTime;
        setIsParticipationTime(participationPeriod);

        if (!participationPeriod) {
          // 次の参加可能時間までのカウントダウンを計算
          const diff = startTime - now;
          const hours = Math.floor(diff / (1000 * 60 * 60))
            .toString()
            .padStart(2, "0");
          const minutes = Math.floor((diff / (1000 * 60)) % 60)
            .toString()
            .padStart(2, "0");
          const seconds = Math.floor((diff / 1000) % 60)
            .toString()
            .padStart(2, "0");
          setCountdown(`${hours}:${minutes}:${seconds}`);
        } else {
          setCountdown("");
        }
      };

      updateCountdownAndParticipation();
      const interval = setInterval(updateCountdownAndParticipation, 1000);

      return () => clearInterval(interval);
    } else {
      setIsParticipationTime(true);
      setCountdown("");
    }
  }, [props.spaceInfo.startTime, props.spaceInfo.duration]);

  return (
    <>
      <Moveable
        target={target}
        draggable={true}
        dragTarget={dragTarget}
        onDrag={(e) => {
          e.target.style.transform = e.transform;
        }}
      />
      <div className={`board pixel-shadow absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 space${props.spaceInfo.spaceId}`} style={style} ref={target} onMouseDown={handleMouseDownOrTouchStart}>
        <div className="board-header pixel-shadow" ref={dragTarget}>
          <SpaceChatHeader name={props.spaceInfo.name} />
        </div>
        <div className="board-description">
          <div className="desc-jp-en">
            <p className="jp-desc">{props.spaceInfo.description}</p>
          </div>
          {isParticipationTime ? (
            <button
              id="board-description-button"
              className="pixel-shadow"
              onClick={() => {
                console.log(props.spaceInfo.spaceId);
                props.setOpenSpaceId(props.spaceInfo.spaceId);
              }}>
              Join
            </button>
          ) : (
            <div className="board-countdown absolute bottom-4 left-4">{`Starts in：${countdown}`}</div>
          )}
        </div>
      </div>
    </>
  );
};
export default SpaceEntrance;
