import { defineConfig } from "cypress";

export default defineConfig({
  video: false,

  e2e: {
    baseUrl: "http://localhost:3000",
  },

  component: {
    specPattern: "cypress/component/*.cy.{js,jsx,ts,tsx}",
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },
});
