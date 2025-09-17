import { VALIDATION_RULES } from './constants';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!email.trim()) {
    errors.push('Email is required');
    return { isValid: false, errors };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (email.length > VALIDATION_RULES.EMAIL.MAX_LENGTH) {
    errors.push(`Email must be less than ${VALIDATION_RULES.EMAIL.MAX_LENGTH} characters`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Password validation
export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  const rules = VALIDATION_RULES.PASSWORD;
  
  if (!password) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }
  
  if (password.length < rules.MIN_LENGTH) {
    errors.push(`Password must be at least ${rules.MIN_LENGTH} characters long`);
  }
  
  if (password.length > rules.MAX_LENGTH) {
    errors.push(`Password must be less than ${rules.MAX_LENGTH} characters`);
  }
  
  if (rules.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (rules.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (rules.REQUIRE_NUMBER && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (rules.REQUIRE_SPECIAL && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Confirm password validation
export const validateConfirmPassword = (password: string, confirmPassword: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!confirmPassword) {
    errors.push('Please confirm your password');
    return { isValid: false, errors };
  }
  
  if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Name validation
export const validateName = (name: string, fieldName: string = 'Name'): ValidationResult => {
  const errors: string[] = [];
  const rules = VALIDATION_RULES.NAME;
  
  if (!name.trim()) {
    errors.push(`${fieldName} is required`);
    return { isValid: false, errors };
  }
  
  if (name.trim().length < rules.MIN_LENGTH) {
    errors.push(`${fieldName} must be at least ${rules.MIN_LENGTH} characters long`);
  }
  
  if (name.length > rules.MAX_LENGTH) {
    errors.push(`${fieldName} must be less than ${rules.MAX_LENGTH} characters`);
  }
  
  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(name)) {
    errors.push(`${fieldName} can only contain letters, spaces, hyphens, and apostrophes`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Description validation
export const validateDescription = (description: string): ValidationResult => {
  const errors: string[] = [];
  const rules = VALIDATION_RULES.DESCRIPTION;
  
  if (!description.trim()) {
    errors.push('Description is required');
    return { isValid: false, errors };
  }
  
  if (description.trim().length < rules.MIN_LENGTH) {
    errors.push(`Description must be at least ${rules.MIN_LENGTH} characters long`);
  }
  
  if (description.length > rules.MAX_LENGTH) {
    errors.push(`Description must be less than ${rules.MAX_LENGTH} characters`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Location name validation
export const validateLocationName = (locationName: string): ValidationResult => {
  const errors: string[] = [];
  const rules = VALIDATION_RULES.LOCATION_NAME;
  
  if (!locationName.trim()) {
    errors.push('Location name is required');
    return { isValid: false, errors };
  }
  
  if (locationName.trim().length < rules.MIN_LENGTH) {
    errors.push(`Location name must be at least ${rules.MIN_LENGTH} characters long`);
  }
  
  if (locationName.length > rules.MAX_LENGTH) {
    errors.push(`Location name must be less than ${rules.MAX_LENGTH} characters`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Latitude validation
export const validateLatitude = (lat: number | string): ValidationResult => {
  const errors: string[] = [];
  const latitude = typeof lat === 'string' ? parseFloat(lat) : lat;
  
  if (isNaN(latitude)) {
    errors.push('Latitude must be a valid number');
    return { isValid: false, errors };
  }
  
  if (latitude < -90 || latitude > 90) {
    errors.push('Latitude must be between -90 and 90 degrees');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Longitude validation
export const validateLongitude = (lng: number | string): ValidationResult => {
  const errors: string[] = [];
  const longitude = typeof lng === 'string' ? parseFloat(lng) : lng;
  
  if (isNaN(longitude)) {
    errors.push('Longitude must be a valid number');
    return { isValid: false, errors };
  }
  
  if (longitude < -180 || longitude > 180) {
    errors.push('Longitude must be between -180 and 180 degrees');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Generic required field validation
export const validateRequired = (value: any, fieldName: string): ValidationResult => {
  const errors: string[] = [];
  
  if (value === null || value === undefined || (typeof value === 'string' && !value.trim())) {
    errors.push(`${fieldName} is required`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Phone number validation (optional)
export const validatePhoneNumber = (phone: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!phone.trim()) {
    return { isValid: true, errors }; // Phone is optional
  }
  
  // Basic phone number regex (supports various formats)
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
    errors.push('Please enter a valid phone number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// URL validation (optional)
export const validateUrl = (url: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!url.trim()) {
    return { isValid: true, errors }; // URL is optional
  }
  
  try {
    new URL(url);
  } catch {
    errors.push('Please enter a valid URL');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Form validation helper
export const validateForm = (
  data: Record<string, any>,
  validationRules: Record<string, (value: any) => ValidationResult>
): { isValid: boolean; errors: Record<string, string[]> } => {
  const errors: Record<string, string[]> = {};
  let isValid = true;
  
  Object.entries(validationRules).forEach(([field, validator]) => {
    const result = validator(data[field]);
    if (!result.isValid) {
      errors[field] = result.errors;
      isValid = false;
    }
  });
  
  return { isValid, errors };
};

