
/* ==========================================
   BUBU & DUDU — INTERACTION ENGINE
========================================== */

/* 01. PASSWORD CONFIGURATION */

const SECRET_PASSWORD = "load";

const lockScreen = document.getElementById("lockScreen");
const website = document.getElementById("website");
const passcode = document.getElementById("passcode");
const errorMessage = document.getElementById("error");

function unlockWebsite() {

  const entered = passcode.value.trim().toLowerCase();

  if (entered === SECRET_PASSWORD.toLowerCase()) {

    errorMessage.textContent = "";

    lockScreen.classList.add("hide");

    setTimeout(() => {
      lockScreen.style.display = "none";
      website.classList.remove("hidden");

      startBackgroundEffects();
      launchConfetti(100);
      playSound("unlock");

    }, 800);

  } else {

    errorMessage.textContent =
      "Wrong secret code! Try again, Bubu. 💗";

    passcode.classList.add("shake");

    setTimeout(() => {
      passcode.classList.remove("shake");
    }, 500);

    passcode.value = "";
    passcode.focus();
  }
}

document.getElementById("unlockButton")
  .addEventListener("click", unlockWebsite);

passcode.addEventListener("keydown", event => {
  if (event.key === "Enter") unlockWebsite();
});


/* SHOW / HIDE PASSWORD */

document.getElementById("togglePassword")
  .addEventListener("click", () => {

    passcode.type =
      passcode.type === "password" ? "text" : "password";

  });


/* 02. COUNTDOWN SYSTEM */

function updateCountdown() {

  const now = new Date();

  // November is month 10 in JavaScript.
  let birthday = new Date(2026, 10, 9, 0, 0, 0);

  if (now > new Date(2026, 10, 9, 23, 59, 59)) {
    birthday = new Date(2027, 10, 9, 0, 0, 0);
  }

  const difference = Math.max(0, birthday - now);

  const days = Math.floor(difference / 86400000);
  const hours = Math.floor(difference / 3600000) % 24;
  const minutes = Math.floor(difference / 60000) % 60;
  const seconds = Math.floor(difference / 1000) % 60;

  document.getElementById("days").textContent =
    String(days).padStart(2, "0");

  document.getElementById("hours").textContent =
    String(hours).padStart(2, "0");

  document.getElementById("minutes").textContent =
    String(minutes).padStart(2, "0");

  document.getElementById("seconds").textContent =
    String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);


/* 03. CONFETTI ENGINE */

function launchConfetti(amount = 100) {

  const colors = [
    "#ff70ad",
    "#ffc4dc",
    "#a77aff",
    "#ffe2a3",
    "#ffffff",
    "#e99cff"
  ];

  for (let i = 0; i < amount; i++) {

    const piece = document.createElement("div");

    piece.className = "confetti";

    piece.style.left = Math.random() * 100 + "vw";

    piece.style.width =
      5 + Math.random() * 9 + "px";

    piece.style.height =
      8 + Math.random() * 12 + "px";

    piece.style.background =
      colors[Math.floor(Math.random() * colors.length)];

    piece.style.borderRadius =
      Math.random() > .5 ? "50%" : "2px";

    const duration = 2.5 + Math.random() * 4;

    piece.style.animationDuration = duration + "s";

    document.body.appendChild(piece);

    setTimeout(() => piece.remove(), duration * 1000);
  }
}


/* 04. FLOATING HEARTS */

function createHeart() {

  const heart = document.createElement("div");

  heart.className = "floating-heart";

  const symbols = [
    "❤️", "💗", "💕", "💖",
    "🌸", "✨", "💘", "🦋"
  ];

  heart.textContent =
    symbols[Math.floor(Math.random() * symbols.length)];

  heart.style.left = Math.random() * 100 + "vw";

  heart.style.fontSize =
    15 + Math.random() * 22 + "px";

  const duration = 5 + Math.random() * 5;

  heart.style.animationDuration = duration + "s";

  document.body.appendChild(heart);

  setTimeout(() => heart.remove(), duration * 1000);
}

