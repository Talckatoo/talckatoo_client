import ReactDOM from "react-dom/client";
import { PersistGate } from  
import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "./context/user-context";
import { injectStyle } from "react-toastify/dist/inject-style";
import { ToastContainer } from "react-toastify";
import { store } from "./redux/store";
import { persistStore } from "redux-persist";
import { Provider } from "react-redux";
import App from "./App";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import "animate.css";

// CALL IT ONCE IN YOUR APP
injectStyle();

const root = ReactDOM.createRoot(document.getElementById("root")!);


import {  persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = {
  key: 'root',
  storage,
}

const persistor = persistStore(store);
root.render(
  <>
    <UserContextProvider>
      <Provider 
      // store={store}
      store={store}
      >
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
