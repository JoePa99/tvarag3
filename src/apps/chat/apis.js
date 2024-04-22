import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const insertQueries = (query) => {
  return axios.post(`${API_URL}/chat/insertQueries`, query, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const setSolution = (query) => {
  return axios.post(`${API_URL}/chat/setSolution`, query, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// delete chat
export const deleteChat = (id) => {
  return axios.post(`${API_URL}/chat/deleteChat`, { id });
};

export const getWorkflows = async () => {
  try {
    return await axios.get(`${API_URL}/admin/getWorkflow`);
  } catch (e) {
    return e.response.status;
  }
};
