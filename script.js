"use strict";
(function () {
  // ---------- SETTINGS ----------
  const PASSWORD = "load";                       // not case-sensitive
  const BIRTHDAY = new Date(2026, 10, 9, 0, 0, 0); // 9 Nov 2026, local time

  const $ = (id) => document.getElementById(id);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  let unlocked = false;

  // ---------- STAR SKY (runs from the start) ----------
  const cv = $("sky"), cx = cv && cv.getContext("2d");
  let stars = [], shoot = [], W = 0, H = 0;
  function sizeSky() {
    if (!cv) return;
    const r = Math.min(window.devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * r; cv.height = H * r;
    cx.setTransform(r, 0, 0, r, 0, 0);
    stars = Array.from({ length: Math.round(W * H / 9000) }, () => ({
      x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.5 + 0.3,
      a: Math.random(), v: (Math.random() * 0.01 + 0.003) * (Math.random() < 0.5 ? -1 : 1)
    }));
  }
  function drawSky() {
    cx.clearRect(0, 0, W, H);
    for (const s of stars) {
      s.a += s.v; if (s.a > 1 || s.a < 0.15) s.v *= -1;
      cx.fillStyle = "rgba(255,240,250," + s.a + ")";
      cx.beginPath(); cx.arc(s.x, s.y, s.r, 0, 6.283); cx.fill();
    }
    if (!reduce && Math.random() < 0.006) shoot.push({ x: Math.random() * W, y: Math.random() * H * 0.4, l: 0 });
    shoot = shoot.filter((s) => s.l < 40);
    for (const s of shoot) {
      s.l++; s.x += 9; s.y += 4;
      const g = cx.createLinearGradient(s.x, s.y, s.x - 80, s.y - 36);
      g.addColorStop(0, "rgba(255,217,138,.9)"); g.addColorStop(1, "rgba(255,217,138,0)");
      cx.strokeStyle = g; cx.lineWidth = 2;
      cx.beginPath(); cx.moveTo(s.x, s.y); cx.lineTo(s.x - 80, s.y - 36); cx.stroke();
    }
    requestAnimationFrame(drawSky);
  }
  if (cv) { sizeSky(); drawSky(); addEventListener("resize", sizeSky); }

  // ---------- EFFECTS ----------
  const fx = $("fx");
  function confetti(n) {
    if (!fx) return;
    const cols = ["#ff8fb1", "#ffd98a", "#d8b4ff", "#ffffff", "#ffb3c9"];
    for (let i = 0; i < (n || 90); i++) {
      const p = document.createElement("span");
      p.className = "conf";
      p.style.cssText = "left:" + Math.random() * 100 + "vw;background:" + pick(cols) +
        ";animation-duration:" + (2.5 + Math.random() * 3) + "s;animation-delay:" + Math.random() * 0.8 + "s";
      fx.appendChild(p); setTimeout(() => p.remove(), 6500);
    }
  }
  function heart() {
    if (!fx) return;
    const h = document.createElement("span");
    h.className = "rise"; h.textContent = pick(["♥", "♡", "✦", "💗", "✨"]);
    h.style.cssText = "left:" + Math.random() * 100 + "vw;font-size:" + (16 + Math.random() * 22) + "px;color:#ffabc6";
    fx.appendChild(h); setTimeout(() => h.remove(), 5200);
  }
  let heartTimer = null;

  // ---------- MUSIC: Happy Birthday tune, generated (no file needed) ----------
  const musicBtn = $("musicBtn");
  let ac = null, master = null, loopTimer = null, playing = false, userStopped = false;
  const BEAT = 0.55; // seconds per beat (lower = faster)
  const N = { G4: 392, A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99 };
  const SONG = [ // [note, beats]
    ["G4", .75], ["G4", .25], ["A4", 1], ["G4", 1], ["C5", 1], ["B4", 2],
    ["G4", .75], ["G4", .25], ["A4", 1], ["G4", 1], ["D5", 1], ["C5", 2],
    ["G4", .75], ["G4", .25], ["G5", 1], ["E5", 1], ["C5", 1], ["B4", 1], ["A4", 1],
    ["F5", .75], ["F5", .25], ["E5", 1], ["C5", 1], ["D5", 1], ["C5", 2]
  ];
  // one waltz bar (3 beats) per chord: [bass, chord note 1, chord note 2]
  const BARS = [
    [130.8, 329.6, 392], [98, 246.9, 293.7], [130.8, 329.6, 392], [98, 246.9, 293.7],
    [130.8, 329.6, 392], [130.8, 329.6, 392], [87.3, 220, 261.6], [130.8, 329.6, 392]
  ];
  function tone(f, t, d, vol, type) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(master || ac.destination);
    o.start(t); o.stop(t + d + 0.05);
  }
  function playSong() {
    if (!playing) return;
    const t0 = ac.currentTime + 0.1;
    let b = 0;
    for (const [n, beats] of SONG) {
      const t = t0 + b * BEAT, d = Math.max(beats * BEAT * 1.1, 0.35);
      tone(N[n], t, d, 0.11, "sine");
      tone(N[n] * 2, t, d * 0.6, 0.015, "triangle"); // soft music-box sparkle
      b += beats;
    }
    BARS.forEach((bar, i) => {
      const t = t0 + i * 3 * BEAT;
      tone(bar[0], t, BEAT * 2, 0.07, "triangle");
      for (let k = 1; k <= 2; k++) { tone(bar[1], t + k * BEAT, BEAT * 0.8, 0.02, "sine"); tone(bar[2], t + k * BEAT, BEAT * 0.8, 0.02, "sine"); }
    });
    loopTimer = setTimeout(playSong, (b * BEAT + 1.6) * 1000); // pause, then repeat
  }
  async function music(on) {
    if (!musicBtn) return;
    try {
      if (on) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) { musicBtn.textContent = "Music unavailable"; return; }
        ac = ac || new AC(); await ac.resume();
        if (ac.state !== "running") return; // browser still blocking; retried on next tap
        if (!playing) {
          playing = true;
          master = ac.createGain(); master.gain.value = 1; master.connect(ac.destination);
          playSong();
        }
        musicBtn.textContent = "♫ Music on";
      } else {
        playing = false; clearTimeout(loopTimer);
        if (master) { master.gain.cancelScheduledValues(0); master.gain.value = 0; master = null; }
        musicBtn.textContent = "♫ Music off";
      }
    } catch (e) { console.warn("Audio failed:", e); }
  }
  if (musicBtn) musicBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    userStopped = playing; // pressing "off" means: stay off
    music(!playing);
  });
  // Music is ON by default after unlocking. If a browser blocked it, the next tap anywhere starts it.
  ["pointerdown", "keydown", "touchstart"].forEach((ev) =>
    document.addEventListener(ev, () => { if (unlocked && !playing && !userStopped) music(true); }, { passive: true }));
  function chime() {
    try {
      if (!ac) return; [523, 659, 784, 1046].forEach((f, i) => tone(f, ac.currentTime + i * 0.14, 0.5, 0.08, "triangle"));
    } catch (e) {}
  }

  // ---------- PASSWORD ----------
  const form = $("lockForm"), pw = $("pw"), err = $("err");
  if (form) form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (pw.value.trim().toLowerCase() !== PASSWORD) {
      err.textContent = "Not quite. Try again, Meow.";
      form.classList.remove("shake"); void form.offsetWidth; form.classList.add("shake");
      pw.value = ""; pw.focus(); return;
    }
    unlocked = true;
    $("lock").classList.add("hide");
    $("site").classList.remove("hide");
    window.scrollTo(0, 0);
    tickClock(); setInterval(tickClock, 1000);
    confetti(120); heartTimer = setInterval(heart, 1100);
    music(true);
  });

  // ---------- COUNTDOWN ----------
  const two = (n) => String(n).padStart(2, "0");
  function tickClock() {
    const diff = BIRTHDAY - new Date();
    const msg = $("cmsg");
    if (diff <= 0) {
      ["d", "h", "m", "s"].forEach((k) => ($(k).textContent = "00"));
      msg.textContent = "It's your day, Dipika Happy Birthday! 🎉"; return;
    }
    const t = Math.floor(diff / 1000);
    $("d").textContent = two(Math.floor(t / 86400));
    $("h").textContent = two(Math.floor(t % 86400 / 3600));
    $("m").textContent = two(Math.floor(t % 3600 / 60));
    $("s").textContent = two(t % 60);
    msg.textContent = "Every second brings me closer to wishing you in person .";
  }

  // ---------- CAKE ----------
  const candles = Array.from(document.querySelectorAll(".candle"));
  const wish = $("wish");
  function checkCandles() {
    if (candles.every((c) => c.classList.contains("out"))) {
      wish.textContent = "Wish made. May every one of them come true, Beralini❤️. ✨";
      confetti(110); chime();
    }
  }
  candles.forEach((c) => c.addEventListener("click", () => { c.classList.add("out"); checkCandles(); }));
  const blow = $("blow");
  if (blow) blow.addEventListener("click", () => {
    candles.forEach((c, i) => setTimeout(() => { c.classList.add("out"); if (i === candles.length - 1) checkCandles(); }, i * 160));
  });

  // ---------- ENVELOPE + LETTER ----------
  const env = $("env"), modal = $("modal"), paper = modal && modal.querySelector(".paper");
  function openLetter() {
    if (!env || !modal.hidden) return;
    env.classList.add("open");
    setTimeout(() => {
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      paper.scrollTop = 0; paper.focus({ preventScroll: true });
      // restart the paragraph fade-in each time it opens
      paper.style.animation = "none"; void paper.offsetWidth; paper.style.animation = "";
      paper.querySelectorAll("p:not(.from)").forEach((p, i) => {
        p.style.animation = "none"; void p.offsetWidth; p.style.animation = "";
        p.style.animationDelay = Math.min(0.6 + i * 0.45, 5) + "s";
      });
    }, 900);
  }
  function closeLetter() {
    modal.hidden = true;
    document.body.style.overflow = "";
    env.classList.remove("open");
    env.focus({ preventScroll: true });
  }
  if (env) env.addEventListener("click", openLetter);
  const closeBtn = $("closeL");
  if (closeBtn) closeBtn.addEventListener("click", closeLetter);
  if (modal) modal.addEventListener("click", (e) => { if (e.target === modal) closeLetter(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && modal && !modal.hidden) closeLetter(); });

  // ---------- FINALE ----------
  const party = $("party");
  if (party) party.addEventListener("click", () => {
    confetti(150); chime();
    for (let i = 0; i < 18; i++) setTimeout(heart, i * 110);
  });
})();
