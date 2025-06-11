let gameStarted = false;

function startGame() {
  if (!window.walletConnected) {
    document.getElementById("status").innerText = "Please connect your wallet first.";
    return;
  }

  if (!window.hasPaid) {
    document.getElementById("status").innerText = "Waiting for payment (0.001 STT)...";
    payToPlay();
    return;
  }

  document.getElementById("status").innerText = "Game started!";
  gameStarted = true;
  initGame();
}
let socket = io("http://localhost:3000");
let isMyTurn = false;
let roomId = null;

function connectMultiplayer() {
  socket.emit("join");
}

socket.on("roomJoined", (room) => {
  roomId = room;
  document.getElementById("status").innerText = "Waiting for opponent...";
});

socket.on("startGame", (players) => {
  isMyTurn = (players[0] === socket.id);
  document.getElementById("status").innerText = isMyTurn ? "Your turn!" : "Opponent's turn";
  initGame();
});

socket.on("opponentShot", (data) => {
  applyOpponentShot(data);
  isMyTurn = true;
  document.getElementById("status").innerText = "Your turn!";
});

socket.on("gameOver", (winnerId) => {
  const result = (winnerId === socket.id) ? "You Win!" : "You Lose!";
  document.getElementById("status").innerText = result;
});
