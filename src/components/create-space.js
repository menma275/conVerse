"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import Moveable from "react-moveable";
import { useAnimationControls, motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import { UserIdContext } from "@/context/userid-context";
import Space from "@/components/space";
import { useActiveSpaceIndex } from "@/context/active-space-index-context";

const CreateSpace = (props) => {
  const [resizable, setResizable] = useState(false);
  const resizeTarget = useRef(null);
  const dragTarget = useRef(null);
  const moveableRef = useRef(null);
  const isMobile = useMediaQuery({ query: "(max-width: 720px)" });
  const [boardSize, setBoardSize] = useState({
    width: isMobile ? "90%" : "500px",
    height: "500px",
  });
  const [spaceVisible, setSpaceVisible] = useState(false); // space コンポーネントの表示状態を管理
  const [createdSpaceData, setCreatedSpaceData] = useState(null);
  const { userId } = useContext(UserIdContext);
  const { activeSpaceIndex, setActiveSpaceIndex } = useActiveSpaceIndex();
  const [enableStartTime, setEnableStartTime] = useState(false); // 開始時間設定の有効化
  const [formData, setFormData] = useState({
    userId: userId,
    name: "",
    description: "",
    spaceType: "default", // デフォルトの選択項目の値
    sounds: true, // デフォルトの選択項目の値
    messageDesign: "card",
    resizable: false,
    genId: "samuelyan", // デフォルトの選択項目の値
  });

  const style = {
    zIndex: -1 === activeSpaceIndex ? 3 : 1, // activeSpaceIndexと現在のSpaceのindexが一致すればz-indexを2に、そうでなければ1に設定
  };
  const handleMouseDownOrTouchStart = () => {
    setActiveSpaceIndex(-1);
  };
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
    const { name, value, checked, type } = event.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  //BaseURLを設定
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // フォームを送信
  const saveSpace = async (event) => {
    event.preventDefault();

    const {
      userId,
      name,
      description,
      spaceType,
      sounds,
      messageDesign,
      resizable,
      genId,
      startTime,
      duration,
    } = formData;
    console.log("Data to be sent:", formData); // データをログに出力

    // ここでAPIにデータを送信
    try {
      const res = await fetch(`${baseUrl}/api/space`, {
        method: "POST",
        body: JSON.stringify({
          info: {
            userId,
            name,
            description,
            spaceType,
            sounds,
            messageDesign,
            resizable,
            genId,
            startTime,
            duration,
          },
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 201) {
        // リソースの作成が成功した場合
        const responseData = await res.json(); // レスポンスデータをJSONとしてパース
        console.log("Space created successfully!", responseData);
        setCreatedSpaceData({
          userId,
          name,
          description,
          spaceType,
          sounds,
          messageDesign,
          resizable,
          genId,
          startTime,
          duration,
          spaceId: responseData.space.spaceId,
        });
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

  // チェックボックスの状態変更ハンドラ
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    if (name === "enableStartTime") {
      setEnableStartTime(checked);
      if (!checked) {
        setFormData({ ...formData, startTime: "", duration: "" }); // 開始時間をリセット
      }
    } else {
      setFormData({
        ...formData,
        [name]: checked,
      });
    }
  };
  const closeModal = () => {
    props.setIsCreateOpen(false);
  };

  return (
    <>
      {spaceVisible ? ( // spaceVisible の値に応じて表示内容を切り替え
        <Space
          spaceInfo={createdSpaceData}
          spaceId={createdSpaceData.spaceId}
        />
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
          <motion.div
            animate={controls}
            onMouseDown={handleMouseDownOrTouchStart}
            style={style}
            className="board pixel-shadow absolute -top-[50dvh] left-1/2 -translate-x-1/2 -translate-y-1/2"
            id="create-new-space"
            onAnimationComplete={() => updateRect()}
            ref={resizeTarget}
          >
            <div className="board-header pixel-shadow" ref={dragTarget}>
              <div className="board-header-set">
                <h1>Create New Space</h1>
              </div>
              <button onMouseUp={closeModal} onTouchEnd={closeModal}>
                Close
              </button>
            </div>
            <div className="board-content">
              <form onSubmit={saveSpace} className="block pt-4">
                {/* スペース名 */}
                <div className="rounded-lg border border-[var(--accent)] mb-2 overflow-hidden">
                  <input
                    id="name"
                    className="p-2 block w-full text-sm bg-[var(--cream)] outline-none font-sans"
                    type="text"
                    name="name"
                    placeholder="Input Space Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {/* スペース説明 */}
                <div className="rounded-lg border border-[var(--accent)] mb-2 overflow-hidden font-sans">
                  <textarea
                    id="description"
                    name="description"
                    rows="6"
                    placeholder="Input Description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="p-2 block w-full text-sm bg-[var(--cream)] outline-none"
                  />
                </div>
                {/* スペースタイプ */}
                <div className="flex justify-between my-3 ">
                  <label className="text-xs my-auto">Space Type</label>
                  <select
                    name="spaceType"
                    value={formData.spaceType}
                    onChange={handleInputChange}
                    required
                    className="text-xs p-1 bg-[var(--cream)] border border-[var(--accent)] rounded-lg font-sans"
                  >
                    <option value="default">Emoji Space</option>
                  </select>
                </div>
                {/* サウンド設定 */}
                <label className="my-2 flex justify-between">
                  <p className="text-xs">Enable Sounds</p>
                  <input
                    type="checkbox"
                    name="sounds"
                    checked={formData.sounds}
                    onChange={handleInputChange}
                  />
                </label>
                {/* メッセージデザイン */}
                <div className="flex justify-between my-3">
                  <p className="text-xs my-auto">Message Design</p>
                  <select
                    name="messageDesign"
                    value={formData.messageDesign}
                    onChange={handleInputChange}
                    required
                    className="text-xs p-1 bg-[var(--cream)] border border-[var(--accent)] rounded-lg font-sans"
                  >
                    <option value="card">Card</option>
                    <option value="nocard">None</option>
                  </select>
                </div>
                {/* リサイズ設定 */}
                <div className="flex justify-between my-3">
                  <p className="text-xs my-auto ">Resizable</p>
                  <label className="">
                    <input
                      type="checkbox"
                      name="resizable"
                      checked={formData.resizable}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                {/* GenArtタイプ */}
                <div className="flex justify-between my-3">
                  <p className="text-xs my-auto">Choose Generative Art</p>
                  <select
                    name="genId"
                    value={formData.genId}
                    onChange={handleInputChange}
                    required
                    className="text-xs p-1 bg-[var(--cream)] border border-[var(--accent)] rounded-lg font-sans"
                  >
                    <option value="" disabled>
                      Select GenArt
                    </option>
                    <option value="samuelyan">Samuel YAN</option>
                    <option value="sakamura">sakamura</option>
                  </select>
                </div>
                {/* 'enableStartTime' チェックボックス */}
                <div className="my-3 flex justify-between">
                  <label htmlFor="enableStartTime" className="text-xs my-auto">
                    Enable Start Time
                  </label>
                  <input
                    id="enableStartTime"
                    name="enableStartTime"
                    type="checkbox"
                    checked={enableStartTime}
                    onChange={handleCheckboxChange}
                  />
                </div>

                {/* 条件付きで開始時間と持続時間の入力フィールドを表示 */}
                {enableStartTime && (
                  <>
                    <div className="my-3 flex justify-between">
                      <label htmlFor="startTime" className="text-xs my-auto">
                        Start Time
                      </label>
                      <input
                        className="text-xs p-1 bg-[var(--cream)] border border-[var(--accent)] rounded-lg font-sans"
                        id="startTime"
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="my-3 flex justify-between">
                      <label htmlFor="duration" className="text-xs my-auto">
                        Duration (minutes)
                      </label>
                      <input
                        className="text-xs p-1 bg-[var(--cream)] border border-[var(--accent)] rounded-lg font-sans"
                        id="duration"
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        min="1"
                        required
                      />
                    </div>
                  </>
                )}
                <input
                  id="submit"
                  className="pixel-shadow absolute bottom-4 left-1/2 -translate-x-1/2"
                  type="submit"
                  value="Create"
                />
              </form>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
};
export default CreateSpace;
