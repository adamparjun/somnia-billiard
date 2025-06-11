let canvas, ctx;
let ball = {
  x: 400,
  y: 200,
  radius: 10,
  vx: 0,
  vy: 0
};

let isDragging = false;
let dragStart = null;

function initGame() {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  ball.x = 400;
  ball.y = 200;
  ball.vx = 0;
  ball.vy = 0;

  canvas.addEventListener("mousedown", (e) => {
    isDragging = true;
    dragStart = getMousePos(e);
  });

  canvas.addEventListener("mouseup", (e) => {
    if (!isDragging) return;
    isDragging = false;
    const dragEnd = getMousePos(e);
    const dx = dragStart.x - dragEnd.x;
    const dy = dragStart.y - dragEnd.y;

    ball.vx = dx * 0.1;
    ball.vy = dy * 0.1;
  });

  requestAnimationFrame(updateGame);
}

function getMousePos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

function updateGame() {
  // Update position
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Friction
  ball.vx *= 0.98;
  ball.vy *= 0.98;

  // Collision with walls
  if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
    ball.vx = -ball.vx;
    ball.x = Math.max(ball.radius, Math.min(canvas.width - ball.radius, ball.x));
  }
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.vy = -ball.vy;
    ball.y = Math.max(ball.radius, Math.min(canvas.height - ball.radius, ball.y));
  }

  draw();
  requestAnimationFrame(updateGame);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw cue ball
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
}
