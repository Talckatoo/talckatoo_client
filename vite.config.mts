import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from 'fs';

export default defineConfig(({ mode }) => {
  // Function to safely read secrets for production
  const getSecret = (path) => {
    try {
      return JSON.stringify(fs.readFileSync(path, 'utf8').trim());
    } catch (e) {
      return '""';
    }
  };

  // Define based on environment
  const getEnvDefinitions = (mode) => {
    if (mode === 'production') {
      return {
        'import.meta.env.VITE_SOCKET_URL': getSecret('/run/secrets/socket_url'),
        'import.meta.env.VITE_BASE_URL': getSecret('/run/secrets/base_url'),
        'import.meta.env.VITE_AI_ASSISTANT_ID': getSecret('/run/secrets/ai_assistant_id'),
        'import.meta.env.VITE_AI_ASSISTANT_CALL': getSecret('/run/secrets/ai_assistant_call'),
        'import.meta.env.VITE_OPENAI_API_KEY': getSecret('/run/secrets/openai_api_key'),
        'import.meta.env.VITE_WHISPER_TRANSCRIPTION_URL': getSecret('/run/secrets/whisper_url'),
        'import.meta.env.VITE_GOOGLE_URL': getSecret('/run/secrets/google_url'),
        'import.meta.env.VITE_ENCRYPTION_KEY': getSecret('/run/secrets/encryption_key'),
        'import.meta.env.VITE_ENCRYPTION_IV': getSecret('/run/secrets/encryption_iv'),
        'import.meta.env.VITE_KEK_SECRET': getSecret('/run/secrets/kek_secret'),
        'import.meta.env.VITE_AZURE_TRANSLATOR_KEY': getSecret('/run/secrets/azure_translator_key'),
        'import.meta.env.VITE_TRANSLATOR_ENDPOINT': getSecret('/run/secrets/translator_endpoint')
      };
    }
    // Development mode will use .env.development automatically
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
    envPrefix: 'VITE_',
    envDir: '.',
    define: getEnvDefinitions(mode)
  };
});