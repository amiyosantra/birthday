"use strict";

/* =====================================
   BUBU & DUDU — BIRTHDAY WEBSITE
===================================== */

document.addEventListener("DOMContentLoaded", () => {
  const CONFIG = {
    password: "load",
    birthday: new Date(2026, 10, 9, 0, 0, 0)
  };

  /* PASSWORD UNLOCK */

  const lockScreen = document.getElementById("lockScreen");
  const website = document.getElementById("website");
  const passwordForm = document.getElementById("passwordForm");
  const passwordInput = document.getElementById("passwordInput");
  const passwordError = document.getElementById("passwordError");

  if (!lockScreen || !website || !passwordForm || !passwordInput) {
    console.error("Password screen elements are missing. Check index.html IDs.");
    return;
  }

  passwordForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const enteredPassword = passwordInput.value.trim().toLowerCase();

    if (enteredPassword === CONFIG.password) {
      passwordError.textContent = "";
      lockScreen.classList.add("hidden");
      website.classList.remove("hidden");

      document.body.classList.add("unlocked");
      startCountdown();
    } else {
      passwordError.textContent = "Oops! That's not the secret word. Try again, Bubu 💗";
      passwordInput.value = "";
      passwordInput.focus();
    }
  });

  /* COUNTDOWN */

  const daysElement = document.getElementById("days");
  const hoursElement = document.getElementById("hours");
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");
  const countdownMessage = document.getElementById("countdownMessage");

  function startCountdown() {
    function updateCountdown() {
      const now = new Date();
      const difference = CONFIG.birthday.getTime() - now.getTime();

      if (difference <= 0) {
        daysElement.textContent = "00";
        hoursElement.textContent = "00";
        minutesElement.textContent = "00";
        secondsElement.textContent = "00";
        countdownMessage.textContent = "IT'S YOUR BIRTHDAY, BUBU! HAPPY BIRTHDAY! 🎂💗";
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      daysElement.textContent = String(days).padStart(2, "0");
      hoursElement.textContent = String(hours).padStart(2, "0");
      minutesElement.textContent = String(minutes).padStart(2, "0");
      secondsElement.textContent = String(seconds).padStart(2, "0");

      countdownMessage.textContent = "Every second brings us closer to your special day. ♡";
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  /* BIRTHDAY CAKE */

  const cake = document.getElementById("cake");
  const blowButton = document.getElementById("blowButton");
  const wishMessage = document.getElementById("wishMessage");

  if (cake && blowButton && wishMessage) {
    blowButton.addEventListener("click", () => {
      cake.classList.add("blown");
      blowButton.textContent = "Wish made! 💗";
      blowButton.disabled = true;
      blowButton.style.opacity = "0.75";

      wishMessage.textContent =
        "May all your beautiful wishes come true, my Bubu! ✨💗";

      createConfetti();
    });
  }

  /* OPEN AND CLOSE LETTER */

  const envelope = document.getElementById("envelope");
  const openLetterButton = document.getElementById("openLetterButton");
  const letterHint = document.getElementById("letterHint");

  if (envelope && openLetterButton && letterHint) {
    openLetterButton.addEventListener("click", () => {
      const isOpening = !envelope.classList.contains("open");

      envelope.classList.toggle("open", isOpening);

      if (isOpening) {
        openLetterButton.textContent = "Close my letter ♡";
        letterHint.textContent = "A little piece of my heart, written just for you.";
        createConfetti();
      } else {
        openLetterButton.textContent = "Open my letter 💌";
        letterHint.textContent = "Tap to open it. Take your time reading. ♡";
      }
    });
  }

  /* SIMPLE BACKGROUND MUSIC
     This creates a small original melody with Web Audio.
     Browsers only allow it after a user click.
  */

  const musicButton = document.getElementById("musicButton");

  let audioContext = null;
  let musicTimer = null;
  let musicPlaying = false;
  let noteIndex = 0;

  const melody = [
    523.25, 659.25, 783.99, 659.25,
    587.33, 698.46, 783.99, 698.46,
    523.25, 659.25, 783.99, 880.00,
    783.99, 659.25, 587.33, 523.25
  ];

  function playNote(frequency) {
    if (!audioContext || audioContext.state !== "running") return;

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.045,
      audioContext.currentTime + 0.04
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime + 0.42
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.45);
  }

  async function startMusic() {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      musicButton.textContent = "Music not supported";
      return;
    }

    if (!audioContext) {
      audioContext = new AudioContextClass();
    }

    await audioContext.resume();

    musicPlaying = true;
    musicButton.classList.add("playing");
    musicButton.textContent = "♫ Music playing";

    playNote(melody[noteIndex]);
    noteIndex = (noteIndex + 1) % melody.length;

    musicTimer = setInterval(() => {
      playNote(melody[noteIndex]);
      noteIndex = (noteIndex + 1) % melody.length;
    }, 480);
  }

  function stopMusic() {
    musicPlaying = false;

    if (musicTimer) {
      clearInterval(musicTimer);
      musicTimer = null;
    }

    if (audioContext) {
      audioContext.suspend();
    }

    musicButton.classList.remove("playing");
    musicButton.textContent = "♫ Play our music";
  }

  if (musicButton) {
    musicButton.addEventListener("click", async () => {
      try {
        if (musicPlaying) {
          stopMusic();
        } else {
          await startMusic();
        }
      } catch (error) {
        console.error("Music could not start:", error);
        musicButton.textContent = "Music unavailable";
      }
    });
  }

  /* CONFETTI */

  function createConfetti() {
    const colors = ["#f27ca8", "#c9a4ed", "#ffd166", "#ff9fbd", "#ffffff"];

    for (let i = 0; i < 45; i++) {
      const piece = document.createElement("span");

      piece.className = "confetti-piece";
      piece.style.left = Math.random() * 100 + "vw";
      piece.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = (2 + Math.random() * 2) + "s";
      piece.style.animationDelay = (Math.random() * 0.7) + "s";

      document.body.appendChild(piece);

      setTimeout(() => {
        piece.remove();
      }, 5000);
    }
  }
});
