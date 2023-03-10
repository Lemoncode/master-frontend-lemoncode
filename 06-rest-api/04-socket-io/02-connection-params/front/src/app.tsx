import React from "react";
import { Socket } from "socket.io-client";
import { createSocket } from "./api";
import { wsBodyTypes } from "./consts";

export const App = () => {
  const [message, setMessage] = React.useState("");
  const [chatlog, setChatlog] = React.useState("");
  const [isConnected, setIsConnected] = React.useState(false);
  const [socket, setSocket] = React.useState<Socket>(null);
  const [nickname, setNickname] = React.useState("");

  const establishConnection = () => {
    const socketConnection = createSocket(nickname);
    setSocket(socketConnection);
    socketConnection.on("message", (body) => {
      if (body && body.type) {
        switch (body.type) {
          case wsBodyTypes.connectionSucceded:
            setIsConnected(true);
            console.log("Connection succeded");
            break;
          case wsBodyTypes.chatMessage:
            setChatlog(
              (chatlog) =>
                `${chatlog}\n[${body.payload.nickname}]${body.payload.content}`
            );
            break;
        }
      }
    });
  };

  const handleConnect = () => {
    if (!isConnected) {
      establishConnection();
    }
  };

  const sendMessage = (content: string) => {
    setChatlog(`${chatlog}\n[Me - ${nickname}]: ${content}`);
    socket.emit("message", {
      type: wsBodyTypes.chatMessage,
      payload: { content },
    });

    setMessage("");
  };

  return (
    <>
      <label>Enter Nickname: </label>
      <input value={nickname} onChange={(e) => setNickname(e.target.value)} />
      <button onClick={handleConnect} disabled={isConnected}>Join</button>
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
