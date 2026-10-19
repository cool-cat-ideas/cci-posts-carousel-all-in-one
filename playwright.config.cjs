const { defineConfig } = require('playwright/test');

module.exports = defineConfig({
  use: {
    launchOptions: {
      args: ['--host-resolver-rules=MAP localhost 127.0.0.1'],
    },
  },
});
