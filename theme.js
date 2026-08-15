// Theme switch, moon phase, local clock, and time-of-day glow.
// Shared by index.html and business-planner.html. The no-flash theme init
// stays inline in each page's <head>, because it has to run before first paint.
(function () {
  var root = document.documentElement;
  var buttons = document.querySelectorAll('.tswitch');
  if (!buttons.length) return;

  // Moon phase. 0 = new, 0.5 = full. Reference new moon 2000-01-06 18:14 UTC,
  // synodic month 29.530588853 days. The phase is the same worldwide at any
  // given instant; only the orientation of the terminator changes with latitude,
  // and working that out needs a geolocation prompt this site does not ask for.
  function moonPhase(date) {
    var synodic = 29.530588853;
    var ref = Date.UTC(2000, 0, 6, 18, 14) / 86400000;
    var p = ((date.getTime() / 86400000 - ref) % synodic) / synodic;
    return p < 0 ? p + 1 : p;
  }

  // Lit limb: a semicircle, plus a terminator ellipse whose x-radius is
  // r*|cos(2*pi*phase)|. Bulges inward for a crescent and outward for a gibbous,
  // which makes the lit area exactly (1 - cos(2*pi*phase)) / 2 of the disc.
  function litPath(phase, r) {
    var k = Math.cos(2 * Math.PI * phase);
    var rx = Math.abs(k) * r;
    var sweep = k > 0 ? 0 : 1;
    return 'M 0 ' + -r + ' A ' + r + ' ' + r + ' 0 0 1 0 ' + r +
           ' A ' + rx.toFixed(3) + ' ' + r + ' 0 0 ' + sweep + ' 0 ' + -r + ' Z';
  }

  var PHASES = ['new', 'waxing crescent', 'first quarter', 'waxing gibbous',
                'full', 'waning gibbous', 'last quarter', 'waning crescent'];

  function drawMoon(now) {
    var lit = document.getElementById('moonLit');
    if (!lit) return;
    var phase = moonPhase(now);
    lit.setAttribute('d', litPath(phase, 10));
    lit.setAttribute('transform', phase > 0.5 ? 'scale(-1,1)' : '');

    var illum = Math.round((1 - Math.cos(2 * Math.PI * phase)) * 50);
    var label = PHASES[Math.floor(phase * 8 + 0.5) % 8] + ' moon, ' + illum + '% lit';
    var btn = document.getElementById('setDark');
    if (btn) btn.setAttribute('title', label);

    var svg = lit.parentNode;
    var title = svg.querySelector('title');
    if (!title) {
      title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      svg.appendChild(title);
    }
    title.textContent = label;
  }

  // Glow warms and widens toward local midday, cools and tightens overnight.
  function setGlow(now) {
    var daylight = Math.max(0, Math.cos((now.getHours() + now.getMinutes() / 60 - 13) / 24 * 2 * Math.PI));
    var warm = [255, 196, 92], cool = [150, 190, 255];
    var mix = warm.map(function (c, i) {
      return Math.round(c * daylight + cool[i] * (1 - daylight));
    });
    root.style.setProperty('--glow', 'rgba(' + mix.join(',') + ',' + (0.35 + 0.3 * daylight).toFixed(2) + ')');
    root.style.setProperty('--glow-size', (4 + 4 * daylight).toFixed(1) + 'px');
  }

  function partOfDay(h) {
    if (h < 5) return 'night';
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    if (h < 21) return 'evening';
    return 'night';
  }

  function tick() {
    var now = new Date();
    var clock = document.getElementById('clock');
    if (clock) {
      var t = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase();
      clock.textContent = t + ' ' + partOfDay(now.getHours()) + ' where you are';
      clock.setAttribute('datetime', now.toISOString());
    }
    setGlow(now);
    drawMoon(now);
  }

  function sync() {
    var dark = root.getAttribute('data-theme') === 'dark';
    buttons.forEach(function (b) {
      b.setAttribute('aria-pressed', (b.dataset.set === 'dark') === dark ? 'true' : 'false');
    });
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      root.setAttribute('data-theme', b.dataset.set);
      try { localStorage.setItem('theme', b.dataset.set); } catch (e) {}
      sync();
    });
  });

  sync();
  tick();
  setInterval(tick, 30000);
})();
