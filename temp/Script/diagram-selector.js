
document.getElementById("diagram-selector").onclick = (event) => {
	const active = event.target.classList.toggle("active");
	const ul = document.querySelector("#diagram-list-container ul");
	ul.style.maxHeight = active ? `${ul.scrollHeight}px` : "";
};
