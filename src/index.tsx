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
