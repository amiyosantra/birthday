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

  // ---------- MUSIC (generated, no file needed) ----------
  const musicBtn = $("musicBtn");
  let ac = null, mTimer = null, playing = false, step = 0;
  const chords = [[261.6, 329.6, 392], [220, 261.6, 329.6], [174.6, 220, 261.6], [196, 246.9, 293.7]];
  const tune = [0, 1, 2, 1, 0, 1, 2, 1];
  function tone(f, t, d, vol, type) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + d + 0.05);
  }
  function tick() {
    const c = chords[Math.floor(step / 8) % chords.length], t = ac.currentTime;
    tone(c[tune[step % 8]] * 2, t, 0.9, 0.05, "sine");
    if (step % 8 === 0) { tone(c[0] / 2, t, 3.2, 0.05, "triangle"); }
    step++;
  }
  async function music(on) {
    if (!musicBtn) return;
    try {
      if (on) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) { musicBtn.textContent = "Music unavailable"; return; }
        ac = ac || new AC(); await ac.resume();
        if (!playing) { playing = true; tick(); mTimer = setInterval(tick, 450); }
        musicBtn.textContent = "♫ Music on";
      } else {
        playing = false; clearInterval(mTimer); musicBtn.textContent = "♫ Music off";
      }
    } catch (e) { console.warn("Audio failed:", e); }
  }
  if (musicBtn) musicBtn.addEventListener("click", () => music(!playing));
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
      err.textContent = "Not quite. Try again, Bubu.";
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
      msg.textContent = "It's your day, Bubu. Happy Birthday! 🎉"; return;
    }
    const t = Math.floor(diff / 1000);
    $("d").textContent = two(Math.floor(t / 86400));
    $("h").textContent = two(Math.floor(t % 86400 / 3600));
    $("m").textContent = two(Math.floor(t % 3600 / 60));
    $("s").textContent = two(t % 60);
    msg.textContent = "Every second brings me closer to wishing you in person (in spirit).";
  }

  // ---------- CAKE ----------
  const candles = Array.from(document.querySelectorAll(".candle"));
  const wish = $("wish");
  function checkCandles() {
    if (candles.every((c) => c.classList.contains("out"))) {
      wish.textContent = "Wish made. May every one of them come true, Bubu. ✨";
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
      paper.querySelectorAll("p").forEach((p) => { p.style.animation = "none"; void p.offsetWidth; p.style.animation = ""; });
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
