import axios from "axios";

const axiosWithAuth = () => {
  const token = localStorage.getItem("token") || undefined;

  return axios.create({
    baseURL: "http://localhost:5000",
    headers: {
      authorization: token,
    },
  });
};

export default axiosWithAuth;
