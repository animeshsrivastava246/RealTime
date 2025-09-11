document.addEventListener('DOMContentLoaded', async () => {
  const timeElement = document.getElementById('time');
  const dateElement = document.getElementById('date');
  const body = document.body;

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/serviceWorker.js')
      .then(() => console.info('Service Worker registered'))
      .catch(err => console.warn('Service Worker registration failed:', err));
  }

  // Inject clock container if missing (failsafe)
  if (!document.querySelector('main')) {
    const main = document.createElement('main');
    main.append(timeElement, dateElement);
    body.appendChild(main);
  }

  // Always Awake (Screen Wake Lock API)
  let wakeLock = null;
  async function requestWakeLock() {
    try {
      if ('wakeLock' in navigator) {
        wakeLock = await navigator.wakeLock.request('screen');
        console.info('Wake Lock activated');
        wakeLock.addEventListener('release', () => {
          console.info('Wake Lock released');
        });
      }
    } catch (err) {
      console.error('Wake Lock not supported or denied:', err);
    }
  }
  await requestWakeLock();

  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible') {
      await requestWakeLock();
    }
  });

  // Brightness dimming after idle
  const idleThreshold = 5 * 60 * 1000; // 5 minutes
  let idleTimer;
  const dimClass = 'dim-screen';

  function resetIdleTimer() {
    clearTimeout(idleTimer);
    body.classList.remove(dimClass);
    body.style.cursor = 'default';

    idleTimer = setTimeout(() => {
      body.classList.add(dimClass);
      body.style.cursor = 'none';
    }, idleThreshold);
  }

  ['mousemove', 'keydown', 'touchstart'].forEach(evt =>
    document.addEventListener(evt, resetIdleTimer)
  );

  resetIdleTimer();

  // Real-Time Clock Update
  function updateTime() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');

    timeElement.textContent = `${h}:${m}:${s}`;

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString(undefined, options).toUpperCase();
    dateElement.textContent = dateString;

    // ARIA updates
    timeElement.setAttribute('aria-label', `Current time: ${h} hours, ${m} minutes, ${s} seconds`);
    timeElement.setAttribute('datetime', now.toISOString());
    dateElement.setAttribute('aria-label', `Current date: ${dateString}`);
    dateElement.setAttribute('datetime', now.toISOString().split('T')[0]);

    requestAnimationFrame(updateTime);
  }
  updateTime();

  // Fullscreen toggle
  async function toggleFullscreen() {
    const el = document.documentElement;

    try {
      if (!document.fullscreenElement && el.requestFullscreen) {
        await el.requestFullscreen();
      } else if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen toggle failed:', err);
      // iOS Safari fallback alert on request failure
      if (window.navigator.userAgent.includes('iPhone') || window.navigator.userAgent.includes('iPad')) {
        alert('Please use "Add to Home Screen" for fullscreen mode on iOS.');
      }
    }
  }

  // Use toggleFullscreen for click and keyboard shortcuts
  body.addEventListener('click', toggleFullscreen);

  document.addEventListener('keydown', (e) => {
    if (['f', ' '].includes(e.key.toLowerCase())) {
      e.preventDefault();
      toggleFullscreen();
    }
  });
});
