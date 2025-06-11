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
