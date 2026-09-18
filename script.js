// ============================================================
// AM360 Thank-You Gift Card — script.js
// ============================================================

// ---- demo order data (swap for real values from your backend) ----
var GIFT_VALUE = 2500;
var GIFT_CODE = 'AM-' + Math.random().toString(36).slice(2, 6).toUpperCase()
              + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();

document.getElementById('gcCode').textContent = GIFT_CODE;

// ------------------------------------------------------------
// 1) Intro boot sequence — letters type in, bar fills, then exits
// ------------------------------------------------------------
(function bootIntro() {
  var word = 'ANANMANAN';
  var accentStart = 4; // "MANAN" portion glows neon
  var mark = document.getElementById('introMark');

  word.split('').forEach(function (letter, i) {
    var span = document.createElement('span');
    span.className = 'am-letter' + (i >= accentStart ? ' accent' : '');
    span.textContent = letter;
    span.style.animationDelay = (i * 0.06) + 's';
    mark.appendChild(span);
  });

  var fill = document.getElementById('introFill');
  var pct = document.getElementById('introPct');
  var intro = document.getElementById('intro');

  var duration = 1800; // ms
  var startTime = null;

  function step(ts) {
    if (!startTime) startTime = ts;
    var progress = Math.min((ts - startTime) / duration, 1);
    var pctValue = Math.floor(progress * 100);
    fill.style.width = pctValue + '%';
    pct.textContent = pctValue + '%';
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      setTimeout(exitIntro, 350);
    }
  }

  function exitIntro() {
    intro.classList.add('exit');
    setTimeout(function () {
      intro.style.display = 'none';
      document.body.classList.add('ready');
      startCardSequence();
    }, 800); // matches CSS transition duration on #intro
  }

  setTimeout(function () {
    requestAnimationFrame(step);
  }, 500);
})();

// ------------------------------------------------------------
// 2) Card value count-up + confetti — runs once intro clears
// ------------------------------------------------------------
function startCardSequence() {
  // Animated value count-up
  var el = document.getElementById('gcValue');
  var start = 0, duration = 1200, startTime = null;
  function step(ts) {
    if (!startTime) startTime = ts;
    var progress = Math.min((ts - startTime) / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    var value = Math.floor(start + (GIFT_VALUE - start) * eased);
    el.textContent = 'Rs. ' + value.toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }
  setTimeout(function () { requestAnimationFrame(step); }, 700);

  // One-time confetti burst
  var canvas = document.getElementById('confetti');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var W = canvas.width = innerWidth, H = canvas.height = innerHeight;
    window.addEventListener('resize', function () {
      W = canvas.width = innerWidth; H = canvas.height = innerHeight;
    });
    var colors = ['#00ffd1', '#ff2e88', '#7c4dff', '#ffffff', '#ffd27f'];
    var pieces = Array.from({ length: 90 }, function () {
      return {
        x: Math.random() * W, y: -20 - Math.random() * H * 0.5,
        r: 3 + Math.random() * 4, c: colors[Math.floor(Math.random() * colors.length)],
        vy: 2 + Math.random() * 2.5, vx: -1.2 + Math.random() * 2.4,
        rot: Math.random() * 360, vr: -6 + Math.random() * 12
      };
    });
    var frame = 0;
    function draw() {
      frame++;
      ctx.clearRect(0, 0, W, H);
      pieces.forEach(function (p) {
        p.y += p.vy; p.x += p.vx; p.rot += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180);
        ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.6);
        ctx.restore();
      });
      if (frame < 170) requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, W, H);
    }
    setTimeout(function () { requestAnimationFrame(draw); }, 400);
  }
}

// ------------------------------------------------------------
// 3) Card flip interaction
// ------------------------------------------------------------
var card = document.getElementById('giftCard');
var flipped = false;
card.addEventListener('click', function () {
  flipped = !flipped;
  card.classList.toggle('flipped', flipped);
});

// ------------------------------------------------------------
// 4) Copy gift code button
// ------------------------------------------------------------
document.getElementById('copyCodeBtn').addEventListener('click', async function (e) {
  e.stopPropagation();
  try {
    await navigator.clipboard.writeText(GIFT_CODE);
    var btn = e.currentTarget;
    var original = btn.textContent;
    btn.textContent = 'Copied ✓';
    setTimeout(function () { btn.textContent = original; }, 1600);
  } catch (err) { /* clipboard unavailable — ignore */ }
});

// ------------------------------------------------------------
// 5) Ambient particle field (runs continuously in the background)
// ------------------------------------------------------------
(function ambientParticles() {
  var canvas = document.getElementById('particles');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var W, H, particles = [];
  function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  var COUNT = Math.min(70, Math.floor(innerWidth / 18));
  for (var i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * W, y: Math.random() * H, r: 0.6 + Math.random() * 1.6,
      vx: -0.15 + Math.random() * 0.3, vy: -0.15 + Math.random() * 0.3,
      a: 0.15 + Math.random() * 0.4
    });
  }
  function tick() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#00ffd1';
    particles.forEach(function (p) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.globalAlpha = p.a;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }
  tick();
})();
