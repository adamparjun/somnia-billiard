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
}
// server.js

const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
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

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter(id => id !== socket.id);

      // Inform the opponent if one player leaves
      if (rooms[roomId].length === 1) {
        io.to(roomId).emit("opponentLeft");
      }

      // If room is empty, delete it
      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      }
    }
  });
});

function findOrCreateRoom(socketId) {
  for (const roomId in rooms) {
    if (rooms[roomId].length === 1) {
      rooms[roomId].push(socketId);
      return roomId;
    }
  }

  // Create new room
  const newRoomId = generateRoomId();
  rooms[newRoomId] = [socketId];
  return newRoomId;
}

function generateRoomId() {
  return Math.random().toString(36).substr(2, 9);
}

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
