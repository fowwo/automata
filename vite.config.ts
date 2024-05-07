import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
	root: "View",
	base: "./",
	publicDir: "Static",
	build: {
		target: "esnext",
		outDir: "../dist",
		assetsDir: ".",
		emptyOutDir: true
	},
	plugins: [ vue() ]
});
