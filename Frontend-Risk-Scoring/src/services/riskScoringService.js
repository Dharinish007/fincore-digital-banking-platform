import axios from "axios";

/*
 * =========================================================
 * Risk Scoring Service
 * =========================================================
 *
 * This file contains all API calls related to Risk Scoring.
 *
 * Backend Base URL:
 * http://localhost:8080
 *
 * Authentication:
 * Existing JWT token stored in localStorage.
 * =========================================================
 */


// =========================================================
// Axios Instance
// =========================================================

const riskApi = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});


// =========================================================
// Attach JWT Token
// =========================================================

riskApi.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem("accessToken");

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }

    return config;

  },

  (error) => {

    return Promise.reject(error);

  }
);


// =========================================================
// GET ALL RISK RECORDS
// =========================================================

export const getAllRiskRecords = async () => {

  const response =
    await riskApi.get("/risk-scoring");

  return response.data;

};


// =========================================================
// GET RISK DETAILS BY ID
// =========================================================

export const getRiskById = async (
  riskId
) => {

  const response =
    await riskApi.get(
      `/risk-scoring/${riskId}`
    );

  return response.data;

};


// =========================================================
// SEARCH RISK RECORDS
// =========================================================

export const searchRiskRecords = async (
 searchTerm
) => {

  const response =
    await riskApi.get(
      "/risk-scoring",
      {
        params: {
          search: searchTerm,
        },
      }
    );

  return response.data;

};


// =========================================================
// GET RISK RECORDS BY LEVEL
// =========================================================

export const getRiskRecordsByLevel = async (
  riskLevel
) => {

  const response =
    await riskApi.get(
      "/risk-scoring",
      {
        params: {
          riskLevel: riskLevel,
        },
      }
    );

  return response.data;

};


// =========================================================
// GET RISK RECORDS BY STATUS
// =========================================================

export const getRiskRecordsByStatus = async (
  riskStatus
) => {

  const response =
    await riskApi.get(
      "/risk-scoring",
      {
        params: {
          riskStatus: riskStatus,
        },
      }
    );

  return response.data;

};


// =========================================================
// GET RISK STATISTICS
// =========================================================

export const getRiskStatistics = async () => {

  const response =
    await riskApi.get(
      "/risk-scoring/statistics"
    );

  return response.data;

};


// =========================================================
// REASSESS RISK
// =========================================================

export const reassessRisk = async (
  riskId
) => {

  const response =
    await riskApi.post(
      `/risk-scoring/${riskId}/reassess`
    );

  return response.data;

};


// =========================================================
// EXPORT DEFAULT SERVICE OBJECT
// =========================================================

const riskScoringService = {

  getAllRiskRecords,

  getRiskById,

  searchRiskRecords,

  getRiskRecordsByLevel,

  getRiskRecordsByStatus,

  getRiskStatistics,

  reassessRisk,

};


export default riskScoringService;