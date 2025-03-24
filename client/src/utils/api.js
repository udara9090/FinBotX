import axios from "axios";

// Utility function to check token expiration
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const { exp } = JSON.parse(atob(token.split('.')[1])); // Decode token to get expiry time
    return exp * 1000 < Date.now(); // Expiry time in milliseconds
  } catch (error) {
    console.warn("⚠ Invalid token format");
    return true;
  }
};

// Create an axios instance
export const api = axios.create({
  baseURL: "http://localhost:5000/api",  // Backend API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to get auth headers for authenticated requests
export const getAuthHeaders = () => {
  const token = localStorage.getItem("token"); // Get token from localStorage
  if (!token || isTokenExpired(token)) {
    console.warn("⚠ Token expired or missing. Redirecting to login.");
    localStorage.removeItem("token"); // Remove expired token
    window.location.href = "/login"; // Redirect to login
    return {};
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`, // Attach token as Authorization header
    },
  };
};

// Utility function to handle API errors
const handleApiError = (error) => {
  console.error("API Request Error:", error);
  return error.response?.data || { message: "An error occurred." };
};

// Add custom API methods here, like login, registration, etc.
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/users/register", userData);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/users/login", credentials);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get("/users/profile", getAuthHeaders());
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Example for fetching expenses (or any other resource)
export const getExpenses = async () => {
  try {
    const response = await api.get("/expenses", getAuthHeaders());
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Example for adding a new expense
export const addExpense = async (expenseData) => {
  try {
    const response = await api.post("/expenses", expenseData, getAuthHeaders());
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
