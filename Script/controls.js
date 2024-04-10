const diagram = document.getElementById("diagram");

diagram.onwheel = (event) => {
	if (event.buttons) return; // Prevent scroll while dragging.
	if (event.deltaY > 0) zoomOut();
	else zoomIn();
}

document.getElementById("zoom-in").onclick = zoomIn;
document.getElementById("zoom-out").onclick = zoomOut;

document.getElementById("color-scheme").onclick = toggleTheme;

// Enable modals.
document.getElementById("new-diagram").onclick = () => 
	document.getElementById("new-diagram-select").showModal();
document.getElementById("edit-automaton").onclick = () =>
	document.getElementById("automaton-modal").showModal();

for (const dialog of document.getElementsByTagName("dialog")) {
	// Close dialogs when clicking on the 'X' button.
	dialog.querySelector("header > button").onclick = () => dialog.close();

	// Close dialogs when clicking on the background.
	dialog.onclick = (event) => {
		if (event.target === dialog) {
			dialog.close();
		}
	}
}

function zoomIn() {
	const scale = parseFloat(diagram.style.getPropertyValue("--scale"));
	setScale(Math.min(4, Math.SQRT2 * scale));
}
function zoomOut() {
	const scale = parseFloat(diagram.style.getPropertyValue("--scale"));
	setScale(Math.max(0.25, Math.SQRT1_2 * scale));
}
function setScale(x) {
	diagram.style.setProperty("--scale", x);
	document.getElementById("zoom-label").innerText = x.toFixed(2);
}
function toggleTheme() {
	const dark = document.documentElement.classList.toggle("dark");
	localStorage.setItem("color-scheme", dark ? "dark" : "light");
}
