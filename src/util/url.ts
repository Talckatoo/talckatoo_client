export let BASE_URL: string;
console.log(import.meta.env.VITE_HOST);

if (import.meta.env.VITE_HOST == "production") {
  BASE_URL = "https://prac-team2.onrender.com";
} else {
  BASE_URL = "http://localhost:8000";
}
console.log(BASE_URL);
