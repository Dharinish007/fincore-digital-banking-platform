export const environment = {
  production: true,
  apiBaseUrl: '/api/v1',
  apiUrl: '/api/v1/kyc',
  ocrApiEndpoint: '/kyc/ocr/process',
  livenessApiEndpoint: '/kyc/liveness/verify',
  faceMatchEndpoint: '/api/v1/kyc/face-match',
  mockFallback: false,
  maxUploadSizeBytes: 10 * 1024 * 1024,
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/jpg']
};

