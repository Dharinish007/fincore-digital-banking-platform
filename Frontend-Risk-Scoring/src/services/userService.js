// User Management API service
// Backend integration will be added later.

export const getUsers = async () => {
  // TODO: Connect with backend API
  return [];
};


export const getUserById = async (userId) => {
  // TODO: Connect with backend API
  console.log("Get user:", userId);
};


export const createUser = async (userData) => {
  // TODO: Connect with backend API
  console.log("Create user:", userData);
};


export const updateUser = async (
  userId,
  userData
) => {
  // TODO: Connect with backend API
  console.log(
    "Update user:",
    userId,
    userData
  );
};


export const deleteUser = async (userId) => {
  // TODO: Connect with backend API
  console.log("Delete user:", userId);
};