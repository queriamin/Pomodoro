// app.js
let duration = 25 * 60; // 25분
let timeLeft = duration;
let interval = null;

const timeDisplay = document.getElementById("time");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const progressCircle = document.querySelector(".progress");

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const offset = 283 - (283 * (timeLeft / duration));
  progressCircle.style.strokeDashoffset = offset;

  drawTicks();
}

function startTimer() {
  if (interval) return;
  interval = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(interval);
      interval = null;
    } else {
      timeLeft--;
      updateDisplay();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(interval);
  interval = null;
  timeLeft = duration;
  updateDisplay();
}

startBtn.addEventListener("click", startTimer);
resetBtn.addEventListener("click", resetTimer);

updateDisplay();const circleElement = document.querySelector(".circle");
let isDragging = false;

// 중심 좌표를 기준으로 각도 구하는 함수
function getAngleFromMouse(e) {
  const rect = circleElement.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const dx = e.clientX - centerX;
  const dy = e.clientY - centerY;

  let angle = Math.atan2(dy, dx); // -π ~ π
  angle = angle * (180 / Math.PI); // 라디안 → 도
  angle = (angle + 90 + 360) % 360; // 0도 기준 위쪽, 시계방향

  return angle;
}

function handleDialDrag(e) {
  if (!isDragging) return;
  const angle = getAngleFromMouse(e);
  const minutes = Math.round(angle / 6); // 360도 → 60분
  duration = minutes * 60;
  timeLeft = duration;
  updateDisplay();
}

// 마우스 이벤트 연결
circleElement.addEventListener("mousedown", (e) => {
  isDragging = true;
  handleDialDrag(e);
});

document.addEventListener("mousemove", handleDialDrag);
document.addEventListener("mouseup", () => {
  isDragging = false;
});


function drawTicks() {
    const svg = document.querySelector("svg");
    // 기존에 그려진 게 있다면 삭제
    const old = document.querySelectorAll(".tick");
    old.forEach(el => el.remove());
  
    for (let i = 0; i < 60; i++) {
      const angle = (i * 6) * Math.PI / 180;
      // const angle = (i * 6) * Math.PI / 180;
      // const angle = (i * 6 - 90) * Math.PI / 180;
      const radius = 45;
      const length = 6;
  
      const x1 = 50 + (radius - length) * Math.cos(angle);
      const y1 = 50 + (radius - length) * Math.sin(angle);
      const x2 = 50 + radius * Math.cos(angle);
      const y2 = 50 + radius * Math.sin(angle);
  
      const tick = document.createElementNS("http://www.w3.org/2000/svg", "line");
      tick.setAttribute("x1", x1);
      tick.setAttribute("y1", y1);
      tick.setAttribute("x2", x2);
      tick.setAttribute("y2", y2);
      tick.setAttribute("stroke", i < timeLeft / 60 ? "red" : "white");
      tick.setAttribute("stroke-width", "2");
      tick.setAttribute("class", "tick");
  
      svg.appendChild(tick);
    }
  }
  