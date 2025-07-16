// Logger service for consistent logging across the application
class LoggerService {
  info(message: string, context?: unknown): void {
    console.info(`[INFO] ${message}`, context || '');
  }

  error(message: string, error?: Error, context?: unknown): void {
    console.error(`[ERROR] ${message}`, error || '', context || '');
  }

  warn(message: string, context?: unknown): void {
    console.warn(`[WARN] ${message}`, context || '');
  }

  debug(message: string, context?: unknown): void {
    console.debug(`[DEBUG] ${message}`, context || '');
  }
}

export const logger = new LoggerService();