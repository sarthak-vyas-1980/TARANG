// Environment variables
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_URL: import.meta.env.VITE_API_URL || '/api',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Ocean Hazard Platform',
} as const;

// Application constants
export const APP_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  DEBOUNCE_DELAY: 300,
  API_TIMEOUT: 10000,
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme_preference',
  LANGUAGE: 'language_preference',
  DRAFT_REPORT: 'draft_report',
} as const;

// Date formats
export const DATE_FORMATS = {
  SHORT: 'MMM dd, yyyy',
  LONG: 'MMMM dd, yyyy',
  WITH_TIME: 'MMM dd, yyyy HH:mm',
  TIME_ONLY: 'HH:mm',
  ISO: 'yyyy-MM-dd',
} as const;

// Validation rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MIN_LENGTH: 10,
  DESCRIPTION_MAX_LENGTH: 1000,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Internal server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Welcome back!',
  LOGOUT_SUCCESS: 'You have been logged out successfully.',
  REGISTER_SUCCESS: 'Account created successfully!',
  REPORT_CREATED: 'Report created successfully.',
  REPORT_UPDATED: 'Report updated successfully.',
  REPORT_DELETED: 'Report deleted successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.',
} as const;

// Route paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  REPORTS: '/reports',
  CREATE_REPORT: '/reports/create',
  EDIT_REPORT: '/reports/:id/edit',
  VIEW_REPORT: '/reports/:id',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
  },
  REPORTS: {
    LIST: '/reports',
    CREATE: '/reports',
    GET: (id: number) => `/reports/${id}`,
    UPDATE: (id: number) => `/reports/${id}`,
    DELETE: (id: number) => `/reports/${id}`,
    UPDATE_STATUS: (id: number) => `/reports/${id}/status`,
  },
  USERS: {
    LIST: '/users',
    GET: (id: number) => `/users/${id}`,
    UPDATE: (id: number) => `/users/${id}`,
    DELETE: (id: number) => `/users/${id}`,
  },
  LOCATIONS: {
    LIST: '/locations',
    CREATE: '/locations',
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
  },
} as const;
