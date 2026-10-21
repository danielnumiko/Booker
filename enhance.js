/* Split each teaser title into per-line spans so the underline cascades line-by-line on hover.
   Line breaks depend on wrap width, so measure the live layout and rebuild on resize. */
(function () {
  var STEP = 0.13; // seconds of delay added per line
  function build(ul) {
    var text = ul.getAttribute('data-ul-text');
    if (text === null) { text = ul.textContent; ul.setAttribute('data-ul-text', text); }
    ul.classList.add('js-lines');
    // reset to plain text (drops old bars) so we can measure the natural line boxes
    ul.textContent = text;
    var ulRect = ul.getBoundingClientRect();
    var range = document.createRange();
    range.selectNodeContents(ul);
    // one client rect per rendered line — reflects the browser's real wrapping (incl. hyphen breaks)
    var rects = range.getClientRects();
    var frag = document.createDocumentFragment();
    var bars = [];
    for (var i = 0; i < rects.length; i++) {
      var rc = rects[i];
      if (rc.width < 1 || rc.height < 1) continue;
      var bar = document.createElement('span');
      bar.className = 'bp-ul-bar';
      bar.style.left = (rc.left - ulRect.left) + 'px';
      bar.style.top = (rc.bottom - ulRect.top - 2) + 'px';
      bar.style.width = rc.width + 'px';       // exact width of this line
      bars.push(bar);
      frag.appendChild(bar);
    }
    // draw forwards (line 1→N) on enter, rewind (N→1) on leave
    var n = bars.length;
    bars.forEach(function (bar, i) {
      bar.style.setProperty('--d-enter', (i * STEP) + 's');
      bar.style.setProperty('--d-leave', ((n - 1 - i) * STEP) + 's');
    });
    ul.appendChild(frag); // bars are absolutely positioned, so they don't affect the text
  }
  var observer, deb;
  // force=true rebuilds every title (used on resize, where line breaks change);
  // force=false only splits titles that aren't split yet (used when the DC framework (re)renders them)
  function run(force) {
    if (observer) observer.disconnect();
    var uls = document.querySelectorAll('.bp-title .bp-ul');
    for (var i = 0; i < uls.length; i++) {
      if (force || !uls[i].classList.contains('js-lines')) build(uls[i]);
    }
    if (observer) observer.observe(document.body, { childList: true, subtree: true });
  }
  function init() {
    observer = new MutationObserver(function () { clearTimeout(deb); deb = setTimeout(function () { run(false); }, 60); });
    run(false); // observer starts observing at the end of run()
    // custom fonts change line widths/wrapping — rebuild once they're ready
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { run(true); });
    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { run(true); }, 150); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
