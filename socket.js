const socket = io();

socket.on("match-found", async ({ roomId, opponent }) => {
  currentRoomId = roomId;
  opponentWallet = opponent;
  isMyTurn = walletAddress.toLowerCase() < opponent.toLowerCase();
  updateTurnUI();
  await joinBet(roomId);
});

socket.on("shot-fired", ({ cueAngle, power, finalPositions }) => {
  animateToShot(cueAngle, power, finalPositions);
  isMyTurn = true;
  updateTurnUI();
});

socket.on("game-ended", ({ winner }) => {
  clearInterval(timerInterval);
  const win = winner.toLowerCase() === walletAddress.toLowerCase();
  document.body.style.background = win ? "#c8f7c5" : "#fdd";
  alert(win ? "🏆 YOU WIN!" : "💀 You lost...");
});
