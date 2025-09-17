/**
 * Simple logger utility for development and production
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
}

class Logger {
  private isDevelopment: boolean;
  private logs: LogEntry[] = [];

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  private createLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.isDevelopment) return true;
    
    // In production, only log warnings and errors
    return level === 'warn' || level === 'error';
  }

  debug(message: string, data?: any): void {
    if (!this.shouldLog('debug')) return;
    
    const entry = this.createLogEntry('debug', message, data);
    this.logs.push(entry);
    console.debug(`[DEBUG] ${message}`, data || '');
  }

  info(message: string, data?: any): void {
    if (!this.shouldLog('info')) return;
    
    const entry = this.createLogEntry('info', message, data);
    this.logs.push(entry);
    console.info(`[INFO] ${message}`, data || '');
  }

  warn(message: string, data?: any): void {
    if (!this.shouldLog('warn')) return;
    
    const entry = this.createLogEntry('warn', message, data);
    this.logs.push(entry);
    console.warn(`[WARN] ${message}`, data || '');
  }

  error(message: string, error?: Error | any): void {
    if (!this.shouldLog('error')) return;
    
    const entry = this.createLogEntry('error', message, error);
    this.logs.push(entry);
    console.error(`[ERROR] ${message}`, error || '');
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }

  // Send logs to external service (in production)
  async sendLogs(): Promise<void> {
    if (this.isDevelopment || this.logs.length === 0) return;

    try {
      // This would send logs to your logging service
      // Example: Sentry, LogRocket, or custom endpoint
      console.log('Sending logs to external service...', this.logs);
      
      // After successful send, clear logs
      this.clearLogs();
    } catch (error) {
      console.error('Failed to send logs:', error);
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export default for convenience
export default logger;
