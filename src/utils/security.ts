import { useState, useEffect } from 'react';

// Security configuration
export interface SecurityConfig {
  sessionTimeout?: number;
  maxLoginAttempts?: number;
  passwordMinLength?: number;
  enableCSRF?: boolean;
  enableXSS?: boolean;
}

// Default security configuration
const DEFAULT_CONFIG: SecurityConfig = {
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  maxLoginAttempts: 5,
  passwordMinLength: 8,
  enableCSRF: true,
  enableXSS: true
};

// Input sanitization utilities
export class SecurityUtils {
  private static config: SecurityConfig = DEFAULT_CONFIG;

  static configure(config: Partial<SecurityConfig>): void {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // XSS Prevention
  static sanitizeHTML(input: string): string {
    if (!this.config.enableXSS) return input;

    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  static escapeHTML(input: string): string {
    const escapeMap: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    };

    return input.replace(/[&<>"'/]/g, (match) => escapeMap[match]);
  }

  static stripTags(input: string): string {
    return input.replace(/<[^>]*>/g, '');
  }

  // SQL Injection Prevention
  static sanitizeSQL(input: string): string {
    // Remove dangerous SQL keywords and characters
    const dangerous = [
      'DROP', 'DELETE', 'INSERT', 'UPDATE', 'CREATE', 'ALTER',
      'EXEC', 'EXECUTE', 'UNION', 'SELECT', 'FROM', 'WHERE',
      '--', ';', "'", '"', '\\', '%', '_'
    ];

    let sanitized = input;
    dangerous.forEach(keyword => {
      const regex = new RegExp(keyword, 'gi');
      sanitized = sanitized.replace(regex, '');
    });

    return sanitized.trim();
  }

  // Input validation
  static validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const minLength = this.config.passwordMinLength || 8;

    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters long`);
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Check for common weak passwords
    const commonPasswords = [
      'password', '123456', 'password123', 'admin', 'qwerty',
      'letmein', 'welcome', 'monkey', '1234567890'
    ];

    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validatePhoneNumber(phone: string): boolean {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // Check if it's a valid length (10-15 digits)
    return digits.length >= 10 && digits.length <= 15;
  }

  static validateURL(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  // Simple encryption using base64 and basic transformations
  static encrypt(data: string): string {
    // Simple base64 encoding with character transformation
    const encoded = btoa(data);
    return encoded.split('').reverse().join('');
  }

  static decrypt(encryptedData: string): string {
    try {
      const reversed = encryptedData.split('').reverse().join('');
      return atob(reversed);
    } catch {
      throw new Error('Failed to decrypt data');
    }
  }

  // Simple hash function using built-in crypto
  static async hashPassword(password: string): Promise<string> {
    if (crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(password + 'salt'); // Simple salt
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } else {
      // Fallback for environments without crypto.subtle
      return btoa(password).split('').reverse().join('');
    }
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      const computedHash = await this.hashPassword(password);
      return computedHash === hashedPassword;
    } catch {
      return false;
    }
  }

  // Session management
  static generateSessionToken(): string {
    if (crypto.getRandomValues) {
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    } else {
      // Fallback
      return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
  }

  static isSessionExpired(timestamp: number): boolean {
    const now = Date.now();
    const sessionTimeout = this.config.sessionTimeout || 30 * 60 * 1000;
    return (now - timestamp) > sessionTimeout;
  }

  // CSRF Protection
  static generateCSRFToken(): string {
    if (!this.config.enableCSRF) return '';
    return this.generateSessionToken();
  }

  static validateCSRFToken(token: string, expectedToken: string): boolean {
    if (!this.config.enableCSRF) return true;
    return token === expectedToken;
  }

  // Rate limiting
  static checkRateLimit(identifier: string, maxAttempts: number = 10, windowMs: number = 60000): boolean {
    const key = `rate_limit_${identifier}`;
    const now = Date.now();
    const attempts = JSON.parse(localStorage.getItem(key) || '[]') as number[];
    
    // Remove attempts older than the window
    const recentAttempts = attempts.filter(timestamp => (now - timestamp) < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      return false;
    }
    
    // Add current attempt
    recentAttempts.push(now);
    localStorage.setItem(key, JSON.stringify(recentAttempts));
    
    return true;
  }

  // Login attempt tracking
  static trackLoginAttempt(identifier: string): boolean {
    const maxAttempts = this.config.maxLoginAttempts || 5;
    return this.checkRateLimit(`login_${identifier}`, maxAttempts, 15 * 60 * 1000); // 15 minutes
  }

  static resetLoginAttempts(identifier: string): void {
    const key = `rate_limit_login_${identifier}`;
    localStorage.removeItem(key);
  }

  // Content Security Policy helpers
  static generateNonce(): string {
    return this.generateSessionToken().substring(0, 16);
  }

  // File upload security
  static validateFileType(file: File, allowedTypes: string[]): boolean {
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    
    // Check MIME type
    if (!allowedTypes.includes(fileType)) {
      return false;
    }
    
    // Check file extension
    const extension = fileName.split('.').pop();
    const allowedExtensions = allowedTypes.map(type => {
      const mimeToExt: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/webp': 'webp',
        'application/pdf': 'pdf',
        'text/plain': 'txt',
        'application/msword': 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'
      };
      return mimeToExt[type];
    }).filter(Boolean);
    
    return extension ? allowedExtensions.includes(extension) : false;
  }

  static validateFileSize(file: File, maxSizeMB: number): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }

  // Data privacy helpers
  static maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (local.length <= 2) return email;
    
    const masked = local.charAt(0) + '*'.repeat(local.length - 2) + local.charAt(local.length - 1);
    return `${masked}@${domain}`;
  }

  static maskPhoneNumber(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 4) return phone;
    
    const masked = digits.slice(0, 3) + '*'.repeat(digits.length - 6) + digits.slice(-3);
    return phone.replace(/\d/g, (digit, index) => {
      const digitIndex = phone.slice(0, index + 1).replace(/\D/g, '').length - 1;
      return masked[digitIndex] || digit;
    });
  }

  static maskCreditCard(cardNumber: string): string {
    const digits = cardNumber.replace(/\D/g, '');
    if (digits.length < 8) return cardNumber;
    
    const masked = '*'.repeat(digits.length - 4) + digits.slice(-4);
    return cardNumber.replace(/\d/g, (digit, index) => {
      const digitIndex = cardNumber.slice(0, index + 1).replace(/\D/g, '').length - 1;
      return masked[digitIndex] || digit;
    });
  }

  // Secure storage helpers
  static secureStore(key: string, value: any, encrypt: boolean = true): void {
    const data = JSON.stringify(value);
    const storageValue = encrypt ? this.encrypt(data) : data;
    
    // Use sessionStorage for sensitive data by default
    sessionStorage.setItem(key, storageValue);
  }

  static secureRetrieve(key: string, encrypted: boolean = true): any {
    const stored = sessionStorage.getItem(key);
    if (!stored) return null;
    
    try {
      const data = encrypted ? this.decrypt(stored) : stored;
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  static secureRemove(key: string): void {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  }

  // Security audit helpers
  static auditSecurityHeaders(): Record<string, boolean> {
    const headers = {
      'Content-Security-Policy': false,
      'X-Frame-Options': false,
      'X-Content-Type-Options': false,
      'Strict-Transport-Security': false,
      'Referrer-Policy': false
    };

    // This would typically be checked on the server side
    // Here we can only check what's available in the browser
    return headers;
  }

  static detectSuspiciousActivity(activities: string[]): boolean {
    const suspiciousPatterns = [
      /script.*?>/i,
      /javascript:/i,
      /data:text\/html/i,
      /vbscript:/i,
      /on\w+\s*=/i
    ];

    return activities.some(activity => 
      suspiciousPatterns.some(pattern => pattern.test(activity))
    );
  }
}

// Hook for security context
export const useSecurityContext = () => {
  const [csrfToken, setCSRFToken] = useState<string>('');
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    // Generate CSRF token
    const token = SecurityUtils.generateCSRFToken();
    setCSRFToken(token);

    // Check session expiration
    const lastActivity = localStorage.getItem('last_activity');
    if (lastActivity) {
      const expired = SecurityUtils.isSessionExpired(parseInt(lastActivity));
      setSessionExpired(expired);
    }

    // Set up session timeout
    const handleActivity = () => {
      localStorage.setItem('last_activity', Date.now().toString());
      setSessionExpired(false);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, []);

  return {
    csrfToken,
    sessionExpired,
    utils: SecurityUtils
  };
};

export default SecurityUtils;
