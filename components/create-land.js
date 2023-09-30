import React, { useState, useEffect, useRef } from "react";
import Moveable from "react-moveable";
import { useAnimationControls, motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";

const CreateLand = (Props) => {
  const [resizable, setResizable] = useState(false);
  const resizeTarget = useRef(null);
  const dragTarget = useRef(null);
  const moveableRef = useRef(null);
  const isMobile = useMediaQuery({ query: "(max-width: 720px)" });
  const [boardSize, setBoardSize] = useState({ width: isMobile ? "90%" : "500px", height: "500px" });
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    genArt: "",
  });

  // アニメーション後にコントロールボックスをリサイズ
  const updateRect = () => {
    moveableRef.current.updateRect();
    setResizable(true);
    console.log("updateRect");
  };

  // ボードサイズが変更されたときにコントロールもリサイズ
  const controls = useAnimationControls();

  useEffect(() => {
    controls.start({
      width: boardSize.width,
      height: boardSize.height,
      transition: { duration: 0.2, type: "spring" },
    });
  }, [boardSize]);

  // フォームデータを更新
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // フォームを送信
  const saveLand = async (event) => {
    event.preventDefault();

    const { name, description, genArt } = formData;
    console.log(formData);
    /*
    // ここでAPIにデータを送信
    try {
      const res = await fetch("/api/create-land", {
        method: "POST",
        body: JSON.stringify({ name, description, genArt }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200) {
        // 成功時の処理
        alert("Land created successfully!");
      } else {
        // エラー時の処理
        alert("An error occurred while creating the land.");
      }
    } catch (error) {
      console.error("Error:", error);
    }*/
  };

  return (
    <>
      <Moveable
        target={resizeTarget}
        resizable={resizable}
        keepRatio={false}
        onResize={(e) => {
          const newWidth = `${e.width}px`;
          const newHeight = `${e.height}px`;
          e.target.style.width = newWidth;
          e.target.style.height = newHeight;
          e.target.style.transform = e.drag.transform;
          setBoardSize({ width: newWidth, height: newHeight });
          console.log("onResize");
        }}
        draggable={true}
        dragTarget={dragTarget}
        onDrag={(e) => {
          e.target.style.transform = e.transform;
        }}
        ref={moveableRef}
      />
      <motion.div animate={controls} className="board pixel-shadow absolute z-50" id="create-new-land" onAnimationComplete={() => updateRect()} ref={resizeTarget}>
        <div className="board-header pixel-shadow" ref={dragTarget}>
          <div className="board-header-set">
            <h1>Create New Land</h1>
          </div>
        </div>
        <div className="board-content">
          <form onSubmit={saveLand}>
            <div className="rounded-lg border-2 border-[var(--accent)]">
              <input id="name" type="text" name="name" placeholder="Input Land Name" value={formData.name} onChange={handleInputChange} />
            </div>
            <div className="rounded-lg border-2 border-[var(--accent)]">
              <textarea id="description" name="description" rows="6" placeholder="Input Description" value={formData.description} onChange={handleInputChange} />
            </div>
            <select name="genArt" value={formData.genArt} onChange={handleInputChange}>
              <option value="">Select GenArt</option>
              <option value="1">Samuel YAN</option>
              <option value="2">sakamura</option>
            </select>
            <div className="rounded-lg border-2 border-[var(--accent)]">
              <input id="submit" type="submit" value="Create" />
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
};
export default CreateLand;
