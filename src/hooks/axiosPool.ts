/* eslint-disable @typescript-eslint/no-explicit-any */
// src/api.ts
import axios from "axios";
import toast from "react-hot-toast";

// Create an Axios instance
const api = axios.create({
  baseURL: "https://conference-management-backend-production.up.railway.app/api/v1",
  // baseURL: "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Example of a GET request
export const getData = async (endpoint: string): Promise<any> => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message);
    console.error("Error fetching data:", error);
    throw error;
  }
};
// Example of a POST request
export const postData = async (
  endpoint: string,
  data: object
): Promise<any> => {
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message);
    console.error("Error posting data:", error);
    throw error;
  }
};
export const putData = async (endpoint: string, data: object): Promise<any> => {
  try {
    const response = await api.put(endpoint, data);
    return response.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message);
    console.error("Error putting data:", error);
    throw error;
  }
};
export const deleteData = async (endpoint: string): Promise<any> => {
  try {
    const response = await api.delete(endpoint);
    return response.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message);
    console.error("Error deleting data:", error);
    throw error;
  }
};
export default api;
