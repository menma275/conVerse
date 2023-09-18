"use client";

import LoadingDots from "@/components/loading-dots";
import { Suspense } from "react";
import React, { useState, useEffect, useRef } from "react";
import { io as ClientIO } from "socket.io-client";
import Boad from "@/components/boad";
import GenerativeArt from "@/components/genarativeart";
import { BiExpandAlt } from "react-icons/bi";
import { MdDragHandle } from "react-icons/md";
import { RxDragHandleHorizontal } from "react-icons/rx";
import { set } from "mongoose";
// ドラッグ・リサイズ
import Moveable from "react-moveable";

const Index = () => {
  const [message, setMessage] = useState("");
  //const [socketId, setSocketId] = useState("");
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [isRoomOpen, setIsRoomOpen] = useState(false);
  const [resizable, setResizable] = useState(false);

  const resizeTarget = useRef(null);
  const dragTarget = useRef(null);

  const [connected, setConnected] = useState(false);
  const dataList = [];
  let socketId = "";
  let jsonString = "";
  const isCursorDevice = () => {
    return !("ontouchstart" in window || navigator.maxTouchPoints);
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
    console.log(isOpen);
  };

  // board-description-buttonを押したらboard-descriptionを非表示にする
  function toggleRoom() {
    isRoomOpen ? setIsRoomOpen(false) : setIsRoomOpen(true);
    const board = document.getElementById("board_01");
    const boardDescription = document.getElementById("board-description-01");
    if (!isRoomOpen) {
      boardDescription.style.display = "none";
      setResizable(true);
    } else {
      boardDescription.style.display = "inline-block";
      setResizable(false);
    }
  }

  let palettes = [
    ["#FFE6C7", "#FFA559", "#FF6000", "#454545"],
    ["#5D9C59", "#C7E8CA", "#DDF7E3", "#DF2E38"],
    ["#4CACBC", "#6CC4A1", "#A0D995", "#F6E3C5"],
    ["#675D50", "#ABC4AA", "#F3DEBA", "#A9907E"],
    ["#F5F5F5", "#E8E2E2", "#F99417", "#5D3891"],
    ["#EAE0DA", "#F7F5EB", "#A0C3D2", "#EAC7C7"],
    ["#82954B", "#BABD42", "#EFD345", "#FFEF82"],
    ["#146C94", "#19A7CE", "#B0DAFF", "#FEFF86"],
  ];

  let palette = palettes[Math.floor(Math.random() * palettes.length)];
  let lastCardId = 0;

  let x = 0;
  let y = 0;
  let cardId = 0;
  let cardIndex = 0;
  let color;

  // socketで他の人が追加したカードを取得
  const addMessageList = (message) => {
    let cardnum = dataList.length + 1;
    //    message = JSON.parse(message);
    const user = message.userid;
    const text = message.text;
    const x = message.pos.x;
    const y = message.pos.y;
    const color = message.color;

    let data = {
      userid: user,
      postid: cardnum,
      text: text,
      pos: {
        x: x,
        y: y,
      },
      color: color,
    };
    dataList.push(data);

    jsonString = JSON.stringify(dataList);
    console.log(jsonString);
    localStorage.setItem("dataList", jsonString);

    addOtherUserCard();
  };

  // 他のユーザーが作ったカードを追加
  function addOtherUserCard() {
    let datas = dataList;

    if (datas == null) {
      console.log("null");
      return;
    }
    datas.forEach((cardInfo) => {
      if (cardInfo.userid !== socketId && cardInfo.postid > lastCardId) {
        const card = document.createElement("div");
        card.className = "card";
        card.style.left = parseInt(cardInfo.pos.x) + "px";
        card.style.top = parseInt(cardInfo.pos.y) + "px";
        card.innerHTML = wrapEmojisInSpans(cardInfo.text, 20);
        card.style.boxShadow = "0 0 1rem 0.1rem " + cardInfo.color;
        console.log("cardInfo.color" + cardInfo.color);
        card.draggable = false;
        document.getElementById("container").appendChild(card);
        lastCardId = document.getElementById("container").childElementCount;
      }
    });
  }

  //マウスに吹き出しが追従
  function handleMouseMove(e) {
    if (isAddingCard && isCursorDevice()) {
      const follower = document.getElementById("follower");
      const element = document.getElementById("container");
      const containerRect = element.getBoundingClientRect();
      let x = (e.clientX - containerRect.left) / zoom;
      let y = (e.clientY - containerRect.top) / zoom;
      follower.style = 0.5;
      follower.style.left = x + "px";
      follower.style.top = y + "px";
    } else {
      follower.style.opacity = 0;
    }
  }

  // カードを作る
  function createCard(x, y, color) {
    const card = document.createElement("div");
    card.className = "card";
    card.style.left = x + "px";
    card.style.top = y + "px";
    card.textContent = message;
    card.draggable = false;

    card.style.boxShadow = "0 0 1rem 0.1rem " + color;

    card.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", cardIndex);
    });

    document.getElementById("container").appendChild(card);
    cardIndex++;
  }

  //メッセージをPOST
  const sendApiSocketChat = async (msg) => {
    return await fetch("/api/socket/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(msg),
    });
  };

  // dbにカードを保存
  const saveCard = async (msg) => {
    const res = await fetch("/api/message", {
      method: "POST",
      body: JSON.stringify(msg),
      userId: socketId,
    });
  };

  //カードを追加
  const placeMessage = (e) => {
    if (isAddingCard) {
      let cardnum = document.getElementById("container").childElementCount;
      console.log(cardnum);
      const containerRect = document.getElementById("container").getBoundingClientRect();
      x = (e.clientX - containerRect.left) / zoom;
      y = (e.clientY - containerRect.top) / zoom;
      color = palette[Math.floor(Math.random() * palette.length)];

      createCard(x, y, color);
      setIsAddingCard(false);
      document.getElementById("tap-anywhere").style.visibility = "hidden";

      let inputMessage = message;
      if (inputMessage === "") {
        return;
      }

      let msg = {
        userid: socketId,
        postid: cardnum,
        text: inputMessage,
        pos: {
          x: x,
          y: y,
        },
        color: color,
      };
      sendApiSocketChat(msg);
      saveCard(msg);

      //socket.emit("sendMessage", msg);
      // console.log(msg);
      setMessage("");

      //カードが重なって出てくる問題
      lastCardId = document.getElementById("container").childElementCount;
      console.log(lastCardId);
    }
  };

  // ZOOM機能

  const [zoom, setZoom] = useState(1);

  const zoomin = (e) => {
    setZoom((prevCount) => prevCount + 0.1);
  };
  const zoomout = (e) => {
    if (zoom > 0.4) {
      setZoom((prevCount) => prevCount - 0.1);
    }
  };

  //一定の文字数で改行（絵文字改行への対応）
  function wrapEmojisInSpans(emojis, maxLength) {
    let currentLine = "";
    let wrappedEmojis = "";

    for (let i = 0; i < emojis.length; i++) {
      currentLine += emojis[i];

      if (currentLine.length >= maxLength) {
        wrappedEmojis += `<span>${currentLine}</span>`;
        currentLine = "";
      }
    }

    if (currentLine.length > 0) {
      wrappedEmojis += `<span>${currentLine}</span>`;
    }

    return wrappedEmojis;
  }

  //input要素の入力を反映
  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  // 何かが入力されたらカードを追加できるようにする
  useEffect(() => {
    if (message) {
      setIsAddingCard(true);
    } else {
      setIsAddingCard(false);
    }
  }, [message]);

  //スクロール位置をセンターに
  const targetRef = useRef();

  useEffect(() => {
    // const containerW = document.getElementById("container__wrapper");
    if (connected) {
      const handleResize = () => {
        // const clientRect = targetRef.current.getBoundingClientRect();
        const rx = 2500 - targetRef.current.clientWidth / 2;
        const ry = 2500 - targetRef.current.clientHeight / 2;
        targetRef.current.scrollLeft = rx;
        targetRef.current.scrollTop = ry;
        let boardSize = {
          width: targetRef.current.clientWidth,
          height: targetRef.current.clientHeight,
        };
        boardSize = JSON.stringify(boardSize);
        localStorage.setItem("boardSize", boardSize);
        localStorage.removeItem("dataList");
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [connected]);

  useEffect(() => {
    console.log(socketId);
  }, [socketId]);

  //ロード時に実行
  useEffect(() => {
    const socket = new ClientIO({
      path: "/api/socket/io",
      addTrailingSlash: false,
    });

    // log socket connection

    socket.on("connect", () => {
      console.log("SOCKET CONNECTED!", socket.id);
      socketId = socket.id;
      setConnected(true);
    });

    // 追加されたカードの情報を取得
    socket.on("receiveMessage", (message) => {
      addMessageList(message);
    });

    // socket disconnet onUnmount if exists
    if (socket) return () => socket.disconnect();
  }, []);

  if (!connected) {
    return (
      <div className="flex items-center p-4 mx-auto min-h-screen justify-center">
        <div className="gap-4 flex flex-col items-center justify-center w-full h-full">
          <LoadingDots />
        </div>
      </div>
    );
  }

  return (
    <div>
      <GenerativeArt isOpen={isOpen} toggleModal={toggleModal} />
      <header>
        <div className="header pixel-shadow">
          <h1>conVerse</h1>
          <div className="user">
            <p>sakamura</p>
            <img src="/icon1.jpg" alt="icon" className="user-icon" />
          </div>
        </div>
      </header>
      <main>
        <Moveable
          id="moveable"
          target={resizeTarget}
          resizable={resizable}
          draggable={true}
          keepRatio={false}
          dragTarget={dragTarget}
          onDrag={(e) => {
            // target!.style.left = `${left}px`;
            // target!.style.top = `${top}px`;
            e.target.style.transform = e.transform;
          }}
          onResize={(e) => {
            e.target.style.width = `${e.width}px`;
            e.target.style.height = `${e.height}px`;
            e.target.style.transform = e.drag.transform;
            console.log("onResize");
          }}
        />
        <div className="board pixel-shadow" id="board_01" ref={resizeTarget}>
          <div className="board-header pixel-shadow" id="header_01" ref={dragTarget}>
            <div className="board-header-set">
              <h1>emoji Room</h1>
              <button>
                <p>Generate</p>
              </button>
            </div>
            <RxDragHandleHorizontal className="handle text-2xl m-0 p-0" />
          </div>
          <div className="post-set">
            <input id="input-post" type="text" placeholder="Input your message." value={message} onChange={handleChange} />
            {/* <form id="deleteForm">
                    <button type="submit">Reset</button></form> */}
          </div>
          <div id="tap-anywhere" style={{ display: message ? "" : "none" }}>
            <p>👇 Tap anywhere to post.</p>
          </div>
          <div id="container__wrapper" ref={targetRef}>
            <div
              id="container"
              onClick={placeMessage}
              onMouseMove={(e) => handleMouseMove(e)}
              style={{
                transform: `scale(${zoom})`,
              }}>
              <Suspense>
                {/* @ts-expect-error Async Server Component */}
                <Boad />
              </Suspense>

              <div id="follower" className="emoji-span" style={{ display: message ? "" : "none" }}></div>
            </div>
          </div>
          <div id="manipulate">
            <button id="zoomin" className="pixel-shadow" onClick={zoomin}>
              +
            </button>
            <button id="zoomout" className="pixel-shadow" onClick={zoomout}>
              -
            </button>
          </div>
          <div className="board-description" id="board-description-01">
            <div className="desc-jp-en">
              <p className="jp-desc">えもじだけで話す部屋。</p>
              <p className="en-desc">room to chat only with emojis.</p>
            </div>
            <button id="board-description-button" className="pixel-shadow" onClick={toggleRoom}>
              さんかする
            </button>
          </div>
        </div>
        <button className="pixel-shadow" id="create-room">
          Create Room
        </button>
      </main>
    </div>
  );
};

export default Index;
