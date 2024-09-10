let timerDisplay = document.getElementById('timer');
let totalTime = 0; // in seconds
let countdown;
let isPaused = false;

function formatTime(seconds) {
  let minutes = Math.floor(seconds / 60);
  let secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateDisplay() {
  timerDisplay.textContent = formatTime(totalTime);
}

function startTimer() {
  if (countdown || totalTime <= 0) return;
  countdown = setInterval(() => {
    if (!isPaused && totalTime > 0) {
      totalTime--;
      updateDisplay();
    }
    if (totalTime <= 0) {
      clearInterval(countdown);
      countdown = null;
    }
  }, 1000);
}

function resumeTimer() {
  isPaused = false;
  startTimer();
}

function pauseTimer() {
  isPaused = true;
}

function resetTimer() {
  clearInterval(countdown);
  countdown = null;
  totalTime = 0;
  updateDisplay();
}

function addMinute() {
  totalTime += 60;
  updateDisplay();
}

function subtractMinute() {
  if (totalTime >= 60) totalTime -= 60;
  else totalTime = 0;
  updateDisplay();
}

function addSecond() {
  totalTime += 1;
  updateDisplay();
}

function subtractSecond() {
  if (totalTime >= 1) totalTime -= 1;
  else totalTime = 0;
  updateDisplay();
}
