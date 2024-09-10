let shotClockDisplay = document.getElementById('shotClockTimer');
let totalShotTime = 24; // shot clock starts at 24 seconds
let countdownShotClock;
let isPausedShotClock = false;

function updateShotClockDisplay() {
  shotClockDisplay.textContent = totalShotTime;
}

function startShotClock() {
  if (countdownShotClock || totalShotTime <= 0) return;
  countdownShotClock = setInterval(() => {
    if (!isPausedShotClock && totalShotTime > 0) {
      totalShotTime--;
      updateShotClockDisplay();
    }
    if (isPausedShotClock && totalShotTime > 0) {
        isPausedShotClock = false;
    }
    if (totalShotTime <= 0) {
      clearInterval(countdownShotClock);
      countdownShotClock = null;
      totalShotTime = 0;
      updateShotClockDisplay();
    }
  }, 1000);
}

function pauseShotClock() {
  isPausedShotClock = true;
}

function resetTo24() {
  clearInterval(countdownShotClock);
  countdownShotClock = null;
  totalShotTime = 24;
  updateShotClockDisplay();
}

function resetTo14() {
  clearInterval(countdownShotClock);
  countdownShotClock = null;
  totalShotTime = 14;
  updateShotClockDisplay();
}

function addSecondShotClock() {
    totalShotTime += 1;
    updateShotClockDisplay();
  }
  
  function subtractSecondShotClock() {
    if (totalShotTime > 0) totalShotTime -= 1;
    updateShotClockDisplay();
  }
  
  updateShotClockDisplay();