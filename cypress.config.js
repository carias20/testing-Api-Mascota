const { defineConfig } = require("cypress");
const { beforeRunHook, afterRunHook } = require('cypress-mochawesome-reporter/lib');

module.exports = defineConfig({
  // Ajusta el tiempo de espera predeterminado en milisegundos
  defaultCommandTimeout: 5000,
  pageLoadTimeout: 10000,
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'custom-title',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  e2e: {
    // Al iniciar la prueba esta será la url base
    baseUrl: "https://reqres.in/api",
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);

      // Aquí debes colocar las llaves de cierre faltantes para el setupNodeEvents
      on('before:run', async (details) => {
        console.log('override before:run');
        await beforeRunHook(details);
      });
      on('after:run', async () => {
        console.log('override after:run');
        await afterRunHook();
      });
    }
  }
});