const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    env: {
      API_URL: 'http://localhost:3001'
    },
    fixturesFolder: false,
    supportFile: false,
  },
})
