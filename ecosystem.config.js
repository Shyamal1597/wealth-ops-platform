module.exports = {
  apps: [{
    name: "sunidhi-web",
    script: "node_modules/next/dist/bin/next",
    args: "start",
    interpreter: "node",
    env: {
      NODE_ENV: "production"
    }
  }]
};