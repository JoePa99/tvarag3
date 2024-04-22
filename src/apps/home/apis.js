import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const getAllQueries = () => {
  return axios.get(`${API_URL}/chat/getAllQueries`);
};

// export const getComparativeAnalysisData = (values) => {
//     return axios.post(`${API_URL}/core/api/comparitive-analytics/`, values)
//   }
