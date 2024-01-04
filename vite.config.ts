import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  return {
    build: {
      outDir: "build",
    },
    plugins: [react()],
    // define: {
    //   global: {},
    // },
    ENV_KEY: process.env.ENV_KEY,
    resolve: {
      alias: {
        // ...
        "simple-peer": "simple-peer/simplepeer.min.js",
      },
    },
  };
});
