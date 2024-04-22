import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// get users api
export const getAllUsers = () => {
  return axios.get(`${API_URL}/admin/getUsers`);
};
// delete user api
export const deleteUser = (userId) => {
  return axios.post(`${API_URL}/admin/removeUser`, { userId });
};

// add user api
export const addUsers = (value) => {
  return axios.post(`${API_URL}/admin/addUsers`, { value });
};

// update user api
export const updateUser = (value) => {
  return axios.post(`${API_URL}/profile/update`, { value });
};

// get users api
export const getRoles = () => {
  return axios.get(`${API_URL}/admin/getRoles`);
};

// get llm option with users api
export const getLLMOptionWithUser = () => {
  return axios.get(`${API_URL}/llm_option/getOptionWithUser`);
};
