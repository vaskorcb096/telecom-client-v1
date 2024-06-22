import axios from "axios";

const axiosInstance = axios.create({
  baseURL: 'http://139.59.9.55/v1/api',
  // withCredentials: true,
});

export default axiosInstance;
