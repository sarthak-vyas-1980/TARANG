import { STORAGE_KEYS } from '../utils/constants';
import type { User } from '../types';

/**
 * Local storage service for managing client-side data persistence
 */
export class StorageService {
  /**
   * Set item in localStorage with error handling
   */
  static setItem(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  /**
   * Get item from localStorage with error handling
   */
  static getItem<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error('Failed to get from localStorage:', error);
      return defaultValue;
    }
  }

  /**
   * Remove item from localStorage
   */
  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }

  /**
   * Clear all localStorage data
   */
  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }

  /**
   * Check if localStorage is available
   */
  static isAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  // App-specific storage methods
  
  /**
   * Save user data
   */
  static saveUser(user: User): void {
    this.setItem(STORAGE_KEYS.USER, user);
  }

  /**
   * Get saved user data
   */
  static getUser(): User | null {
    return this.getItem<User>(STORAGE_KEYS.USER);
  }

  /**
   * Remove saved user data
   */
  static removeUser(): void {
    this.removeItem(STORAGE_KEYS.USER);
  }

  /**
   * Save auth token
   */
  static saveToken(token: string): void {
    this.setItem(STORAGE_KEYS.TOKEN, token);
  }

  /**
   * Get saved auth token
   */
  static getToken(): string | null {
    return this.getItem<string>(STORAGE_KEYS.TOKEN);
  }

  /**
   * Remove auth token
   */
  static removeToken(): void {
    this.removeItem(STORAGE_KEYS.TOKEN);
  }

  /**
   * Save theme preference
   */
  static saveTheme(theme: 'light' | 'dark' | 'system'): void {
    this.setItem(STORAGE_KEYS.THEME, theme);
  }

  /**
   * Get theme preference
   */
  static getTheme(): 'light' | 'dark' | 'system' | null {
    return this.getItem<'light' | 'dark' | 'system'>(STORAGE_KEYS.THEME, 'system');
  }

  /**
   * Save language preference
   */
  static saveLanguage(language: string): void {
    this.setItem(STORAGE_KEYS.LANGUAGE, language);
  }

  /**
   * Get language preference
   */
  static getLanguage(): string | null {
    return this.getItem<string>(STORAGE_KEYS.LANGUAGE, 'en');
  }

  /**
   * Save form data temporarily (for form recovery)
   */
  static saveFormData(formId: string, data: any): void {
    this.setItem(`form_${formId}`, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Get saved form data
   */
  static getFormData(formId: string, maxAge: number = 3600000): any | null {
    const saved = this.getItem<{data: any; timestamp: number}>(`form_${formId}`);
    
    if (!saved) return null;
    
    // Check if data is too old
    if (Date.now() - saved.timestamp > maxAge) {
      this.removeItem(`form_${formId}`);
      return null;
    }
    
    return saved.data;
  }

  /**
   * Clear saved form data
   */
  static clearFormData(formId: string): void {
    this.removeItem(`form_${formId}`);
  }

  /**
   * Get storage usage information
   */
  static getStorageInfo(): {
    used: number;
    available: number;
    total: number;
  } {
    if (!this.isAvailable()) {
      return { used: 0, available: 0, total: 0 };
    }

    try {
      let used = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length;
        }
      }

      // Approximate localStorage limit (usually 5-10MB)
      const total = 5 * 1024 * 1024; // 5MB
      const available = total - used;

      return { used, available, total };
    } catch {
      return { used: 0, available: 0, total: 0 };
    }
  }
}

export default StorageService;
