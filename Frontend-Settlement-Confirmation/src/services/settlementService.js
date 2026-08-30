import axios from "axios";

const API_BASE_URL =
  "http://localhost:8080/api/v1/settlements";

// =====================================================
// GET ALL SETTLEMENTS
// GET /api/v1/settlements
// =====================================================

export const getAllSettlements = async () => {
  const response = await axios.get(API_BASE_URL);

  return response.data;
};

// =====================================================
// GET SETTLEMENT BY SETTLEMENT ID
// GET /api/v1/settlements/{settlementId}
// =====================================================

export const getSettlementById = async (settlementId) => {
  const response = await axios.get(
    `${API_BASE_URL}/${settlementId}`
  );

  return response.data;
};

// =====================================================
// CONFIRM SETTLEMENT
// PUT /api/v1/settlements/{settlementId}/confirm
// ?managerId=MGR001
// =====================================================

export const confirmSettlement = async (
  settlementId,
  managerId
) => {
  const response = await axios.put(
    `${API_BASE_URL}/${settlementId}/confirm`,
    null,
    {
      params: {
        managerId: managerId,
      },
    }
  );

  return response.data;
};

// =====================================================
// GET STATISTICS
// GET /api/v1/settlements/statistics
// =====================================================

export const getSettlementStatistics = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/statistics`
  );

  return response.data;
};

// =====================================================
// SEARCH
// GET /api/v1/settlements/search?value=...
// =====================================================

export const searchSettlements = async (search) => {
  const response = await axios.get(
    `${API_BASE_URL}/search`,
    {
      params: {
        value: search,
      },
    }
  );

  return response.data;
};

// =====================================================
// FILTER BY STATUS
// GET /api/v1/settlements/status/PENDING
// =====================================================

export const getSettlementsByStatus = async (status) => {
  const response = await axios.get(
    `${API_BASE_URL}/status/${status}`
  );

  return response.data;
};