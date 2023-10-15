import React, { useState, useEffect, useRef, useContext } from "react";
import Moveable from "react-moveable";
import { useAnimationControls, motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import { UserIdContext } from "@/context/userid-context";
import Space from "@/components/space";

const CreateSpace = () => {
  const [resizable, setResizable] = useState(false);
  const resizeTarget = useRef(null);
  const dragTarget = useRef(null);
  const moveableRef = useRef(null);
  const isMobile = useMediaQuery({ query: "(max-width: 720px)" });
  const [boardSize, setBoardSize] = useState({ width: isMobile ? "90%" : "500px", height: "500px" });
  const [spaceVisible, setSpaceVisible] = useState(false); // space コンポーネントの表示状態を管理
  const [createdSpaceData, setCreatedSpaceData] = useState(null);
  const { userId } = useContext(UserIdContext);
  const [formData, setFormData] = useState({
    userId: userId,
    name: "",
    description: "",
    spaceType: "1", // デフォルトの選択項目の値
    sounds: "1", // デフォルトの選択項目の値
    genId: "samuelyan", // デフォルトの選択項目の値
  });

  useEffect(() => {
    console.log("CreateSpace", createdSpaceData);
  }, [createdSpaceData]);

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

  //BaseURLを設定
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // フォームを送信
  const saveSpace = async (event) => {
    event.preventDefault();

    const { userId, name, description, spaceType, sounds, genId } = formData;
    console.log("Data to be sent:", formData); // データをログに出力

    // ここでAPIにデータを送信
    try {
      const res = await fetch(`${baseUrl}/api/space`, {
        method: "POST",
        body: JSON.stringify({ info: { userId, name, description, spaceType, sounds, genId } }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 201) {
        // リソースの作成が成功した場合
        const responseData = await res.json(); // レスポンスデータをJSONとしてパース
        console.log("Space created successfully!", responseData);
        setCreatedSpaceData({ userId, name, description, spaceType, sounds, genId, spaceId: responseData.space.spaceId });
        console.log("CreateSpace", responseData.space);
        // space コンポーネントを表示
        setSpaceVisible(true);
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
      {spaceVisible ? ( // spaceVisible の値に応じて表示内容を切り替え
        <Space spaceInfo={createdSpaceData} spaceId={createdSpaceData.spaceId} />
      ) : (
        <>
          <Moveable
            target={resizeTarget}
            resizable={resizable}
            keepRatio={false}
            renderDirections={[]}
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
          <motion.div animate={controls} className="board pixel-shadow absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" id="create-new-space" onAnimationComplete={() => updateRect()} ref={resizeTarget}>
            <div className="board-header pixel-shadow" ref={dragTarget}>
              <div className="board-header-set">
                <h1>Create New Space</h1>
              </div>
            </div>
            <div className="board-content">
              <form onSubmit={saveSpace}>
                <div className="rounded-lg border-2 border-[var(--accent)]">
                  <input id="name" type="text" name="name" placeholder="Input Space Name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="rounded-lg border-2 border-[var(--accent)]">
                  <textarea id="description" name="description" rows="6" placeholder="Input Description" value={formData.description} onChange={handleInputChange} />
                </div>
                <select name="spaceType" value={formData.spaceType} onChange={handleInputChange} required>
                  <option value="1">Emoji Space</option>
                  <option value="2">Sound Emoji</option>
                </select>
                <select name="sounds" value={formData.sounds} onChange={handleInputChange} required>
                  <option value="1">On</option>
                  <option value="0">Off</option>
                </select>
                <select name="genId" value={formData.genId} onChange={handleInputChange} required>
                  <option value="" disabled>
                    Select GenArt
                  </option>
                  <option value="samuelyan">Samuel YAN</option>
                  <option value="sakamura">sakamura</option>
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
export default CreateSpace;
