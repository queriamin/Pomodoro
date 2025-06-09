// app.js
let duration = 25 * 60; // 25분 (1500초)
let timeLeft = duration; // 남은 시간
let interval = null; // 타이머 인터벌
let isStopwatch = false; // 스톱워치 모드 여부

const timeDisplay = document.getElementById("time"); 
const startBtn = document.getElementById("startBtn"); 
const resetBtn = document.getElementById("resetBtn");  
const progressCircle = document.querySelector(".progress");

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60); // 분 단위
  const seconds = timeLeft % 60; // 초 단위
  timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  // ${} 템플릿 리터럴을 사용하여 문자열 포맷팅, string() 숫자를 문자열로 반환, .padStart(2, '0')는 2자리로 맞추고, 부족한 자리는 0으로 채움
  const offset = 283 - (283 * (timeLeft / duration)); // 283은 원의 둘레 (2 * π * r, r=45)
  progressCircle.style.strokeDashoffset = offset; // SVG 원의 진행 상태 업데이트, 선을 얼마나 비워둘지

  drawTicks();
}

function startTimer() {
  if (interval) return; // 이미 타이머가 실행 중이면 중복 실행 방지

  isStopwatch = (duration === 0);  // 00:00이면 스톱워치 모드
  interval = setInterval(() => { // 일정 시간마다 실행되는 람다 함수
    if (isStopwatch) {
      // ⏱️ 스톱워치: 0부터 올라감
      timeLeft++;
      if (timeLeft >= 60 * 60) { // 60분 넘으면 종료
        clearInterval(interval); // 타이머 중지
        interval = null; // 인터벌 초기화
        timeLeft = 0; // 시간 초기화
        updateDisplay(); // 화면 업데이트
        alert("60분 끝!"); // 알림 표시
      }
    } else {
      // ⏳ 타이머: 줄어드는 방식
      if (timeLeft <= 0) {
        clearInterval(interval);
        interval = null;
      } else {
        timeLeft--; // 1초씩 감소
      }
    }

    updateDisplay();
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

updateDisplay();
const circleElement = document.querySelector(".circle"); // .클래스 # 아이디
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

function handleDialDrag(e) { // e는 이벤트 객체, 브라우저가 자동으로 넘겨주는 정보 덩어리
  if (!isDragging) return; // 조기 return, 마우스가 눌리지 않았다면 함수 종료, else if문을 쓰지 않고 바로 return
  const angle = getAngleFromMouse(e);
  const minutes = Math.round(angle / 6); // 360도 → 60분
  duration = minutes * 60;
  timeLeft = duration;
  updateDisplay();
}

// 마우스 이벤트 연결
circleElement.addEventListener("mousedown", (e) => { // 마우스가 눌렸을 때
  isDragging = true; // 드래그 시작
  handleDialDrag(e); // 현재 마우스 위치로 초기화
});
document.addEventListener("mousemove", handleDialDrag); // document는 전체 웹페이지
document.addEventListener("mouseup", () => { // 마우스가 떼어졌을 때
  isDragging = false; // 드래그 종료
});
// 마우스를 움직이는 동안 계속 handleDialDrag 함수가 호출됨, 단 isDragging가 true일 때만 실행됨
// addEventListener는 이벤트 리스너를 추가하는 메서드, 첫 번째 인자는 이벤트 종류, 두 번째 인자는 이벤트가 발생했을 때 실행할 함수 


function drawTicks() {
    const svg = document.querySelector("svg");
    // 기존에 그려진 게 있다면 삭제
    const old = document.querySelectorAll(".tick");
    old.forEach(el => el.remove());
  
    for (let i = 0; i < 60; i++) { // 0부터 59까지 반복, 60
      const angle = (i * 6) * Math.PI / 180;
      // const angle = (i * 6) * Math.PI / 180;
      // const angle = (i * 6 - 90) * Math.PI / 180;
      const radius = 45;
      const length = 10;
  
      const x1 = 50 + (radius - length) * Math.cos(angle);
      const y1 = 50 + (radius - length) * Math.sin(angle);
      const x2 = 50 + radius * Math.cos(angle);
      const y2 = 50 + radius * Math.sin(angle);
  
      const tick = document.createElementNS("http://www.w3.org/2000/svg", "line"); // SVG 요소를 생성하기 위한 네임스페이스
      tick.setAttribute("x1", x1);  
      tick.setAttribute("y1", y1);
      tick.setAttribute("x2", x2);
      tick.setAttribute("y2", y2);
      tick.setAttribute("stroke", i < timeLeft / 60 ? "red" : "white"); // 시간에 따라 색상 변경, i < timeLeft / 60은 현재 분이 남은 시간보다 작으면 빨간색, 아니면 흰색
      tick.setAttribute("stroke-width", "2");
      tick.setAttribute("class", "tick");
  
      svg.appendChild(tick);
    }
  }