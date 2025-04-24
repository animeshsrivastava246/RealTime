document.addEventListener('DOMContentLoaded', () => {
  const timeElement = document.getElementById('time');
  const dateElement = document.getElementById('date');
  const body = document.querySelector('body');
  
  // Create clock container if it doesn't exist
  if (!document.querySelector('main')) {
    const main = document.createElement('main');
    main.appendChild(timeElement);
    main.appendChild(dateElement);
    body.appendChild(main);
  }
  
  // Add fullscreen toggle
  body.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  });

  // Hide cursor when idle
  let idleTimeout;
  const idleTime = 3000; // 3 seconds

  function resetIdleTimer() {
    clearTimeout(idleTimeout);
    document.body.style.cursor = 'default';
    idleTimeout = setTimeout(() => {
      document.body.style.cursor = 'none';
    }, idleTime);
  }

  document.addEventListener('mousemove', resetIdleTimer);
  resetIdleTimer();

  // Update time with futuristic formatting
  function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    timeElement.innerHTML = `${hours}:${minutes}:${seconds}`;
    
    // Date with futuristic format
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    const dateString = now.toLocaleDateString(undefined, options);
    dateElement.textContent = dateString.toUpperCase();
    
    // Update ARIA labels for accessibility
    timeElement.setAttribute('aria-label', `Current time: ${hours} hours, ${minutes} minutes, ${seconds} seconds`);
    dateElement.setAttribute('aria-label', `Current date: ${dateString}`);
    
    requestAnimationFrame(updateTime);
  }
  
  updateTime();
});
