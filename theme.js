// Theme toggle, moon phase, and time-of-day glow.
// Shared by index.html and business-planner.html. The no-flash theme init
// stays inline in each page's <head>, because it has to run before first paint.
(function () {
  var btn = document.getElementById('themeBtn');
  var root = document.documentElement;
  if (!btn) return;

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

  var now = new Date();
  var phase = moonPhase(now);
  var lit = document.getElementById('moonLit');

  if (lit) {
    lit.setAttribute('d', litPath(phase, 10));
    if (phase > 0.5) lit.setAttribute('transform', 'scale(-1,1)');

    var illum = Math.round((1 - Math.cos(2 * Math.PI * phase)) * 50);
    var names = ['new', 'waxing crescent', 'first quarter', 'waxing gibbous',
                 'full', 'waning gibbous', 'last quarter', 'waning crescent'];
    var title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = names[Math.floor(phase * 8 + 0.5) % 8] + ' moon, ' + illum + '% lit';
    lit.parentNode.appendChild(title);
  }

  // Glow warms and widens toward local midday, cools and tightens overnight.
  var daylight = Math.max(0, Math.cos((now.getHours() - 13) / 24 * 2 * Math.PI));
  var warm = [255, 196, 92], cool = [150, 190, 255];
  var mix = warm.map(function (c, i) {
    return Math.round(c * daylight + cool[i] * (1 - daylight));
  });
  root.style.setProperty('--glow', 'rgba(' + mix.join(',') + ',' + (0.35 + 0.3 * daylight).toFixed(2) + ')');
  root.style.setProperty('--glow-size', (4 + 4 * daylight).toFixed(1) + 'px');

  function sync() {
    var dark = root.getAttribute('data-theme') === 'dark';
    btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
    btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  sync();
  btn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    sync();
  });
})();
