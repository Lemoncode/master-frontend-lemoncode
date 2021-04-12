import { readable } from "svelte/store";
import { io } from "socket.io-client";

export const randomMessages = readable(
  ["Welcome. You can receive messages"],
  (set) => {
    let messages = [""];

    let socket = io("ws://localhost:3000");

    socket.on("random message", function (data) {
      messages = [...messages, data];
      set(messages);
    });
  }
);
