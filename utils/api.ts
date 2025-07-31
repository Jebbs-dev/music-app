import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

import { setStorageItem, getStorageItem } from "@/store/auth-store";

const urls = [
  "http://192.168.0.173:8000",
  "http://192.168.100.23:8000",
  "http://192.168.73.197:8000",
];

export const NEXT_PUBLIC_API_BASE_URL = "http://192.168.100.23:8000";

// Helper function to get storage item

// Helper function to check if token is about to expire
const isTokenExpiringSoon = (token: string, thresholdMinutes = 30): boolean => {
  try {
    const decoded: any = jwtDecode(token);
    if (!decoded.exp) return false;

    // Calculate when the token will expire (in milliseconds)
    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();
    const timeUntilExpiration = expirationTime - currentTime;

    // Convert threshold to milliseconds
    const thresholdMs = thresholdMinutes * 60 * 1000;

    // Return true if token will expire within the threshold time
    return timeUntilExpiration <= thresholdMs;
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
};

// Function to refresh the token
const refreshAuthToken = async (): Promise<string> => {
  try {
    const refreshToken = await getStorageItem("refresh_token");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const refreshResponse = await axios.post(
      `${NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
      { refreshToken }
    );

    const { access_token, refresh_token } = refreshResponse.data;

    // Update the tokens in storage
    await setStorageItem("access_token", access_token);
    await setStorageItem("refresh_token", refresh_token);

    return access_token;
  } catch (error) {
    console.error("Token refresh failed:", error);
    // Clear tokens on refresh failure
    await setStorageItem("access_token", null);
    await setStorageItem("refresh_token", null);
    throw error;
  }
};

const api = axios.create({
  baseURL: NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: any[] = [];

// Function to process queued requests
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  async (config) => {
    let accessToken = null;
    try {
      accessToken = await getStorageItem("access_token");
    } catch (error) {
      console.error("Error getting access token:", error);
    }

    if (accessToken) {
      // Check if token is about to expire and refresh it proactively
      // For API requests, refresh if token expires within 30 minutes
      if (isTokenExpiringSoon(accessToken, 30) && !isRefreshing) {
        try {
          isRefreshing = true;
          const newToken = await refreshAuthToken();
          config.headers.Authorization = `Bearer ${newToken}`;
        } catch (error) {
          console.error("Proactive token refresh failed:", error);
          // If proactive refresh fails, still try with current token
          config.headers.Authorization = `Bearer ${accessToken}`;
        } finally {
          isRefreshing = false;
        }
      } else {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    // Dynamically set Content-Type based on the request data
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If another refresh request is already in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAuthToken();

        // Process queued requests with the new token
        processQueue(null, newAccessToken);

        // Retry the failed request with the new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Clear tokens and redirect to login
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

export const setupSilentRefresh = () => {
  // Check for token refresh need on startup
  const checkAndRefreshToken = async () => {
    try {
      const accessToken = await getStorageItem("access_token");
      if (!accessToken) return;

      // If token is going to expire in the next 2 hours, refresh it
      if (isTokenExpiringSoon(accessToken, 120) && !isRefreshing) {
        console.log("Silent token refresh initiated");
        await refreshAuthToken();
      }
    } catch (error) {
      console.error("Silent token refresh failed:", error);
    }
  };

  // Immediately check if we need to refresh - delay slightly to ensure the app has fully loaded
  setTimeout(() => {
    checkAndRefreshToken();
  }, 1000);

  // Set up periodic checking (every 30 minutes since access token lasts 1 hour)
  const refreshInterval = setInterval(checkAndRefreshToken, 30 * 60 * 1000);

  // Clean up interval when needed
  return () => clearInterval(refreshInterval);
};
