module.exports = {
  apps: [
    {
      name: "itneckai",
      cwd: "/home/itneck/public_html/itneckai",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3001 -H 127.0.0.1",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: "3001",
        HOSTNAME: "127.0.0.1",
      },
    },
  ],
};