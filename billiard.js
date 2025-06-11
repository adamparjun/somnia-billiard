const socket = io("http://localhost:3000");let roomId = null; let isMyTurn = false; let gameStarted = false;

let canvas, ctx; let ball = { x: 400, y: 200, radius: 10, vx: 0, vy: 0 };

let isDragging = false; let dragStart = null;

function startGame() { if (!window.walletConnected) { document.getElementById("status").innerText = "Please connect your wallet first."; return; }

if (!window.hasPaid) { document.getElementById("status").innerText = "Waiting for payment (0.001 STT)..."; payToPlay(); return; }

connectMultiplayer(); }

function connectMultiplayer() { socket.emit("join"); }

socket.on("roomJoined", (room) => { roomId = room; document.getElementById("status").innerText = "Waiting for opponent..."; });

socket.on("startGame", (players) => { isMyTurn = (players[0] === socket.id); document.getElementById("status").innerText = isMyTurn ? "Your turn!" : "Opponent's turn"; gameStarted = true; initGame(); });

socket.on("opponentShot", (data) => { applyOpponentShot(data); isMyTurn = true; document.getElementById("status").innerText = "Your turn!"; });

socket.on("gameOver", (winnerId) => { const result = (winnerId === socket.id) ? "🎉 You Win!" : "😢 You Lose!"; document.getElementById("status").innerText = result; });

function initGame() { canvas = document.getElementById("gameCanvas"); ctx = canvas.getContext("2d");

ball.x = 400; ball.y = 200; ball.vx = 0; ball.vy = 0;

canvas.removeEventListener("mousedown", handleMouseDown); canvas.removeEventListener("mouseup", handleMouseUp);

if (isMyTurn) { canvas.addEventListener("mousedown", handleMouseDown); canvas.addEventListener("mouseup", handleMouseUp); }

requestAnimationFrame(updateGame); }

function handleMouseDown(e) { isDragging = true; dragStart = getMousePos(e); }

function handleMouseUp(e) { if (!isDragging) return; isDragging = false; const dragEnd = getMousePos(e); const dx = dragStart.x - dragEnd.x; const dy = dragStart.y - dragEnd.y;

ball.vx = dx * 0.1; ball.vy = dy * 0.1;

socket.emit("shot", { roomId, data: { x: ball.x, y: ball.y, vx: ball.vx, vy: ball.vy } }); isMyTurn = false; document.getElementById("status").innerText = "Opponent's turn";

canvas.removeEventListener("mousedown", handleMouseDown); canvas.removeEventListener("mouseup", handleMouseUp); }

function getMousePos(e) { const rect = canvas.getBoundingClientRect(); return { x: e.clientX - rect.left, y: e.clientY - rect.top }; }

function updateGame() { ball.x += ball.vx; ball.y += ball.vy;

ball.vx *= 0.98; ball.vy *= 0.98;

if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) { ball.vx = -ball.vx; ball.x = Math.max(ball.radius, Math.min(canvas.width - ball.radius, ball.x)); } if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) { ball.vy = -ball.vy; ball.y = Math.max(ball.radius, Math.min(canvas.height - ball.radius, ball.y)); }

draw(); requestAnimationFrame(updateGame); }

function draw() { ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = "white"; ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2); ctx.fill(); }

function applyOpponentShot(data) { ball.x = data.x; ball.y = data.y; ball.vx = data.vx; ball.vy = data.vy; }

