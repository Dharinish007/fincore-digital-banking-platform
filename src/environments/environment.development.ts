export const environment = {
  production: false,
  apiUrl: "http://localhost:8080/api/v1/kyc",
  faceMatchEndpoint: "http://localhost:8080/api/face/verify",
  maxUploadSizeBytes: 10 * 1024 * 1024, // 10MB
  allowedImageTypes: ["image/jpeg", "image/png", "image/jpg"],
};
