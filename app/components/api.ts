export const API_URL = "https://localhost:7092/api";

// Always return an object (never undefined)
export function getAuthHeader(): HeadersInit {
  const token = localStorage.getItem("token");
  if (!token) {
    return {}; // empty headers if no token
  }
  return {
    Authorization: `Bearer ${token}`,
  };
}
