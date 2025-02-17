import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  return {
    build: {
      outDir: "build",
    },
    plugins: [react()],
    resolve: {
      alias: {
        // ...
        "simple-peer": "simple-peer/simplepeer.min.js",
      },
    },
    envPrefix: 'VITE_',
    envDir: '.'
  };
});
