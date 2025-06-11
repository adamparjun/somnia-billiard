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

function initGame() {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(400, 200, 10, 0, 2 * Math.PI);
  ctx.fill();
}
