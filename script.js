// =====================================
// SETTINGS
// =====================================

const PASSWORD = "load";

// =====================================
// PASSWORD UNLOCK
// =====================================

const lockScreen = document.getElementById("lockScreen");
const mainContent = document.getElementById("mainContent");
const passwordForm = document.getElementById("passwordForm");
const passwordInput = document.getElementById("passwordInput");
const errorMessage = document.getElementById("errorMessage");
const musicToggle = document.getElementById("musicToggle");

passwordForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (passwordInput.value.trim().toLowerCase() === PASSWORD) {
    lockScreen.classList.add("hidden");
    mainContent.classList.remove("hidden");
    musicToggle.classList.remove("hidden");

    startMusic();
    launchConfetti();
    startFloatingHearts();
    updateCountdown();
    setInterval(updateCountdown, 1000);
  } else {
    errorMessage.textContent = "Oops! That's not the secret password. ❤️";
    passwordInput.value = "";
    passwordInput.focus();
  }
});

// =====================================
// COUNTDOWN TO NOVEMBER 9
// =====================================

function updateCountdown() {
  const now = new Date();

  // November 9, 2026
  let birthday = new Date(2026, 10, 9, 0, 0, 0);

  // If this year's birthday has passed, use next year.
  if (now > new Date(2026, 10, 9, 23, 59, 59)) {
    birthday = new Date(2027, 10, 9, 0, 0, 0);
  }

  const difference = birthday.getTime() - now.getTime();

  const days = document.getElementById("days");
  const hours = document.getElementById("hours");
  const minutes = document.getElementById("minutes");
  const seconds = document.getElementById("seconds");
  const message = document.getElementById("countdownMessage");

  if (difference <= 0) {
    days.textContent = "00";
    hours.textContent = "00";
    minutes.textContent = "00";
    seconds.textContent = "00";
    message.textContent = "IT'S YOUR BIRTHDAY, BUBU! 🎉❤️";
    return;
  }

  const totalSeconds = Math.floor(difference / 1000);

  days.textContent = String(
    Math.floor(totalSeconds / 86400)
  ).padStart(2, "0");

  hours.textContent = String(
    Math.floor((totalSeconds % 86400) / 3600)
  ).padStart(2, "0");

  minutes.textContent = String(
    Math.floor((totalSeconds % 3600) / 60)
  ).padStart(2, "0");

  seconds.textContent = String(
    totalSeconds % 60
  ).padStart(2, "0");

  message.textContent = "Counting every moment until your special day ❤️";
}

// =====================================
// BACKGROUND MUSIC
// =====================================

let audioContext = null;
let musicPlaying = false;
let musicTimer = null;
let musicStep = 0;

const melody = [
  392, 440, 494, 440,
  392, 330, 349, 392,
  440, 494, 523, 494,
  440, 392, 349, 330
];

function playNote(frequency, duration, volume = 0.045) {
  if (!audioContext || !musicPlaying) return;

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;

  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    volume,
    audioContext.currentTime + 0.04
  );
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    audioContext.currentTime + duration
  );

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration + 0.05);
}

function musicLoop() {
  if (!musicPlaying) return;

  const note = melody[musicStep % melody.length];

  playNote(note, 0.55, 0.035);
  playNote(note / 2, 0.65, 0.018);

  musicStep++;
}

async function startMusic() {
  try {
    if (!audioContext) {
      audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();
    }

    await audioContext.resume();

    if (musicPlaying) return;

    musicPlaying = true;
    musicToggle.textContent = "♫ Music: ON";

    musicLoop();
    musicTimer = setInterval(musicLoop, 650);
  } catch (error) {
    console.log("Music could not start:", error);
  }
}

function stopMusic() {
  musicPlaying = false;

  if (musicTimer) {
    clearInterval(musicTimer);
    musicTimer = null;
  }

  musicToggle.textContent = "♫ Music: OFF";
}

musicToggle.addEventListener("click", async function () {
  if (musicPlaying) {
    stopMusic();
  } else {
    await startMusic();
  }
});

// =====================================
// BIRTHDAY LETTER - OPEN AND CLOSE
// =====================================

const letterButton = document.getElementById("letterButton");
const letterButtonText = document.getElementById("letterButtonText");
const letterArea = document.querySelector(".letter-area");
const letterPaper = document.getElementById("letterPaper");
const closeLetter = document.getElementById("closeLetter");

