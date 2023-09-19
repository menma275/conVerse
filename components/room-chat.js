import { RxDragHandleHorizontal } from "react-icons/rx";
import React, { useState, useEffect, useRef } from "react";
import { io as ClientIO } from "socket.io-client";
import { Suspense } from "react";
import Boad from "@/components/boad";
import GenerativeArt from "@/components/genarativeart";
import Zoom from "@/components/zoom";
import Moveable from "react-moveable";
import { motion } from "framer-motion";

const RoomChat = (Props) => {
  const [resizable, setResizable] = useState(false);
  const resizeTarget = useRef(null);
  const dragTarget = useRef(null);
  const moveableRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  const [zoom, setZoom] = useState(1);

  const [message, setMessage] = useState("");
  const [socketId, setSocketId] = useState("");
  const [isAddingCard, setIsAddingCard] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
    console.log(isOpen);
  };

  const dataList = [];
  // let socketId = "";
  let jsonString = "";
  const isCursorDevice = () => {
    return !("ontouchstart" in window || navigator.maxTouchPoints);
  };

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

  //アニメーション後にコントロールボックスをリサイズ
  const updateRect = () => {
    moveableRef.current.updateRect();
    setResizable(true);
    //resize
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  };

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
      setSocketId(socket.id);
    });

    // 追加されたカードの情報を取得
    socket.on("receiveMessage", (message) => {
      addMessageList(message);
    });

    // socket disconnet onUnmount if exists
    if (socket) return () => socket.disconnect();
  }, []);

  return (
    <>
      <Moveable
        target={resizeTarget}
        resizable={resizable}
        keepRatio={false}
        onResize={(e) => {
          e.target.style.width = `${e.width}px`;
          e.target.style.height = `${e.height}px`;
          e.target.style.transform = e.drag.transform;
          console.log("onResize");
        }}
        draggable={true}
        dragTarget={dragTarget}
        onDrag={(e) => {
          e.target.style.transform = e.transform;
        }}
        ref={moveableRef}
      />
      <motion.div initial={{ width: "300px", height: "300px" }} animate={{ width: "500px", height: "500px" }} transition={{ duration: 0.2 }} className="board pixel-shadow" id="board_01" onAnimationComplete={() => updateRect()} ref={resizeTarget}>
        <div className="board-header pixel-shadow" ref={dragTarget}>
          <div className="board-header-set">
            <h1>emoji Land</h1>
            <button onClick={setIsOpen}>
              <p>Generate</p>
            </button>
          </div>
          <RxDragHandleHorizontal className="handle text-2xl m-0 p-0" />
        </div>
        <div className="post-set">
          <input id="input-post" type="text" placeholder="Input your message." value={message} onChange={handleChange} />
          {/* <form id="deleteForm"><button type="submit">Reset</button></form> */}
        </div>

        <GenerativeArt isOpen={isOpen} toggleModal={toggleModal} />
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
        <Zoom setZoom={setZoom} zoom={zoom} />
      </motion.div>
    </>
  );
};
export default RoomChat;
