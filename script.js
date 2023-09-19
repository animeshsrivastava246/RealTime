// Get the clock element
const clockElement = document.querySelector(".clock");

// Function to toggle full screen
function toggleFullscreen() {
	if (document.fullscreenElement) {
		// If already in full-screen, exit full-screen
		document.exitFullscreen();
	} else {
		// Request full-screen on the clock element
		clockElement.requestFullscreen();
	}
}

// Add click event listener to the document
document.addEventListener("click", toggleFullscreen);

function updateClock() {
	const now = new Date();

	document.getElementById("date").textContent = now.toLocaleDateString(
		undefined,
		{
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "2-digit",
		}
	);
	document.getElementById("time").textContent = now.toLocaleTimeString(
		undefined,
		{
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: false,
		}
	);

	setTimeout(updateClock, 1000); // Update the clock every second
}

updateClock(); // Initial call to start the clock
