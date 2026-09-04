export const environment = {
  production: true,
  apiBaseUrl: "/api/v1",
  apiUrl: "/api/v1/kyc",
  ocrApiEndpoint: "http://localhost:8080/api/document-ocr",
  livenessApiEndpoint: "/kyc/liveness/verify",
  faceMatchEndpoint: "http://localhost:8080/api/face/verify",
  mockFallback: false,
  maxUploadSizeBytes: 10 * 1024 * 1024,
  allowedImageTypes: ["image/jpeg", "image/png", "image/jpg"],
};
