import { SET_THEME } from "./constants";

const initialState = {
  isDark: true,
};

const settingReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_THEME:
      return {
        ...state,
        isDark: action.value,
      };
    default:
      return state;
  }
};

export default settingReducer;
