import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./reducer";
import settingReducer from "./setting";

const store = configureStore({
  reducer: {
    auth: authReducer,
    setting: settingReducer,
  },
});

export default store;
