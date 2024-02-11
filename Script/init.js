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
