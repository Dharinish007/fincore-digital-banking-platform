export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  apiBaseUrl: 'http://localhost:8080/api/v1',
  ocrApiEndpoint: 'http://localhost:8080/api/document-ocr',
  livenessApiEndpoint: '/kyc/liveness/verify',
  faceMatchEndpoint: 'http://localhost:8080/api/face/verify',
  mockFallback: true,
  maxUploadSizeBytes: 10 * 1024 * 1024,
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/jpg'],
};
