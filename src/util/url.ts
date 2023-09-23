export let BASE_URL: string;

if (import.meta.env.VITE_HOST == "production") {
  BASE_URL = "https://talkcatoo.onrender.com";
} else {
  BASE_URL = "http://localhost:8000";
}
