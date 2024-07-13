// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path';
export default defineNuxtConfig({
  devtools: { enabled: true },

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
  }

});
