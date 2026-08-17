import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1";


/* ==========================================
   Get Audit Logs
========================================== */

export const getAuditLogs = async () => {

  const response = await axios.get(
    `${API_BASE_URL}/audit-logs`
  );

  return response.data;
};


/* ==========================================
   Get Audit Log By ID
========================================== */

export const getAuditLogById = async (logId) => {

  const response = await axios.get(
    `${API_BASE_URL}/audit-logs/${logId}`
  );

  return response.data;
};


/* ==========================================
   Filter Audit Logs
========================================== */

export const filterAuditLogs = async (params) => {

  const response = await axios.get(
    `${API_BASE_URL}/audit-logs`,
    {
      params,
    }
  );

  return response.data;
};