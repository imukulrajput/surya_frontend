import axios from "axios";

// Create a custom axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://surya-project.onrender.com/api/v1", 
  withCredentials: true, // Always send cookies
  headers: {
    "Content-Type": "application/json",
  },
});



export default api;      