import React, { useState, useEffect, useRef, use } from "react";
import Moveable from "react-moveable";
import { useAnimationControls, motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import Land from "./land";

const CreateLand = () => {
  const [resizable, setResizable] = useState(false);
  const resizeTarget = useRef(null);
  const dragTarget = useRef(null);
  const moveableRef = useRef(null);
  const isMobile = useMediaQuery({ query: "(max-width: 720px)" });
  const [boardSize, setBoardSize] = useState({ width: isMobile ? "90%" : "500px", height: "500px" });
  const [landVisible, setLandVisible] = useState(false); // land コンポーネントの表示状態を管理
  const [createdLandData, setCreatedLandData] = useState(null);
  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    description: "",
    genId: "",
  });

  useEffect(() => {
    console.log("CreateLand", createdLandData);
  }, [createdLandData]);

  // アニメーション後にコントロールボックスをリサイズ
  const updateRect = () => {
    moveableRef.current.updateRect();
    setResizable(true);
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

  const baseUrl = process.env.BASE_URL || "http://localhost:3000";

  // フォームを送信
  const saveLand = async (event) => {
    event.preventDefault();

    const { userId, name, description, genId } = formData;
    console.log("Data to be sent:", formData); // データをログに出力

    // ここでAPIにデータを送信
    try {
      const res = await fetch(`${baseUrl}/api/land`, {
        method: "POST",
        body: JSON.stringify({ info: { userId, name, description, genId } }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 201) {
        // リソースの作成が成功した場合
        const responseData = await res.json(); // レスポンスデータをJSONとしてパース
        console.log("Land created successfully!", responseData);
        setCreatedLandData({ userId, name, description, genId });
        console.log("CreateLand", responseData.land);
        // land コンポーネントを表示
        setLandVisible(true);
      } else {
        // エラー時の処理
        console.error("Error:", res.statusText);
      }
    } catch (error) {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        console.error("Network error: Unable to connect to the server.");
      } else {
        console.error("An error occurred:", error);
      }
    }
  };

  return (
    <>
      {landVisible ? ( // landVisible の値に応じて表示内容を切り替え
        <Land landInfo={createdLandData} landkey={createdLandData.landId} />
      ) : (
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
          <motion.div animate={controls} className="board pixel-shadow absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" id="create-new-land" onAnimationComplete={() => updateRect()} ref={resizeTarget}>
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
                <select name="genId" value={formData.genId} onChange={handleInputChange}>
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
      )}
    </>
  );
};
export default CreateLand;
