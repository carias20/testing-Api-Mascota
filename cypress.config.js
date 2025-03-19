const { defineConfig } = require("cypress");
const { beforeRunHook, afterRunHook } = require('cypress-mochawesome-reporter/lib');

module.exports = defineConfig({
  defaultCommandTimeout: 5000,
  pageLoadTimeout: 10000,
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'API Mascotas Report',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    overwrite: false,
    html: true,
    json: true,
    reportDir: 'cypress/reports',
  },

  e2e: {
    baseUrl: "https://reqres.in/api",

    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      on('before:run', async (details) => {
        console.log('✅ before:run hook ejecutado');
        await beforeRunHook(details);
      });

      on('after:run', async () => {
        console.log('✅ after:run hook ejecutado');
        await afterRunHook();
      });

      return config;
    },
  },
});