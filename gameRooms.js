const rooms = {};

function forceCreateRoom(roomId, player1, player2) {
  rooms[roomId] = {
    players: [
      { socketId: player1.socket.id, wallet: player1.wallet },
      { socketId: player2.socket.id, wallet: player2.wallet }
    ],
    turnIndex: 0
  };
}

function getTurn(roomId) {
  const room = rooms[roomId];
  return room ? room.players[room.turnIndex] : null;
}

function switchTurn(roomId) {
  const room = rooms[roomId];
  if (room) {
    room.turnIndex = 1 - room.turnIndex;
  }
}

function getOpponent(roomId, socketId) {
  const room = rooms[roomId];
  if (!room) return null;
  return room.players.find(p => p.socketId !== socketId);
}

function getRoom(id) {
  return rooms[id];
}

module.exports = {
  forceCreateRoom,
  getTurn,
  switchTurn,
  getOpponent,
  getRoom,
};
