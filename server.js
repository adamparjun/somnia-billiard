const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

let rooms = {}; // roomId -> [player1, player2]

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", () => {
    let roomId = findOrCreateRoom(socket.id);
    socket.join(roomId);
    socket.emit("roomJoined", roomId);

    if (rooms[roomId].length === 2) {
      io.to(roomId).emit("startGame", rooms[roomId]);
    }
  });

  socket.on("shot", ({ roomId, data }) => {
    socket.to(roomId).emit("opponentShot", data);
  });

  socket.on("win", (roomId) => {
    io.to(roomId).emit("gameOver", socket.id);
  });
});

function findOrCreateRoom(playerId) {
  for (let roomId in rooms) {
    if (rooms[roomId].length < 2) {
      rooms[roomId].push(playerId);
      return roomId;
    }
  }

  let newRoomId = "room_" + Math.random().toString(36).substr(2, 6);
  rooms[newRoomId] = [playerId];
  return newRoomId;
}

httpServer.listen(3000, () => console.log("Server running on http://localhost:3000"));
