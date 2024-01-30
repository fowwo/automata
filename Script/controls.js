const diagram = document.getElementById("diagram");

diagram.onwheel = (event) => {
	if (event.buttons) return; // Prevent scroll while dragging.
	if (event.deltaY > 0) zoomOut();
	else zoomIn();
}

document.getElementById("zoom-in").onclick = zoomIn;
document.getElementById("zoom-out").onclick = zoomOut;

function zoomIn() {
	const scale = parseFloat(diagram.style.getPropertyValue("--scale"));
	setScale(Math.min(4, 1.25 * scale));
}
function zoomOut() {
	const scale = parseFloat(diagram.style.getPropertyValue("--scale"));
	setScale(Math.max(0.25, 0.8 * scale));
}
function setScale(x) {
	diagram.style.setProperty("--scale", x);
	document.getElementById("zoom-label").innerText = x.toFixed(2);
}
