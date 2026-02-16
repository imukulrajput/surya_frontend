import axios from "axios";

// Create a custom axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://surya-project.onrender.com/api/v1", 
  withCredentials: true, // Always send cookies
  headers: {
    "Content-Type": "application/json",
  },
});


 api.interceptors.response.use(
  (response) => {
    // If the request succeeds, just return the data
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 (Unauthorized) and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark this request so we don't loop infinitely

      try {
        // 1. Call your Refresh Token Endpoint
        // This sends the "refreshToken" cookie to the backend automatically
        await api.post("/users/refresh-token");

        // 2. If successful, retry the original failed request
        return api(originalRequest);
        
      } catch (refreshError) {
        // 3. If refresh fails (e.g., 7 days passed or token invalid), force logout
        console.error("Session expired. Please login again.");
        
        // Optional: Redirect to login page
        if (typeof window !== "undefined") {
           window.location.href = "/login";
        }
        
        return Promise.reject(refreshError);
      }
    }

    // If it's not a 401 or we already retried, reject the error normally
    return Promise.reject(error);
  }
);


export default api;      