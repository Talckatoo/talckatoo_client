import ReactDOM from "react-dom/client";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "./context/user-context";
import { injectStyle } from "react-toastify/dist/inject-style";
import { ToastContainer } from "react-toastify";
import NotificationPermission from "./components/NotificationPermission";
import { persistor, store } from "./redux/store";
import { Provider } from "react-redux";
import App from "./App";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import "animate.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSpinner, fas } from "@fortawesome/free-solid-svg-icons";
library.add(fas, faSpinner);

import { initReactI18next } from "react-i18next";
import i18n from "i18next";

// Import translations
import enTranslations from "./locales/en.json";
import esTranslations from "./locales/es.json";
import arTranslations from "./locales/ar.json";
import frTranslations from "./locales/fr.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslations },
    es: { translation: esTranslations },
    ar: { translation: arTranslations },
    fr: { translation: frTranslations },
    // Add more languages as needed
  },
  lng: "en", // Set default language
  interpolation: {
    escapeValue: false, // React already escapes strings
  },
});

// CALL IT ONCE IN YOUR APP
injectStyle();

const root = ReactDOM.createRoot(document.getElementById("root")!);

// Dispatch clearCall action when the application is loaded

root.render(
  <>
    <UserContextProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </UserContextProvider>
    <NotificationPermission />
    <ToastContainer />
  </>
);

// Register service worker for push notifications

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register(
        "/service-worker.js"
      );

      console.log("Service Worker registered with scope:", registration.scope);
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  });
}

// Request notification permission

async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      console.log("Notification permission granted");
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
  }
}

requestNotificationPermission();