let heartInterval;

function startBackgroundEffects() {

  if (heartInterval) return;

  heartInterval = setInterval(createHeart, 650);
}


/* 05. CANDLE BLOWING */

let candlesBlown = false;

document.getElementById("blowButton")
  .addEventListener("click", () => {

    if (candlesBlown) {

      document.getElementById("cakeStatus").textContent =
        "All your wishes are floating in the universe. ❤️";

      return;
    }

    candlesBlown = true;

    const flames = document.querySelectorAll(".flame");

    flames.forEach((flame, index) => {

      setTimeout(() => {

        flame.classList.add("out");

        // Small smoke effect
        createSmoke(flame);

      }, index * 300);

    });

    document.getElementById("cakeStatus").textContent =
      "Happy Birthday, Bubu! Your wish is on its way! ✨";

    launchConfetti(120);
    playSound("celebration");

  });


/* SMOKE PARTICLES */

function createSmoke(element) {

  const rect = element.getBoundingClientRect();

  for (let i = 0; i < 5; i++) {

    const smoke = document.createElement("div");

    smoke.style.position = "fixed";
    smoke.style.left = rect.left + rect.width / 2 + "px";
    smoke.style.top = rect.top + "px";
    smoke.style.width = "7px";
    smoke.style.height = "7px";
    smoke.style.borderRadius = "50%";
    smoke.style.background = "#ffffff";
    smoke.style.opacity = ".6";
    smoke.style.filter = "blur(3px)";
    smoke.style.pointerEvents = "none";
    smoke.style.zIndex = "600";

    document.body.appendChild(smoke);

    const animation = smoke.animate([
      {
        transform: "translate(0,0) scale(1)",
        opacity: .6
      },
      {
        transform:
          `translate(${Math.random()*30-15}px,-65px) scale(4)`,
        opacity: 0
      }
    ], {
      duration: 1300,
      easing: "ease-out"
    });

    animation.onfinish = () => smoke.remove();
  }
}


/* 06. GIFT OPENING */

const giftBox = document.getElementById("giftBox");
const giftButton = document.getElementById("giftButton");

let giftOpened = false;

giftButton.addEventListener("click", () => {

  if (giftOpened) return;

  giftOpened = true;

  giftBox.classList.add("open");

  giftButton.textContent = "Your Surprise Is Open! 💗";

  document.getElementById("giftResult").innerHTML =
    "🎁 Your biggest gift is a thousand hugs from Dudu!<br>" +
    "<span style='font-size:25px'>I LOVE YOU, BUBU ❤️</span>";

  launchConfetti(150);
  playSound("celebration");

});


/* 07. LOVE LETTER */

const letterEnvelope =
  document.getElementById("letterEnvelope");

const letterButton =
  document.getElementById("letterButton");

let letterOpened = false;

letterButton.addEventListener("click", () => {

  letterOpened = !letterOpened;

  letterEnvelope.classList.toggle("open", letterOpened);

  letterButton.textContent =
    letterOpened ? "Close My Letter 💌" : "Read My Letter 💌";

  if (letterOpened) {
    playSound("unlock");
  }

});


/* 08. CINEMATIC SURPRISE BUTTON */

document.getElementById("startSurprise")
  .addEventListener("click", () => {

    document.getElementById("birthday")
      .scrollIntoView({ behavior: "smooth" });

    launchConfetti(80);

  });


/* 09. FINAL CELEBRATION */

document.getElementById("finalCelebrate")
  .addEventListener("click", () => {

    launchConfetti(220);

    for (let i = 0; i < 15; i++) {
      setTimeout(createHeart, i * 120);
    }

    playSound("celebration");

  });


/* 10. ORIGINAL BACKGROUND MUSIC
   Browser-generated notes.
   No external music file required.
*/

