import type { HazardType, Severity, Status } from '../types/reports';
import type {Role} from '../types/user'
import type { SelectOption } from '../types/common';

export const HAZARD_TYPES: SelectOption<HazardType>[] = [
  { value: 'TSUNAMI', label: 'Tsunami' },
  { value: 'STORM_SURGE', label: 'Storm Surge' },
  { value: 'HIGH_WAVES', label: 'High Waves' },
  { value: 'COASTAL_FLOODING', label: 'Coastal Flooding' },
  { value: 'ABNORMAL_TIDE', label: 'Abnormal Tide' }
];

export const SEVERITY_LEVELS: SelectOption<Severity>[] = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' }
];

export const REPORT_STATUS: SelectOption<Status>[] = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'VERIFIED', label: 'Verified' },
  { value: 'INVESTIGATING', label: 'Investigating' },
  { value: 'REJECTED', label: 'Rejected' }
];

export const USER_ROLES: SelectOption<Role>[] = [
  { value: 'CITIZEN', label: 'Citizen' },
  { value: 'OFFICIAL', label: 'Official' },
  { value: 'ANALYST', label: 'Analyst' }
];

// Environment variables with fallbacks
export const API_BASE_URL = '/api';
export const APP_NAME = 'Ocean Hazard Platform';

// Application constants
export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
  maxLimit: 100
};

export const SEVERITY_COLORS = {
  LOW: 'text-green-600 bg-green-100 border-green-200',
  MEDIUM: 'text-yellow-600 bg-yellow-100 border-yellow-200',
  HIGH: 'text-red-600 bg-red-100 border-red-200'
} as const;

export const STATUS_COLORS = {
  PENDING: 'text-yellow-600 bg-yellow-100 border-yellow-200',
  VERIFIED: 'text-green-600 bg-green-100 border-green-200',
  INVESTIGATING: 'text-blue-600 bg-blue-100 border-blue-200',
  REJECTED: 'text-red-600 bg-red-100 border-red-200'
} as const;

export const ROLE_COLORS = {
  CITIZEN: 'text-blue-600 bg-blue-100',
  OFFICIAL: 'text-purple-600 bg-purple-100',
  ANALYST: 'text-indigo-600 bg-indigo-100'
} as const;

// Date and time formats
export const DATE_FORMATS = {
  SHORT: 'MMM dd, yyyy',
  LONG: 'MMMM dd, yyyy',
  WITH_TIME: 'MMM dd, yyyy HH:mm',
  TIME_ONLY: 'HH:mm',
  ISO: 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx'
} as const;

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  REFRESH: '/auth/refresh',
  
  // Reports
  REPORTS: '/reports',
  REPORT_BY_ID: (id: number) => `/reports/${id}`,
  UPDATE_REPORT_STATUS: (id: number) => `/reports/${id}/status`,
  
  // Users
  USERS: '/users',
  USER_BY_ID: (id: number) => `/users/${id}`,
  CHANGE_PASSWORD: '/users/change-password',
  
  // Locations
  LOCATIONS: '/locations',
  
  // Dashboard
  DASHBOARD: '/dashboard/stats',
  ANALYTICS: '/analytics',
  
  // Health
  HEALTH: '/health'
} as const;

// Validation constraints
export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: false
  },
  EMAIL: {
    MAX_LENGTH: 255
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100
  },
  DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 1000
  },
  LOCATION_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100
  }
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user_data',
  THEME: 'theme_preference',
  LANGUAGE: 'language_preference'
} as const;
