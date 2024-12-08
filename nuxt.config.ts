// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path';
export default defineNuxtConfig({
  devtools: { enabled: true },

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  routeRules: {
    // prerender index route by default
    '/': { prerender: true },
  },

  // alias: {
  //   "@": resolve(__dirname, "/"),
  // },
  alias: {
    assets: "/<rootDir>/assets",
  },

  css: ['~/assets/main.css'],

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

  compatibilityDate: "2024-07-16"
});
