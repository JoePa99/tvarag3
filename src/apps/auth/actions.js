import axios from "axios";
import {
  CLIENT_SET,
  CLIENT_UNSET,
  LOGIN_ERROR,
  LOGIN_NOT_EXIST,
  REGISTER_ERROR,
  SET_ACTIVE_MODEL,
  SET_THEME,
  EMAIL_VERIFY,
  EMAIL_VERIFY_MSG,
  EMAIL_VERIFY_ERROR,
  EMAIL_VERIFY_ERROR_MSG,
  EMAIL_VERIFY_SUCCESS,
  EMAIL_VERIFY_SUCCESS_MSG,
  EMAIL_ALREADY_EXIST,
  URL_VERIFY_ERROR,
  URL_VERIFY_ERROR_MSG,
  URL_VERIFY_SUCCESS,
  URL_VERIFY_SUCCESS_MSG,
} from "./constants";
import setAuthHeader from "../../_helpers/setAuthHeader";
import { jwtDecode } from "jwt-decode";

const API_URL = process.env.REACT_APP_API_URL;

export function setUser(user) {
  return {
    type: CLIENT_SET,
    user,
  };
}
export function setActiveModel(id) {
  return {
    type: SET_ACTIVE_MODEL,
    activeModel: id,
  };
}

export function unsetUser() {
  return {
    type: CLIENT_UNSET,
  };
}

export function setTheme(value) {
  return {
    type: SET_THEME,
    value,
  };
}

export const register = (values) => async (dispatch) => {
  try {
    const { data } = await axios.post(`${API_URL}/auth/register`, values, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (error) {
    console.log("error: ", error);
    if (values.state === "user") {
      return 0;
    } else {
      dispatch({
        type: REGISTER_ERROR,
        error: error.response?.data?.error || error.message,
      });
    }
  }
};

export const verifyEmail = (tokens) => async (dispatch) => {
  try {
    const { data } = await axios.post(`${API_URL}/auth/verifyEmail`, tokens, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    sessionStorage.setItem("user", JSON.stringify(data));
    dispatch(setUser(data.storeData));
    dispatch({
      type: EMAIL_VERIFY_SUCCESS,
      error: EMAIL_VERIFY_SUCCESS_MSG,
    });
    window.location = "/";
  } catch (error) {
    console.log("error: ", error);
    dispatch({
      type: EMAIL_VERIFY_ERROR,
      error: EMAIL_VERIFY_ERROR_MSG,
    });
  }
};

export const verifyURL = (tokens) => async (dispatch) => {
  try {
    const { data } = await axios.post(`${API_URL}/auth/verifyHashURL`, tokens, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    sessionStorage.setItem("user", JSON.stringify(data));
    dispatch(setUser(data));
    dispatch({
      type: URL_VERIFY_SUCCESS,
      error: URL_VERIFY_SUCCESS_MSG,
    });
    window.location = "/";
  } catch (error) {
    console.log("error: ", error);
    dispatch({
      type: URL_VERIFY_ERROR,
      error: URL_VERIFY_ERROR_MSG,
    });
  }
};

export const login = (loginInput) => async (dispatch) => {
  try {
    const { data } = await axios.post(`${API_URL}/auth/login`, loginInput, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const user_data = jwtDecode(data.token);
    setAuthHeader(data.token);
    // alert(data.token);
    user_data.token = { ...user_data.token, ["token"]: data.token };
    sessionStorage.setItem("user", JSON.stringify(user_data));
    // dispatch(setUser(data.storeData));
    window.location = "/";
  } catch (error) {
    console.log("error: ", error);
    dispatch({
      type:
        error.response?.data?.type === 1
          ? LOGIN_NOT_EXIST
          : error.response?.data?.type === 2
          ? EMAIL_VERIFY
          : LOGIN_ERROR,
      error: error.response?.data?.error || error.message,
    });
  }
};

export const loginWithGoogle = (token) => async (dispatch) => {
  axios
    .get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    )
    .then((res) => {
      axios
        .post(
          `${API_URL}/auth/googleRegister`,
          { values: res.data },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          console.log("google resdata", res.data);
          sessionStorage.setItem("user", JSON.stringify(res.data));
          dispatch(setUser(res.data.storeData));
          window.location = "/";
        })
        .catch((error) => {
          console.log("google login error----", error);
          dispatch({
            type: EMAIL_ALREADY_EXIST,
            error: error.response?.data?.error || error.message,
          });
        });
    })
    .catch((err) => console.log(err));
};

export const logout = () => {
  sessionStorage.removeItem("user");
  window.location = "/login";
  // googleLogout()
  // window.location.reload();
  return (dispatch) => {
    dispatch(unsetUser());
  };
};
