import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

export default defineConfig(({ mode }) => {
  // Load .env file explicitly
  const env = loadEnv(mode, process.cwd(), "VITE_");

  // Function to safely read secrets for production
  const getSecret = (path) => {
    try {
      return JSON.stringify(fs.readFileSync(path, "utf8").trim());
    } catch (e) {
      return '""';
    }
  };

  const getEnvDefinitions = (mode) => {
    if (mode === "production") {
      return {
        "import.meta.env.VITE_SOCKET_URL": JSON.stringify(
          env.VITE_SOCKET_URL || ""
        ),
        "import.meta.env.VITE_BASE_URL": JSON.stringify(
          env.VITE_BASE_URL || ""
        ),
        "import.meta.env.VITE_AI_ASSISTANT_ID": JSON.stringify(
          env.VITE_AI_ASSISTANT_ID || ""
        ),
        "import.meta.env.VITE_AI_ASSISTANT_CALL": JSON.stringify(
          env.VITE_AI_ASSISTANT_CALL || ""
        ),
        "import.meta.env.VITE_OPENAI_API_KEY": JSON.stringify(
          env.VITE_OPENAI_API_KEY || ""
        ),
        "import.meta.env.VITE_WHISPER_TRANSCRIPTION_URL": JSON.stringify(
          env.VITE_WHISPER_TRANSCRIPTION_URL || ""
        ),
        "import.meta.env.VITE_GOOGLE_URL": JSON.stringify(
          env.VITE_GOOGLE_URL || ""
        ),
        "import.meta.env.VITE_ENCRYPTION_KEY": JSON.stringify(
          env.VITE_ENCRYPTION_KEY || ""
        ),
        "import.meta.env.VITE_ENCRYPTION_IV": JSON.stringify(
          env.VITE_ENCRYPTION_IV || ""
        ),
        "import.meta.env.VITE_KEK_SECRET": JSON.stringify(
          env.VITE_KEK_SECRET || ""
        ),
        "import.meta.env.VITE_AZURE_TRANSLATOR_KEY": JSON.stringify(
          env.VITE_AZURE_TRANSLATOR_KEY || ""
        ),
        "import.meta.env.VITE_TRANSLATOR_ENDPOINT": JSON.stringify(
          env.VITE_TRANSLATOR_ENDPOINT || ""
        ),
      };
    }
    return {};
  };

  return {
    build: {
      outDir: "build",
    },
    plugins: [react()],
    resolve: {
      alias: {
        "simple-peer": "simple-peer/simplepeer.min.js",
      },
    },
    envPrefix: "VITE_",
    envDir: ".",
    define: getEnvDefinitions(mode),
  };
});
