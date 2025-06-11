let walletAddress = "";
let currentRoomId = "";
let isMyTurn = false;
let opponentWallet = "";
let turnTime = 30;
let timerInterval = null;

document.getElementById("connectWallet").onclick = async () => {
  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  walletAddress = accounts[0];
  document.getElementById("walletInfo").innerText = "Wallet: " + walletAddress;
};

document.getElementById("findMatchBtn").onclick = () => {
  socket.emit("find-match", { wallet: walletAddress });
};

function updateTurnUI() {
  document.getElementById("turnIndicator").innerText = isMyTurn ? "🎯 Your Turn!" : "⏳ Opponent's Turn...";
  startTurnTimer();
}

function startTurnTimer() {
  clearInterval(timerInterval);
  turnTime = 30;
  document.getElementById("timer").innerText = `⏱️ ${turnTime}s`;
  timerInterval = setInterval(() => {
    turnTime--;
    document.getElementById("timer").innerText = `⏱️ ${turnTime}s`;
    if (turnTime <= 0) {
      clearInterval(timerInterval);
      alert("⛔ Time's up!");
      isMyTurn = false;
      updateTurnUI();
    }
  }, 1000);
}
