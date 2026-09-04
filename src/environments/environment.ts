export const environment = {
  production: true,
  apiBaseUrl: "http://localhost:8080",
  apiUrl: "/api/v1/kyc",
  faceMatchEndpoint: "http://localhost:8080/api/face/verify",
  ocrApiEndpoint: "/api/document-ocr",
  livenessApiEndpoint: "/kyc/liveness/verify",
  mockFallback: false,
  maxUploadSizeBytes: 10 * 1024 * 1024, // 10MB
  allowedImageTypes: ["image/jpeg", "image/png", "image/jpg"],
};
