import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import store from "./apps/auth/store";
import setAuthHeader from "./_helpers/setAuthHeader";
import { setUser } from "./apps/auth/actions";

const environment = process.env.REACT_APP_ENV;
const local_id = process.env.REACT_APP_LOCAL_CLIENT_ID;
const google_id = process.env.REACT_APP_CLIENT_ID;

if (sessionStorage.getItem("user")) {
  const parsed_session_data = JSON.parse(sessionStorage.getItem("user"));
  setAuthHeader(parsed_session_data.token.token);
  store.dispatch(setUser(JSON.parse(sessionStorage.getItem("user"))));
  // store.dispatch(setTheme(true));
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <GoogleOAuthProvider
      clientId={environment === "dev" ? local_id : google_id}
    >
      <App />
    </GoogleOAuthProvider>
  </Provider>
  // </React.StrictMode>
);

reportWebVitals();
