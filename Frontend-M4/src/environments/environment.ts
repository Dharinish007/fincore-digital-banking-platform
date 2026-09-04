export const environment = {
  production: false,

  // Spring Boot base URL
  apiBaseUrl: "http://localhost:8080/api/v1",

  apiUrl: "/api/v1/kyc",

  // OCR
  ocrApiEndpoint: "http://localhost:8080/api/document-ocr",

  // Liveness
  livenessApiEndpoint: "/kyc/liveness/verify",

  // Face Match
  faceMatchEndpoint: "http://localhost:8080/api/face/verify",

  // Disable mock fallback during backend integration
  mockFallback: false,

  maxUploadSizeBytes: 10 * 1024 * 1024,

  allowedImageTypes: ["image/jpeg", "image/png", "image/jpg"],
};
