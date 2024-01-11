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
import  {clearCall}  from "./redux/features/call/callSlice";

// CALL IT ONCE IN YOUR APP
injectStyle();

const root = ReactDOM.createRoot(document.getElementById("root")!);
// Dispatch clearCall action when the application is loaded
store.dispatch(clearCall());

// Dispatch clearCall action when the user refreshes the browser
window.addEventListener("beforeunload", () => {
  store.dispatch(clearCall());
  console.log("Clear call action dispatched on beforeunload.");
});
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
