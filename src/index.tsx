import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { UserContextProvider } from "./context/user-context";
import { injectStyle } from "react-toastify/dist/inject-style";
import { ToastContainer } from "react-toastify";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import "animate.css";

// CALL IT ONCE IN YOUR APP
injectStyle();

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <>
    <UserContextProvider>
      <Provider 
      // store={store}
      store={store}
      >

      <BrowserRouter>
        <App />
      </BrowserRouter>
      </Provider>
    </UserContextProvider>
    <ToastContainer />
  </>
);
