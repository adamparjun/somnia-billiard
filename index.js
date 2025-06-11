const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const gameRooms = require("./gameRooms");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let queue = [];

io.on("connection", (socket) => {
  socket.on("find-match", ({ wallet }) => {
    queue.push({ socket, wallet });
    if (queue.length >= 2) {
      const p1 = queue.shift();
      const p2 = queue.shift();
      const roomId = "room-" + Date.now();

      p1.socket.join(roomId);
      p2.socket.join(roomId);
      p1.socket.emit("match-found", { roomId, opponent: p2.wallet });
      p2.socket.emit("match-found", { roomId, opponent: p1.wallet });

      gameRooms.forceCreateRoom(roomId, p1, p2);
    }
  });

  socket.on("shot", ({ roomId, shotData }) => {
    const room = gameRooms.getRoom(roomId);
    if (!room) return;
    const currentTurn = gameRooms.getTurn(roomId);
    if (socket.id !== currentTurn.socketId) return;

    const opponent = gameRooms.getOpponent(roomId, socket.id);
    io.to(opponent.socketId).emit("shot-fired", shotData);
    gameRooms.switchTurn(roomId);
  });

  socket.on("report-match", ({ roomId, winner, loser }) => {
    console.log("Match ended:", roomId, "Winner:", winner, "Loser:", loser);
  });
});

app.use(express.static(__dirname + "/../"));
server.listen(3000, () => console.log("Server listening on http://localhost:3000"));
