import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1";


/* ==========================================
   Get All Roles
========================================== */

export const getRoles = async () => {

  const response = await axios.get(
    `${API_BASE_URL}/roles`
  );

  return response.data;
};


/* ==========================================
   Get Role By ID
========================================== */

export const getRoleById = async (roleId) => {

  const response = await axios.get(
    `${API_BASE_URL}/roles/${roleId}`
  );

  return response.data;
};


/* ==========================================
   Create Role
========================================== */

export const createRole = async (roleData) => {

  const response = await axios.post(
    `${API_BASE_URL}/roles`,
    roleData
  );

  return response.data;
};


/* ==========================================
   Update Role
========================================== */

export const updateRole = async (
  roleId,
  roleData
) => {

  const response = await axios.put(
    `${API_BASE_URL}/roles/${roleId}`,
    roleData
  );

  return response.data;
};


/* ==========================================
   Delete Role
========================================== */

export const deleteRole = async (roleId) => {

  const response = await axios.delete(
    `${API_BASE_URL}/roles/${roleId}`
  );

  return response.data;
};