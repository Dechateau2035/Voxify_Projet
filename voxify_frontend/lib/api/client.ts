import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Une erreur est survenue.";
    return Promise.reject(new Error(message));
  },
);
