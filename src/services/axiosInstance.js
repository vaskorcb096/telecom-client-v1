import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.API_ENDPOINT,
  // withCredentials: true,
});
dfdg;

export default axiosInstance;
