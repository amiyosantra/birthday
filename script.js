"use strict";

/* =====================================
   CONFIGURATION
===================================== */

const CONFIG = {
  password: "load",
  birthdayMonth: 10, // November (JavaScript months start at 0)
  birthdayDay: 9,
  birthdayYear: 2026
};

/* =====================================
   ELEMENTS
===================================== */

const $ = (id) => document.getElementById(id);

const lockScreen = $("lockScreen");
const website = $("website");
const passwordForm = $("passwordForm");
const passwordInput = $("passwordInput");
const passwordError = $("passwordError");

/* =====================================
   PASSWORD
===================================== */

passwordForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const enteredPassword = passwordInput.value.trim().toLowerCase();

  if (enteredPassword !== CONFIG.password) {
    passwordError.textContent = "Incorrect password. Try again, Bubu ❤️";
    passwordInput.value = "";
    passwordInput.focus();
    return;
  }

  passwordError.textContent = "";
  lockScreen.classList.add("hidden");
  website.classList.remove("hidden");

  updateCountdown();
  setInterval(updateCountdown, 1000);

  startHearts();
  launchConfetti();

  // Music begins only after the user interacts with the page.
  await toggleMusic(true);

  setTimeout(() => {
    $("birthday").scrollIntoView({ behavior: "smooth", block: "start" });
  }, 300);
});

/* =====================================
   COUNTDOWN
===================================== */

function getNextBirthday() {
  const now = new Date();

  let year = CONFIG.birthdayYear;

  let birthday = new Date(
    year,
    CONFIG.birthdayMonth,
    CONFIG.birthdayDay,
    0, 0, 0
  );

  const birthdayEnd = new Date(
    year,
    CONFIG.birthdayMonth,
    CONFIG.birthdayDay,
    23, 59, 59
  );

  // Keep the countdown at zero throughout the birthday itself.
  if (now > birthdayEnd) {
    year = now.getFullYear();

    birthday = new Date(
      year,
      CONFIG.birthdayMonth,
      CONFIG.birthdayDay,
      0, 0, 0
    );

    if (now > new Date(
      year,
      CONFIG.birthdayMonth,
      CONFIG.birthdayDay,
      23, 59, 59
    )) {
      birthday = new Date(
        year + 1,
        CONFIG.birthdayMonth,
        CONFIG.birthdayDay,
        0, 0, 0
      );
    }
  }

  return birthday;
}

function updateCountdown() {
  const now = new Date();
  const birthday = getNextBirthday();

  const isBirthday =
    now.getFullYear() === birthday.getFullYear() &&
    now.getMonth() === birthday.getMonth() &&
    now.getDate() === birthday.getDate();

  if (isBirthday) {
    $("days").textContent = "00";
    $("hours").textContent = "00";
    $("minutes").textContent = "00";
    $("seconds").textContent = "00";
    $("countdownMessage").textContent =
      "IT'S YOUR BIRTHDAY, BUBU! HAPPY BIRTHDAY! 🎉❤️";
    return;
  }

  const difference = Math.max(0, birthday.getTime() - now.getTime());
  const totalSeconds = Math.floor(difference / 1000);

  $("days").textContent =
    String(Math.floor(totalSeconds / 86400)).padStart(2, "0");

  $("hours").textContent =
    String(Math.floor((totalSeconds % 86400) / 3600)).padStart(2, "0");

  $("minutes").textContent =
    String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");

  $("seconds").textContent =
    String(totalSeconds % 60).padStart(2, "0");

  $("countdownMessage").textContent =
    "Counting every moment until your special day ❤️";
}

/* =====================================
   BACKGROUND MUSIC
===================================== */

let audioContext = null;
let musicEnabled = false;
let musicTimer = null;
let musicIndex = 0;

const melody = [
  392, 440, 494, 440,
  392, 330, 349, 392,
  440, 494, 523, 494,
  440, 392, 349, 330
];

function createAudioContext() {
  if (!audioContext) {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      return false;
    }

    audioContext = new AudioContextClass();
  }

  return true;
}

