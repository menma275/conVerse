"use client";

import LoadingDots from "@/components/loading-dots";
import { Suspense } from "react";
import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { io as ClientIO } from "socket.io-client";
import Boad from "@/components/boad";
import GenerativeArt from "@/components/genarativeart";
// component
const Index = () => {
  const [message, setMessage] = useState("");
  //const [socketId, setSocketId] = useState("");
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [connected, setConnected] = useState(false);
  const dataList = [];
  let socketId = "";

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
    //jsonString = JSON.stringify(dataList);
    //localStorage.setItem("dataList", jsonString);

    addOtherUserCard();
  };

  // 他のユーザーが作ったカードを追加
  function addOtherUserCard() {
    // let datas = localStorage.getItem("dataList");
    let datas = dataList;
    // datas = JSON.parse(datas);
    // console.log(datas);

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
  function createCard(x, y) {
    const card = document.createElement("div");
    card.className = "card";
    card.style.left = x + "px";
    card.style.top = y + "px";
    card.textContent = message;
    card.draggable = false;

    color = palette[Math.floor(Math.random() * palette.length)];

    card.style.borderColor = color;

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
      createCard(x, y);
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
      console.log(targetRef);
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
        console.log(boardSize);
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
      //localStorage.setItem("boardSize", boardSize);
      //localStorage.removeItem("dataList");
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
    // 自分のユーザーIDを取得
    /*
    socket.on("user-id", (userId) => {
      const userIdArray = userId.split(",");
      id = userIdArray[0];
      if (id == "") {
        id = userId.toString();
      }
    });*/

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
      <GenerativeArt buttonLabel="Generate" />
      <header>
        <div className="header">
          <h1>conVerse</h1>
          <div className="user">
            <button /*onClick="location.href='demoNFT/index.html'"*/>
              <p>Generate</p>
            </button>
            <img src="/icon1.jpg" alt="icon" className="user-icon" />
          </div>
        </div>
      </header>
      <main>
        <div className="board" id="board">
          <h1>
            <span className="emoji-span">😀</span> emoji Room
          </h1>

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
            <button id="zoomin" onClick={zoomin}>
              +
            </button>
            <button id="zoomout" onClick={zoomout}>
              -
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
