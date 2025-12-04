module.exports = {
  apps: [
    {
      name: "frontend",
      cwd: "./apps/web",
      script: "npm",
      args: "start",
      interpreter: "none",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
    {
      name: "backend",
      cwd: "./apps/api",
      script: "npm",
      args: "run prod",
      interpreter: "none",
      env: {
        NODE_ENV: "production",
        PORT: 8000,
      },
    },
  ],
};
