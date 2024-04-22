import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// user profile api
export const getProfile = () => {
  return axios.get(`${API_URL}/profile`);
};

export const editProfile = (values) => {
  return axios.put(`${API_URL}/profile/edit`, values);
};

// change password api
export const updatePassword = (values) => {
  return axios.post(`${API_URL}/profile/changePassword`, values);
};

// upload file
export const uploadFile = ({ file, sid, core }) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("sid", sid);
  formData.append("core", core);
  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };
  return axios.post(`${API_URL}/admin/ingestFile`, formData, config);
};

export const uploadURL = ({ url, sid, core }) => {
  return axios.post(`${API_URL}/admin/ingestURL`, { url, sid, core });
};

// retrain model (file)
export const retrainModel = (files) => {
  return axios.post(`${API_URL}/user_query/retrainModel`, { files });
};

// retrieve all documents api
export const getDocumentsList = () => {
  return axios.get(`${API_URL}/admin/getDocuments`);
};

// init all pinecone db
export const initDB = (values) => {
  return axios.post(`${API_URL}/admin/removePineconeAll`, { del_flag: "all" });
};

// delete Model (file)
export const deleteModel = (payload) => {
  return axios.post(`${API_URL}/user_query/deleteModel`, payload);
};

// retrain all models (files)
export const retrainAllModels = (files) => {
  return axios.post(`${API_URL}/user_query/retrainAllModels`, { files });
};
// set active model
export const setActiveModelApi = (id) => {
  return axios.post(`${API_URL}/user_query/setActiveModel`, { id });
};
// set active model
export const getActiveModelApi = () => {
  return axios.get(`${API_URL}/user_query/getActiveModel`);
};

// Prompt
export const setPrompt = (value) => {
  return axios.post(`${API_URL}/profile/setPrompt`, value);
};

export const getUserPrompt = () => {
  return axios.get(`${API_URL}/profile/getPrompt`);
};

//set GPT model name

export const setLLMOption = (value) => {
  return axios.post(`${API_URL}/llm_option/setLLMOption`, value);
};

export const getLLMOption = () => {
  return axios.get(`${API_URL}/llm_option/getLLMOption`);
};

// get page style api
export const getStyles = (value) => {
  return axios.get(`${API_URL}/user_style/get`, {
    params: {
      type: value,
    },
  });
};

// add page style api
export const addStyle = (value) => {
  return axios.post(`${API_URL}/user_style/addStyle`, { value });
};

//store files to vector db

// retrain all models (files)
export const storeVectorDB = (file_id, path) => {
  return axios.post(`${API_URL}/user_query/storeVectorDB`, {
    file_id,
    path,
  });
};

export const getWorkflows = async () => {
  try {
    return await axios.get(`${API_URL}/admin/getWorkflow`);
  } catch (e) {
    return e.response.status;
  }
};

export const updateWorkflow = async (values) => {
  try {
    return await axios.post(`${API_URL}/admin/updateWorkflow`, values);
  } catch (e) {
    return e.response.status;
  }
};

export const createWorkFlow = async (values) => {
  try {
    return await axios.post(`${API_URL}/admin/createWorkflow`, values);
  } catch (e) {
    return e.response.status;
  }
};

export const deleteWorkFlow = async (id) => {
  try {
    return await axios.post(`${API_URL}/admin/deleteWorkflow`, { id });
  } catch (e) {
    return e.response.status;
  }
};