let audioContext = null;
let musicEnabled = false;
let musicTimer = null;

const melody = [
  392, 392, 440, 392, 523, 494,
  392, 392, 440, 392, 587, 523,
  392, 392, 784, 659, 523, 494, 440,
  698, 698, 659, 523, 587, 523
];

let noteIndex = 0;

function getAudioContext() {

  if (!audioContext) {

    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return null;

    audioContext = new AudioContextClass();
  }

  return audioContext;
}

function playTone(frequency, duration = .35) {

  const audio = getAudioContext();

  if (!audio) return;

  if (audio.state === "suspended") {
    audio.resume();
  }

  const oscillator = audio.createOscillator();
  const volume = audio.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;

  volume.gain.setValueAtTime(.0001, audio.currentTime);

  volume.gain.exponentialRampToValueAtTime(
    .045, audio.currentTime + .04
  );

  volume.gain.exponentialRampToValueAtTime(
    .0001, audio.currentTime + duration
  );

  oscillator.connect(volume);
  volume.connect(audio.destination);

  oscillator.start();
  oscillator.stop(audio.currentTime + duration + .05);
}

function startMusic() {

  if (musicEnabled) return;

  musicEnabled = true;

  const button = document.getElementById("musicButton");

  button.innerHTML = "♫ <span>Music ON</span>";

  function nextNote() {

    if (!musicEnabled) return;

    playTone(melody[noteIndex % melody.length], .35);

    noteIndex++;

    musicTimer = setTimeout(nextNote, 430);
  }

  nextNote();
}

function stopMusic() {

  musicEnabled = false;

  clearTimeout(musicTimer);

  document.getElementById("musicButton").innerHTML =
    "♫ <span>Music OFF</span>";
}

document.getElementById("musicButton")
  .addEventListener("click", () => {

    if (musicEnabled) {
      stopMusic();
    } else {
      startMusic();
    }

  });

function playSound(type) {

  const notes = type === "celebration"
    ? [523, 659, 784, 1047]
    : [523, 659, 784];

  notes.forEach((note, index) => {

    setTimeout(() => playTone(note, .3), index * 130);

  });
}


/* 11. ANIMATED STAR CANVAS */

const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

let stars = [];

function resizeStars() {

  const ratio = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;

  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  stars = [];

  const count = Math.min(
    150,
    Math.floor(window.innerWidth / 7)
  );

  for (let i = 0; i < count; i++) {

    stars.push({

      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,

      radius: Math.random() * 1.7 + .3,

      opacity: Math.random(),

      speed: Math.random() * .015 + .003

    });

  }

}

function animateStars() {

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  stars.forEach(star => {

    star.opacity += star.speed;

    if (star.opacity > 1 || star.opacity < .15) {
      star.speed *= -1;
    }

    ctx.beginPath();

    ctx.arc(
      star.x,
      star.y,
      star.radius,
      0,
      Math.PI * 2
    );

    ctx.fillStyle =
      `rgba(255,220,242,${star.opacity})`;

    ctx.shadowBlur = 12;
    ctx.shadowColor = "#ff9dc9";

    ctx.fill();

  });

  ctx.shadowBlur = 0;

  requestAnimationFrame(animateStars);
}

window.addEventListener("resize", resizeStars);

resizeStars();
animateStars();


/* 12. BUTTON INTERACTION EFFECT */

document.querySelectorAll(".glow-button").forEach(button => {

  button.addEventListener("pointerdown", event => {

    const rect = button.getBoundingClientRect();

    button.style.setProperty(
      "--click-x",
      (event.clientX - rect.left) + "px"
    );

    button.style.setProperty(
      "--click-y",
      (event.clientY - rect.top) + "px"
    );

  });

});


/* 13. CONSOLE MESSAGE */

console.log(
  "%c Made with love for Bubu ❤️ ",
  "background:#ff70ad;color:white;padding:12px;font-size:18px;border-radius:10px;"
);

