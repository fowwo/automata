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
