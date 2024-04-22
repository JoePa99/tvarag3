import {
  CLIENT_SET,
  CLIENT_UNSET,
  EMAIL_VERIFY,
  LOGIN_ERROR,
  LOGIN_NOT_EXIST,
  REGISTER_ERROR,
  REGISTER_ERROR_ADMIN,
  SET_ACTIVE_MODEL,
  EMAIL_VERIFY_ERROR,
  URL_VERIFY_ERROR,
  EMAIL_ALREADY_EXIST,
} from "./constants";

const initialState = {
  isAuthenticated: false,
  user: {},
  requesting: true,
  successful: false,
  messages: "",
  error: "",
  activeModel: "",
  errorType: "",
};

const authReducer = (state = initialState, action) => {
  switch (true) {
    case action.type === REGISTER_ERROR:
      return {
        ...state,
        isAuthenticated: false,
        error: action.error,
        errorType: action.type,
      };

    case action.type === REGISTER_ERROR_ADMIN:
      return {
        ...state,
        isAuthenticated: true,
        error: action.error,
        errorType: action.type,
      };

    case action.type === EMAIL_VERIFY:
      return {
        ...state,
        isAuthenticated: false,
        error: action.error,
        errorType: action.type,
      };

    case action.type === EMAIL_VERIFY_ERROR:
      return {
        ...state,
        isAuthenticated: false,
        error: action.error,
        errorType: action.type,
      };

    case action.type === URL_VERIFY_ERROR:
      return {
        ...state,
        isAuthenticated: false,
        error: action.error,
        errorType: action.type,
      };

    case action.type === EMAIL_ALREADY_EXIST:
      return {
        ...state,
        isAuthenticated: false,
        error: action.error,
        errorType: action.type,
      };

    case action.type === LOGIN_ERROR || action.type === LOGIN_NOT_EXIST:
      return {
        ...state,
        isAuthenticated: false,
        error: action.error,
        errorType: action.type,
      };

    case action.type === CLIENT_SET:
      return {
        ...state,
        user: action.user,
        isAuthenticated: true,
        requesting: false,
        successful: true,
        error: "",
        errorType: action.type,
      };
    case action.type === SET_ACTIVE_MODEL:
      return {
        ...state,
        activeModel: action.activeModel,
      };

    case action.type === CLIENT_UNSET:
      return {
        ...state,
        initialState,
      };

    default:
      return state;
  }
};

export default authReducer;
