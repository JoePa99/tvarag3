import axios from "axios";
import authHeader from "./authHeader";

function setAuthHeader(token) {
  axios.defaults.headers.common["Content-Type"] = "application/json";
  axios.defaults.headers.common["Authorization"] = authHeader(
    `Bearer ${token}`
  );
}

export default setAuthHeader;
