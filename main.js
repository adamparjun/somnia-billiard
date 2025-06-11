// main.js

const socket = io("http://localhost:3000"); // Ganti jika hosting online let roomId = null; let isMyTurn = false; let gameStarted = false;

function startGame() { if (!window.walletConnected) { document.getElementById("status").innerText = "Please connect your wallet first."; return; }

if (!window.hasPaid) { document.getElementById("status").innerText = "Waiting for payment (0.001 STT)..."; payToPlay(); return; }

connectMultiplayer(); }

function connectMultiplayer() { socket.emit("join"); }

socket.on("roomJoined", (room) => { roomId = room; document.getElementById("status").innerText = "Waiting for opponent..."; });

socket.on("startGame", (players) => { isMyTurn = (players[0] === socket.id); document.getElementById("status").innerText = isMyTurn ? "Your turn!" : "Opponent's turn"; gameStarted = true; initGame(); });

socket.on("opponentShot", (data) => { applyOpponentShot(data); isMyTurn = true; document.getElementById("status").innerText = "Your turn!"; });

socket.on("gameOver", (winnerId) => { const result = (winnerId === socket.id) ? "🎉 You Win!" : "😢 You Lose!"; document.getElementById("status").innerText = result; });

function initGame() { const canvas = document.getElementById("gameCanvas"); const ctx = canvas.getContext("2d"); ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = "white"; ctx.beginPath(); ctx.arc(400, 200, 10, 0, 2 * Math.PI); ctx.fill();

if (isMyTurn) { canvas.addEventListener("click", handleShot); } }

function handleShot(event) { if (!isMyTurn || !gameStarted) return;

// Contoh tembakan sederhana (bisa ditingkatkan logikanya) const data = { x: Math.random() * 800, y: Math.random() * 400 };

drawShot(data); socket.emit("shot", { roomId, data }); isMyTurn = false; document.getElementById("status").innerText = "Opponent's turn"; }

function drawShot(data) { const canvas = document.getElementById("gameCanvas"); const ctx = canvas.getContext("2d"); ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = "white"; ctx.beginPath(); ctx.arc(data.x, data.y, 10, 0, 2 * Math.PI); ctx.fill(); }

function applyOpponentShot(data) { drawShot(data); }

