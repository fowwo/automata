document.getElementById("color-scheme").onclick = toggleTheme;

function toggleTheme() {
	const dark = document.documentElement.classList.toggle("dark");
	localStorage.setItem("color-scheme", dark ? "dark" : "light");
}
