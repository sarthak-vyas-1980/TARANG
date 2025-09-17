// Export all services
export * from './api';
export { StorageService } from './storage';
export { NotificationService } from './notifications';

// Export default services for convenience
export { default as storageService } from './storage';
export { default as notificationService } from './notifications';

// Re-export commonly used services
export {
  AuthService,
  ReportsService,
  UsersService,
  LocationsService,
  DashboardService
} from './api';
