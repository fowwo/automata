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

function toggleTheme() {
	const dark = document.documentElement.classList.toggle("dark");
	localStorage.setItem("color-scheme", dark ? "dark" : "light");
}
