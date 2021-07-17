const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("new user connected");

  socket.on("disconnect", () => {
    console.log("an user disconnected");
  });
});

setInterval(() => {
  console.log("Emitting message");
  io.emit("random message", Math.random().toString(36).substring(7));
}, 4000);

http.listen(3000, () => {
  console.log("listening on *:3000");
});
