// Get the clock element
const clockElement = document.querySelector(".clock");

// Function to toggle full screen
function toggleFullscreen() {
	if (document.fullscreenElement || document.webkitFullscreenElement) {
		// If already in full-screen, exit full-screen
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen(); // For Safari
		}
	} else {
		// Request full-screen on the clock element
		if (clockElement.requestFullscreen) {
			clockElement.requestFullscreen();
		} else if (clockElement.webkitRequestFullscreen) {
			clockElement.webkitRequestFullscreen(); // For Safari
		}
	}
}

// Add click event listener to the document to toggle full-screen mode
document.addEventListener("click", toggleFullscreen);

// Function to update the time and date every second
function updateClock() {
	const now = new Date();

	// Update the date
	document.getElementById("date").textContent = now.toLocaleDateString(
		undefined,
		{
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "2-digit",
		}
	);

	// Update the time
	document.getElementById("time").textContent = now.toLocaleTimeString(
		undefined,
		{
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: false, // 24-hour format
		}
	);

	// Update every second
	setTimeout(updateClock, 1000);
}

// Call updateClock initially to start the clock
updateClock();

// Hide cursor after inactivity - 3 seconds timeout
let cursorTimeout;

function hideCursor() {
	document.body.style.cursor = "none"; // Hide cursor
}

function showCursor() {
	document.body.style.cursor = "default"; // Show cursor
}

function resetCursorTimer() {
	showCursor(); // Show cursor when movement is detected
	clearTimeout(cursorTimeout); // Clear any existing timeout
	cursorTimeout = setTimeout(hideCursor, 3000); // Set timer to hide cursor after 3 seconds of inactivity
}

// Listen for mouse movement to reset the cursor timer
document.addEventListener("mousemove", resetCursorTimer);

// Initialize cursor timer on page load
resetCursorTimer();