function playTone(frequency, duration, volume = 0.025, type = "sine") {
  if (!audioContext || !musicEnabled) return;

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = type;
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

function playMusicStep() {
  if (!musicEnabled || !audioContext) return;

  const note = melody[musicIndex % melody.length];

  playTone(note, 0.55, 0.025, "sine");
  playTone(note / 2, 0.65, 0.012, "triangle");

  musicIndex++;
}

async function toggleMusic(forceOn = false) {
  const button = $("musicButton");

  if (musicEnabled && !forceOn) {
    musicEnabled = false;
    clearInterval(musicTimer);
    musicTimer = null;
    button.textContent = "♫ Music: Off";
    return;
  }

  if (musicEnabled) return;

  try {
    if (!createAudioContext()) {
      button.textContent = "Music unavailable";
      return;
    }

    await audioContext.resume();

    musicEnabled = true;
    button.textContent = "♫ Music: On";

    playMusicStep();
    musicTimer = setInterval(playMusicStep, 650);

  } catch (error) {
    console.error("Audio could not start:", error);
    button.textContent = "♫ Music: Off";
  }
}

$("musicButton").addEventListener("click", () => {
  toggleMusic();
});

/* =====================================
   LETTER OPENING AND CLOSING
===================================== */

const letterArea = $("letterArea");
const letterPaper = $("letterPaper");
const openLetterButton = $("openLetter");
const closeLetterButton = $("closeLetter");
const openLetterLabel = $("openLetterLabel");

let letterOpen = false;
let letterBusy = false;

function openBirthdayLetter() {
  if (letterOpen || letterBusy) return;

  letterBusy = true;
  letterOpen = true;

  letterArea.classList.add("open");
  openLetterButton.setAttribute("aria-expanded", "true");
  openLetterLabel.textContent = "Your letter is open ❤️";

  // First open the envelope flap.
  setTimeout(() => {
    letterPaper.classList.add("show");
    letterPaper.setAttribute("aria-hidden", "false");

    letterBusy = false;

    // Bring the complete letter into view.
    setTimeout(() => {
      letterPaper.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }, 250);

  }, 500);
}

function closeBirthdayLetter() {
  if (!letterOpen || letterBusy) return;

  letterBusy = true;

  letterPaper.classList.add("closing");

  setTimeout(() => {
    letterPaper.classList.remove("show", "closing");
    letterPaper.setAttribute("aria-hidden", "true");

    letterArea.classList.remove("open");

    openLetterButton.setAttribute("aria-expanded", "false");
    openLetterLabel.textContent = "Open Your Letter 💌";

    letterOpen = false;
    letterBusy = false;

    openLetterButton.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  }, 300);
}

openLetterButton.addEventListener("click", openBirthdayLetter);
closeLetterButton.addEventListener("click", closeBirthdayLetter);

/* =====================================
   BLOW OUT CANDLES
===================================== */

$("blowButton").addEventListener("click", () => {
  const candles = $("candles");
  const wishText = $("wishText");

  if (candles.classList.contains("blown")) {
    wishText.textContent = "Your beautiful wish is on its way! ❤️";
    return;
  }

  candles.classList.add("blown");

  wishText.textContent =
    "May every beautiful wish of yours come true, Bubu! ✨";

  launchConfetti();
  playCelebrationSound();
});

/* =====================================
   CELEBRATION SOUND
===================================== */

function playCelebrationSound() {
  try {
    if (!createAudioContext()) return;

    audioContext.resume();

    const notes = [523, 659, 784, 1046];

    notes.forEach((frequency, index) => {
      setTimeout(() => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = "triangle";
        oscillator.frequency.value = frequency;

        gain.gain.setValueAtTime(0.06, audioContext.currentTime);
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

  } catch (error) {
    console.error("Celebration sound unavailable:", error);
  }
}

/* =====================================
   CONFETTI
===================================== */

function launchConfetti() {
  const container = $("effects");

  const colors = [
    "#ff8eae",
    "#ffd166",
    "#c8a2e8",
    "#ffffff",
    "#ffb8d0"
  ];

  for (let i = 0; i < 90; i++) {
    const piece = document.createElement("span");

    piece.className = "confetti";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.background =
      colors[Math.floor(Math.random() * colors.length)];

    piece.style.animationDuration =
      (2.5 + Math.random() * 3) + "s";

    piece.style.animationDelay =
      Math.random() * 0.8 + "s";

    container.appendChild(piece);

    setTimeout(() => piece.remove(), 6500);
  }
}

/* =====================================
   FLOATING HEARTS
===================================== */

let heartTimer = null;

function createHeart() {
  const container = $("effects");
  const heart = document.createElement("span");

  heart.className = "effect-heart";

  const symbols = ["♥", "♡", "💕", "💗", "✨"];
  heart.textContent =
    symbols[Math.floor(Math.random() * symbols.length)];

  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = (16 + Math.random() * 20) + "px";
  heart.style.color = "#ffabc6";

  container.appendChild(heart);

  setTimeout(() => heart.remove(), 5100);
}

function startHearts() {
  if (heartTimer) return;

  heartTimer = setInterval(createHeart, 1000);
}

/* =====================================
   STAR BACKGROUND
===================================== */

const canvas = $("stars");
const context = canvas.getContext("2d");

let stars = [];
let canvasWidth = 0;
let canvasHeight = 0;

function resizeStars() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);

  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;

  canvas.width = Math.round(canvasWidth * ratio);
  canvas.height = Math.round(canvasHeight * ratio);

  context.setTransform(ratio, 0, 0, ratio, 0, 0);

  stars = Array.from({ length: 100 }, () => ({
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    radius: Math.random() * 1.5 + 0.3,
    opacity: Math.random() * 0.8 + 0.2,
    speed: Math.random() * 0.008 + 0.002
  }));
}

function animateStars() {
  context.clearRect(0, 0, canvasWidth, canvasHeight);

  for (const star of stars) {
    star.opacity += star.speed;

    if (star.opacity >= 1 || star.opacity <= 0.15) {
      star.speed *= -1;
    }

    context.beginPath();
    context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    context.fillStyle = `rgba(255,255,255,${star.opacity})`;
    context.fill();
  }

  requestAnimationFrame(animateStars);
}

window.addEventListener("resize", resizeStars);

resizeStars();
animateStars();

/* =====================================
   FINAL CELEBRATION
===================================== */

$("celebrateButton").addEventListener("click", () => {
  launchConfetti();
  playCelebrationSound();

  for (let i = 0; i < 15; i++) {
    setTimeout(createHeart, i * 120);
  }
});
