document.addEventListener('DOMContentLoaded', async () => {
  const timeElement = document.getElementById('time'), dateElement = document.getElementById('date'), body = document.body, IDLE_TIMEOUT = 5 * 60 * 1000/* 5m */, CURSOR_HIDE_TIMEOUT = 3000 /* 3s */, dimClass = 'dim-screen';

  let idleTimer = null, cursorTimer = null, wakeLock = null;

  // --- Service Worker Registration ---
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('./serviceWorker.js');
      // console.info('Service Worker registered');
    } catch (err) {
      // console.warn('Service Worker registration failed:', err);
    }
  }

  // --- Wake Lock Request ---
  async function requestWakeLock() {
    try {
      wakeLock = await navigator.wakeLock?.request('screen');
      wakeLock?.addEventListener('release', () => {
        // console.info('Wake Lock released');
      });
      // console.info('Wake Lock activated');
    } catch (err) {
      // console.error('Wake Lock not supported or denied:', err);
    }
  }

  await requestWakeLock();

  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible') await requestWakeLock();
  });

  // --- Idle & Cursor Management ---
  function resetIdleState() {
    clearTimeout(idleTimer);
    clearTimeout(cursorTimer);

    body.classList.remove(dimClass);
    body.style.cursor = 'default';

    // Cursor hide
    cursorTimer = setTimeout(() => {
      body.style.cursor = 'none';
    }, CURSOR_HIDE_TIMEOUT);

    // Idle screen dimming timer
    idleTimer = setTimeout(() => {
      body.classList.add(dimClass);
    }, IDLE_TIMEOUT);
  }

  ['mousemove', 'keydown', 'touchstart'].forEach(evt =>
    document.addEventListener(evt, resetIdleState, { passive: true })
  );

  resetIdleState();

  // --- Time & Date Updater ---
  function updateTime() {
    const now = new Date(), dateString = now.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).toUpperCase();

    const [h, m, s] = [
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    ].map(v => String(v).padStart(2, '0'));

    const iso = now.toISOString()

    if (timeElement) {
      timeElement.textContent = `${h}:${m}:${s}`;
      timeElement.setAttribute('aria-label', `Current time: ${h} hours, ${m} minutes, ${s} seconds`);
      timeElement.setAttribute('datetime', iso);
    }

    if (dateElement) {
      dateElement.textContent = dateString;
      dateElement.setAttribute('aria-label', `Current date: ${dateString}`);
      dateElement.setAttribute('datetime', iso.split('T')[0]);
    }
  }

  function startClock() {
    updateTime(); // Initial update

    const now = new Date(), delay = 1000 - (now % 1000); // Align to next second

    setTimeout(() => {
      updateTime(); // Realign
      setInterval(updateTime, 1000); // Tick every second
    }, delay);
  }

  startClock();

  // --- Fullscreen Toggle ---
  async function toggleFullscreen() {
    const el = document.documentElement;

    try {
      if (!document.fullscreenElement) await el.requestFullscreen?.();
      else await document.exitFullscreen?.();
    } catch (err) {
      // console.error('Fullscreen toggle failed:', err);
      if (/iPhone|iPad/.test(navigator.userAgent)) alert('Please use "Add to Home Screen" for fullscreen mode on iOS.');
    }
  }

  body.addEventListener('click', toggleFullscreen);

  document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (key === 'f' || key === ' ') {
      e.preventDefault();
      toggleFullscreen();
    }
  });
});