let letterIsOpen = false;

letterButton.addEventListener("click", function () {
  if (letterIsOpen) return;

  letterIsOpen = true;

  letterArea.classList.add("open");
  letterButton.setAttribute("aria-expanded", "true");
  letterButtonText.textContent = "Your letter is open ❤️";

  // Wait for the envelope flap to open before showing the letter.
  setTimeout(function () {
    letterPaper.classList.add("show");
    letterPaper.setAttribute("aria-hidden", "false");

    setTimeout(function () {
      letterPaper.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 250);

  }, 350);
});

closeLetter.addEventListener("click", function () {
  if (!letterIsOpen) return;

  letterPaper.classList.add("closing");

  setTimeout(function () {
    letterPaper.classList.remove("show", "closing");
    letterPaper.setAttribute("aria-hidden", "true");

    letterArea.classList.remove("open");
    letterButton.setAttribute("aria-expanded", "false");
    letterButtonText.textContent = "Open Your Letter 💌";

    letterIsOpen = false;

    letterButton.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }, 350);
});

// =====================================
// BLOW OUT CANDLES
// =====================================

const blowButton = document.getElementById("blowCandles");
const candles = document.querySelector(".candles");
const wishMessage = document.getElementById("wishMessage");

blowButton.addEventListener("click", function () {
  if (candles.classList.contains("blown")) {
    wishMessage.textContent = "Your wish is already on its way! ❤️";
    return;
  }

  candles.classList.add("blown");

  wishMessage.textContent =
    "May every beautiful wish of yours come true, Bubu! ✨";

  playCelebrationSound();
  launchConfetti();
});

// =====================================
// CELEBRATION SOUND
// =====================================

function playCelebrationSound() {
  if (!audioContext) return;

  const notes = [523, 659, 784, 1046];

  notes.forEach((note, index) => {
    setTimeout(() => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = "triangle";
      oscillator.frequency.value = note;

      gain.gain.setValueAtTime(0.08, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.35
      );

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.4);
    }, index * 140);
  });
}

// =====================================
// CONFETTI
// =====================================

function launchConfetti() {
  const container = document.getElementById("confettiContainer");
  const colors = [
    "#ff8eae",
    "#ffd166",
    "#c8a2e8",
    "#ffffff",
    "#ffb8d0"
  ];

  for (let i = 0; i < 100; i++) {
    const piece = document.createElement("div");

    piece.className = "confetti-piece";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];

    piece.style.animationDuration =
      (2.5 + Math.random() * 3) + "s";

    piece.style.animationDelay =
      Math.random() * 1.5 + "s";

    piece.style.transform =
      `rotate(${Math.random() * 360}deg)`;

    container.appendChild(piece);

    setTimeout(() => piece.remove(), 6500);
  }
}

// =====================================
// FLOATING HEARTS
// =====================================

function createFloatingHeart() {
  const heart = document.createElement("div");

  heart.className = "floating-heart";
  heart.textContent = ["❤️", "💕", "💗", "💖", "✨"][
    Math.floor(Math.random() * 5)
  ];

  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = (15 + Math.random() * 22) + "px";

  document.body.appendChild(heart);

  setTimeout(() => heart.remove(), 5000);
}

let heartInterval = null;

function startFloatingHearts() {
  if (heartInterval) return;

  heartInterval = setInterval(createFloatingHeart, 900);
}

// =====================================
// STAR BACKGROUND
// =====================================

const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

let stars = [];

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;

  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;

  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  stars = [];

  for (let i = 0; i < 100; i++) {
    stars.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 1.7 + 0.3,
      opacity: Math.random(),
      speed: Math.random() * 0.008 + 0.002
    });
  }
}

function animateStars() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  stars.forEach(star => {
    star.opacity += star.speed;

    if (star.opacity > 1 || star.opacity < 0.15) {
      star.speed *= -1;
    }

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);

    ctx.fillStyle = `rgba(255,255,255,${star.opacity})`;
    ctx.fill();
  });

  requestAnimationFrame(animateStars);
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
animateStars();

// =====================================
// FINAL CELEBRATION BUTTON
// =====================================

document.getElementById("celebrateButton")
  .addEventListener("click", function () {
    launchConfetti();
    playCelebrationSound();

    for (let i = 0; i < 12; i++) {
      setTimeout(createFloatingHeart, i * 120);
    }
  });
