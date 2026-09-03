export const environment = {
  production: true,
  apiUrl: '/api/v1/kyc',
  faceMatchEndpoint: '/api/v1/kyc/face-match',
  maxUploadSizeBytes: 10 * 1024 * 1024, // 10MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/jpg']
};
