
export const API_URL = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : "http://localhost:5000/api";

export function getAuthHeader(): HeadersInit {
  const token = localStorage.getItem("token");
  if (!token) {
    return {}; 
  }
  return {
    Authorization: `Bearer ${token}`,
  };
}