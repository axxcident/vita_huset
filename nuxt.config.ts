// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from "path";
export default defineNuxtConfig({
	devtools: { enabled: true },

	app: {
		head: {
			meta: [
				{ name: "viewport", content: "width=device-width, initial-scale=1" },
				{ name: "theme-color", content: "#33a8c2" },
				{ name: "apple-mobile-web-app-capable", content: "yes" },
				{ name: "apple-mobile-web-app-status-bar-style", content: "default" },
				{ name: "apple-mobile-web-app-title", content: "Vita Huset" },
			],
			link: [
				{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
				{ rel: "manifest", href: "/manifest.json" },
				{ rel: "apple-touch-icon", href: "/icons/icon-152x152.png" },
			],
		},
	},

	routeRules: {
		// prerender index route by default
		"/": { prerender: true },
	},

	// alias: {
	//   "@": resolve(__dirname, "/"),
	// },
	alias: {
		assets: "/<rootDir>/assets",
	},

	css: ["~/assets/main.css"],

	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},

	modules: ["@nuxt/image", "@pinia/nuxt"],

	runtimeConfig: {
		connectionString: process.env.POSTGRES_URL,
		databaseUrl: process.env.POSTGRES_URL,
	},

	compatibilityDate: "2024-07-16",
});
