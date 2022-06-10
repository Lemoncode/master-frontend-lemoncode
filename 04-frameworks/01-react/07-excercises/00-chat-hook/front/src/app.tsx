import React from "react";
import { createSocket } from "./api";
import SocketIOClient, { Socket } from "socket.io";

export const App = () => {
  const [nickname, setNickName] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [chatlog, setChatlog] = React.useState("");
  const [isConnected, setIsConnected] = React.useState(false);
  const [socket, setSocket] = React.useState<Socket>(null);

  const establishConnection = (nickname) => {
    const socketConnection = createSocket({ nickname });
    setSocket(socketConnection);
    socketConnection.on("message", (body) => {
      if (body && body.type) {
        switch (body.type) {
          case "CONNECTION_SUCCEEDED":
            setIsConnected(true);
            console.log("Connection succeded");
            break;
          case "CHAT_MESSAGE":
            if (body.payload.nickname !== nickname) {
              const newChatlog = `${chatlog}\n${body.payload.content}`;
              setChatlog(newChatlog);
            }
            break;
        }
      }
    });
  };

  const handleConnect = () => {
    if (nickname && !isConnected) {
      establishConnection(nickname);
    }
  };

  const sendMessage = (content: string) => {
    setChatlog(`${chatlog}\n${content}`);
    socket.emit("message", {
      type: "CHAT_MESSAGE",
      payload: { nickname, content },
    });

    setMessage("");
  };

  return (
    <>
      {isConnected ? (
        <label>Nickname: {nickname}</label>
      ) : (
        <>
          <label>Enter Nickname: </label>
          <input
            value={nickname}
            onChange={(e) => setNickName(e.target.value)}
          ></input>
          <button onClick={handleConnect}>Join</button>
        </>
      )}

      {isConnected && (
        <div style={{ marginTop: "40px" }}>
          <label>Message:</label>
          <input
            style={{ width: "80%" }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={(e) => sendMessage(message)}>Send</button>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label>ChatLog</label>
            <textarea
              style={{ height: "400px" }}
              value={chatlog}
              onChange={(e) => setChatlog(e.target.value)}
              readOnly
            ></textarea>
          </div>
        </div>
      )}
    </>
  );
};
