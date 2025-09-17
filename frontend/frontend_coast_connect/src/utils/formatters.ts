import type { HazardType, Severity, Status } from '../types/reports';
import type {Role} from '../types/user'

// Date and time formatters
export const formatters = {
  // Date formatters
  date: {
    // Full date with time: "March 15, 2024 at 2:30 PM"
    full: (date: string | Date): string => {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(new Date(date));
    },

    // Short date: "Mar 15, 2024"
    short: (date: string | Date): string => {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(new Date(date));
    },

    // Relative time: "2 hours ago", "3 days ago"
    relative: (date: string | Date): string => {
      const now = new Date();
      const target = new Date(date);
      const diff = now.getTime() - target.getTime();
      
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const months = Math.floor(days / 30);
      const years = Math.floor(days / 365);

      if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
      if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
      if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
      if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      return 'Just now';
    },

    // Time only: "2:30 PM"
    time: (date: string | Date): string => {
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(new Date(date));
    },

    // ISO format: "2024-03-15"
    iso: (date: string | Date): string => {
      return new Date(date).toISOString().split('T')[0];
    }
  },

  // Number formatters
  number: {
    // Comma-separated: 1,234,567
    comma: (num: number): string => {
      return new Intl.NumberFormat('en-US').format(num);
    },

    // Compact: 1.2K, 1.5M, 2.3B
    compact: (num: number): string => {
      return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(num);
    },

    // Percentage: 45.6%
    percentage: (num: number, decimals = 1): string => {
      return `${num.toFixed(decimals)}%`;
    },

    // Currency: $1,234.56
    currency: (amount: number, currency = 'USD'): string => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency
      }).format(amount);
    },

    // Ordinal: 1st, 2nd, 3rd, 4th
    ordinal: (num: number): string => {
      const suffixes = ['th', 'st', 'nd', 'rd'];
      const remainder = num % 100;
      return num + (suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0]);
    }
  },

  // Text formatters
  text: {
    // Title case: "hello world" -> "Hello World"
    title: (str: string): string => {
      return str.replace(/\w\S*/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
    },

    // Sentence case: "hello world" -> "Hello world"
    sentence: (str: string): string => {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    // Truncate with ellipsis
    truncate: (str: string, length = 50, suffix = '...'): string => {
      if (str.length <= length) return str;
      return str.slice(0, length - suffix.length) + suffix;
    },

    // Slug: "Hello World!" -> "hello-world"
    slug: (str: string): string => {
      return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    },

    // Initials: "John Doe" -> "JD"
    initials: (name: string): string => {
      return name
        .split(' ')
        .map(part => part.charAt(0).toUpperCase())
        .join('')
        .slice(0, 2);
    }
  },

  // Application-specific formatters
  hazard: {
    // Format hazard type for display
    type: (type: HazardType): string => {
      const typeMap: Record<HazardType, string> = {
        TSUNAMI: 'Tsunami',
        STORM_SURGE: 'Storm Surge',
        HIGH_WAVES: 'High Waves',
        COASTAL_FLOODING: 'Coastal Flooding',
        ABNORMAL_TIDE: 'Abnormal Tide'
      };
      return typeMap[type] || type;
    },

    // Format severity with color indicator
    severity: (severity: Severity): { text: string; color: string; icon: string } => {
      const severityMap: Record<Severity, { text: string; color: string; icon: string }> = {
        LOW: { text: 'Low', color: 'green', icon: '🟢' },
        MEDIUM: { text: 'Medium', color: 'yellow', icon: '🟡' },
        HIGH: { text: 'High', color: 'red', icon: '🔴' }
      };
      return severityMap[severity] || { text: severity, color: 'gray', icon: '⚪' };
    },

    // Format status with appropriate styling
    status: (status: Status): { text: string; color: string; icon: string } => {
      const statusMap: Record<Status, { text: string; color: string; icon: string }> = {
        PENDING: { text: 'Pending Review', color: 'yellow', icon: '⏳' },
        VERIFIED: { text: 'Verified', color: 'green', icon: '✅' },
        INVESTIGATING: { text: 'Under Investigation', color: 'blue', icon: '🔍' },
        REJECTED: { text: 'Rejected', color: 'red', icon: '❌' }
      };
      return statusMap[status] || { text: status, color: 'gray', icon: '❓' };
    }
  },

  // User formatters
  user: {
    // Format user role
    role: (role: Role): string => {
      const roleMap: Record<Role, string> = {
        CITIZEN: 'Citizen',
        OFFICIAL: 'Government Official',
        ANALYST: 'Data Analyst'
      };
      return roleMap[role] || role;
    },

    // Format user display name
    displayName: (user: { name?: string; email: string }): string => {
      return user.name || user.email.split('@')[0];
    },

    // Format user avatar initials
    avatarInitials: (user: { name?: string; email: string }): string => {
      const displayName = user.name || user.email;
      return formatters.text.initials(displayName);
    }
  },

  // Location formatters
  location: {
    // Format coordinates: "40.7128° N, 74.0060° W"
    coordinates: (lat: number, lng: number): string => {
      const latDir = lat >= 0 ? 'N' : 'S';
      const lngDir = lng >= 0 ? 'E' : 'W';
      return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
    },

    // Format coordinates for maps: "40.7128, -74.0060"
    coordinatesMap: (lat: number, lng: number): string => {
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  },

  // File formatters
  file: {
    // Format file size: "1.5 MB"
    size: (bytes: number): string => {
      if (bytes === 0) return '0 Bytes';
      
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // Get file extension from filename
    extension: (filename: string): string => {
      return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
    }
  },

  // Array formatters
  array: {
    // Join with commas and "and": ["a", "b", "c"] -> "a, b, and c"
    join: (items: string[], conjunction = 'and'): string => {
      if (items.length === 0) return '';
      if (items.length === 1) return items[0];
      if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
      
      const last = items.pop();
      return `${items.join(', ')}, ${conjunction} ${last}`;
    },

    // Format count: "5 items"
    count: (count: number, singular: string, plural?: string): string => {
      const pluralForm = plural || `${singular}s`;
      return `${count} ${count === 1 ? singular : pluralForm}`;
    }
  }
};

// Export individual formatter categories for convenience
export const dateFormatters = formatters.date;
export const numberFormatters = formatters.number;
export const textFormatters = formatters.text;
export const hazardFormatters = formatters.hazard;
export const userFormatters = formatters.user;
export const locationFormatters = formatters.location;
export const fileFormatters = formatters.file;
export const arrayFormatters = formatters.array;

// Default export
export default formatters;
