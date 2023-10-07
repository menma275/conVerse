"use client";
import React, { useState } from "react";
import { RiEmojiStickerFill } from "react-icons/ri";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const InputMessage = (props) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  //input要素の入力を反映
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
  };
  return (
    <>
      <div className="post-set rounded-full border-2 border-[var(--accent)]">
        <div className="absolute bottom-10 left-0">{isPickerOpen && <Picker data={data} onEmojiSelect={inputEmojis} perLine="6" theme="light" previewPosition="none" />}</div>
        <input id="input-post" type="text" placeholder="Input your message." value={props.message} onChange={handleChange} className="focus:outline-none" />
        <button onClick={togglePickerOpen} className="rounded-full m-0 mx-2 p-0">
          <RiEmojiStickerFill className="m-0 p-0 text-2xl text-[var(--accent)]" />
        </button>
      </div>
    </>
  );
};
export default InputMessage;
