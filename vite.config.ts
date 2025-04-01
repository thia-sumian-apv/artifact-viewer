import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import Pages from "vite-plugin-pages";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		Pages({
			dirs: [{ dir: "src/artifacts", baseRoute: "" }],
			extensions: ["jsx", "tsx"],
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			src: path.resolve(__dirname, "./src"),
		},
	},
	build: {
		// Add these to make the build more stable
		minify: false, // Temporarily disable minification to isolate issues
		sourcemap: true,
		chunkSizeWarningLimit: 1000,
	},
});
