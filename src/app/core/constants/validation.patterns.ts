export const VALIDATION_PATTERNS = {
  // Passwords must contain at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  
  // Standard email validation
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  
  // Only numbers
  NUMERIC_ONLY: /^[0-9]+$/,
  
  // Alphabetic characters with spaces allowed
  ALPHA_WITH_SPACES: /^[a-zA-Z\s]*$/,
  
  // standard currency format (e.g., 1000.00)
  CURRENCY: /^\d+(?:\.\d{0,2})?$/
};
