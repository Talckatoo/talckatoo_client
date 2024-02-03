import ReactDOM from "react-dom/client";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "./context/user-context";
import { injectStyle } from "react-toastify/dist/inject-style";
import { ToastContainer } from "react-toastify";
import { persistor, store } from "./redux/store";
import { Provider } from "react-redux";
import App from "./App";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import "animate.css";

import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';

// Import translations
import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';
import arTranslations from './locales/ar.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      es: { translation: esTranslations },
      ar: { translation: arTranslations }
      // Add more languages as needed
    },
    lng: 'en', // Set default language
    interpolation: {
      escapeValue: false // React already escapes strings
    }
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
    <ToastContainer />
  </>
);
