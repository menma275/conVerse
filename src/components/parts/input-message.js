"use client";
import React, { useState, useEffect, useRef } from "react";
import { RiEmojiStickerFill } from "react-icons/ri";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { isCursorDevice } from "@/components/utils/utils"; // ヘルパー関数のインポート

const InputMessage = (props) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const pickerRef = useRef(null);

  const handleChange = (e) => {
    props.setMessage(e.target.value);
  };

  const togglePickerOpen = () => {
    setIsPickerOpen(!isPickerOpen);
  };

  const inputEmojis = (emoji) => {
    const input = document.getElementById("input-post");
    input.focus();
    props.setMessage(props.message + emoji.native);
    setIsPickerOpen(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (pickerRef.current && !pickerRef.current.contains(event.target)) {
      if (isCursorDevice()) {
        setIsPickerOpen(false);
      }
    }
  };

  return (
    <>
      <div className="post-set rounded-full border-2 border-[var(--accent)]">
        <div className="absolute bottom-10 left-0" ref={pickerRef} /*onMouseEnter={() => isCursorDevice() && setIsPickerOpen(true)} onMouseLeave={() => isCursorDevice() && setIsPickerOpen(false)}*/>
          {isPickerOpen && <Picker data={data} onEmojiSelect={inputEmojis} perLine="6" emojiButtonSize="40" emojiSize="30" theme="light" previewPosition="none" />}
        </div>
        <input id="input-post" type="text" placeholder="Input your message." value={props.message} onChange={handleChange} onKeyDown={props.onKeyDown} className="focus:outline-none" />
        <button onClick={togglePickerOpen} className="rounded-full m-0 mx-2 p-0">
          <RiEmojiStickerFill className="m-0 p-0 text-2xl text-[var(--accent)]" />
        </button>
      </div>
    </>
  );
};

export default InputMessage;
