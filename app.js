const express = require('express');
const app = express();
const path = require('path');
const http = require("http");
const socketio = require("socket.io");

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",       // allows mobile & browser connections
    methods: ["GET", "POST"]
  }
});

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function(socket) {
  console.log("connected:", socket.id);

  socket.on("send-location", function(data) {
    io.emit("recieve-location", { id: socket.id, ...data });
  });

  socket.on("disconnect", function() {
    io.emit("user-disconnected", socket.id);
  });
});

app.get("/", function(req, res) {
  res.render("index");
});

// Use Railway's PORT env variable, fallback to 3000 locally
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});