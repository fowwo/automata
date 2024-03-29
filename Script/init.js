(() => {
	// Override localStorage methods.
	const namespace = "fsa";
	const getItem = localStorage.getItem.bind(localStorage);
	const setItem = localStorage.setItem.bind(localStorage);
	const removeItem = localStorage.removeItem.bind(localStorage);
	const getItemOverride = (key) => getItem.apply(null, [ `${namespace}-${key}` ]);
	const setItemOverride = (key, value) => setItem.apply(null, [ `${namespace}-${key}`, value ]);
	const removeItemOverride = (key) => removeItem.apply(null, [ `${namespace}-${key}` ]);
	localStorage.getItem = getItemOverride.bind(localStorage);
	localStorage.setItem = setItemOverride.bind(localStorage);
	localStorage.removeItem = removeItemOverride.bind(localStorage);
	
	// Initialize preferred color scheme.
	if (!localStorage.getItem("color-scheme"))
		localStorage.setItem("color-scheme", matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
	if (localStorage.getItem("color-scheme") === "dark")
		document.documentElement.classList.add("dark");
})();

// const clear = localStorage.clear.bind(localStorage);
// const key = localStorage.key.bind(localStorage);

// function clearOverride() {
// 	for (const key of Object.keys(localStorage)) {
// 		if (key.startsWith(`${namespace}-`)) {
// 			removeItem(key);
// 		}
// 	}
// }

// function keyOverride(index) {
// 	for (let i = 0; true; i++) {
// 		const x = key.apply(null, [ i ]);
// 		if (x === null) return null;
// 		if (x.startsWith(`${namespace}-`)) {
// 			index--;
// 			if (index < 0) return x;
// 		}
// 	}
// }

// localStorage.clear = clearOverride.bind(localStorage);
// localStorage.key = keyOverride.bind(localStorage);

// Object.defineProperty(window.localStorage, "length", {
// 	get: () => {
// 		return Object.keys(window.localStorage).reduce((sum, key) => {
// 			if (key.startsWith(`${namespace}-`)) return sum + 1;
// 			return sum;
// 		}, 0);
// 	}
// });
