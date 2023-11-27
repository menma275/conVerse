"use client";
import React, { useState, useEffect } from "react";

const ClockDisplay = ({ size }) => {
  const [time, setTime] = useState(null);
  const isServer = typeof window === "undefined";

  useEffect(() => {
    if (isServer) return; // サーバーではタイマーを設定しない
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const clockArt = getClockArt(time, size);

  return <pre style={{ lineHeight: "70%" }}>{clockArt}</pre>;
};

const getClockArt = (date, size) => {
  if (!date) return "";

  const centerX = Math.floor(size / 2);
  const centerY = Math.floor(size / 2);
  const radius = Math.floor(size / 2) - 1;

  // 空の正方形を作成
  let clock = Array.from({ length: size }, () => Array(size).fill(" "));

  // 円を描画
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (Math.round(Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)) === radius) {
        clock[y][x] = "c"; // 円の周りを 'o' で描画
      }
    }
  }

  // 時針、分針、秒針の位置を計算
  const hour = date.getHours() % 12;
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const hourAngle = (hour + minute / 60) * (360 / 12);
  const minuteAngle = minute * (360 / 60);
  const secondAngle = second * (360 / 60);

  // 針を描画
  const drawHand = (angle, length, char) => {
    const radian = (Math.PI / 180) * (angle - 90);
    for (let i = 1; i <= length; i++) {
      const x = centerX + Math.cos(radian) * i;
      const y = centerY + Math.sin(radian) * i;
      if (x >= 0 && x < size && y >= 0 && y < size) {
        clock[Math.round(y)][Math.round(x)] = char;
      }
    }
  };

  drawHand(hourAngle, radius * 0.5, "H"); // 短針
  drawHand(minuteAngle, radius * 0.7, "M"); // 長針
  drawHand(secondAngle, radius * 0.8, "S"); // 秒針

  // 文字列として組み立て
  return clock.map((row) => row.join("")).join("\n");
};

export default ClockDisplay;
