import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1";

const settlementApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token automatically
settlementApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Get all settlements
 */
export const getSettlements = async () => {
  const response = await settlementApi.get("/settlements");

  return response.data;
};

/**
 * Get settlement by ID
 */
export const getSettlementById = async (settlementId) => {
  const response = await settlementApi.get(
    `/settlements/${settlementId}`
  );

  return response.data;
};

/**
 * Confirm settlement
 */
export const confirmSettlement = async (settlementId) => {
  const response = await settlementApi.put(
    `/settlements/${settlementId}/confirm`
  );

  return response.data;
};

export default settlementApi;