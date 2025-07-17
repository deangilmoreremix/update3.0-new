import { useState, useCallback } from 'react';

export type ValidationRule<T = any> = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  phone?: boolean;
  url?: boolean;
  min?: number;
  max?: number;
  custom?: (value: T) => string | null;
  message?: string;
};

export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export type FormValidationSchema<T> = Partial<Record<keyof T, ValidationRule>>;

export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  validationSchema?: FormValidationSchema<T>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors<T>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((name: keyof T, value: any): string | null => {
    if (!validationSchema || !validationSchema[name]) return null;

    const rules = validationSchema[name]!;

    // Required validation
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return rules.message || `${String(name)} is required`;
    }

    // Skip other validations if value is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return null;
    }

    // String validations
    if (typeof value === 'string') {
      // Min length
      if (rules.minLength && value.length < rules.minLength) {
        return rules.message || `${String(name)} must be at least ${rules.minLength} characters`;
      }

      // Max length
      if (rules.maxLength && value.length > rules.maxLength) {
        return rules.message || `${String(name)} must be no more than ${rules.maxLength} characters`;
      }

      // Email validation
      if (rules.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return rules.message || `${String(name)} must be a valid email address`;
        }
      }

      // Phone validation
      if (rules.phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
          return rules.message || `${String(name)} must be a valid phone number`;
        }
      }

      // URL validation
      if (rules.url) {
        try {
          new URL(value);
        } catch {
          return rules.message || `${String(name)} must be a valid URL`;
        }
      }

      // Pattern validation
      if (rules.pattern && !rules.pattern.test(value)) {
        return rules.message || `${String(name)} format is invalid`;
      }
    }

    // Number validations
    if (typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        return rules.message || `${String(name)} must be at least ${rules.min}`;
      }

      if (rules.max !== undefined && value > rules.max) {
        return rules.message || `${String(name)} must be no more than ${rules.max}`;
      }
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(value);
      if (customError) {
        return customError;
      }
    }

    return null;
  }, [validationSchema]);

  const validateForm = useCallback((): boolean => {
    if (!validationSchema) return true;

    const newErrors: ValidationErrors<T> = {};
    let isValid = true;

    Object.keys(validationSchema).forEach((key) => {
      const error = validateField(key as keyof T, values[key as keyof T]);
      if (error) {
        newErrors[key as keyof T] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validateField, validationSchema]);

  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));

    // Validate field on change if it has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error || undefined
      }));
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field on blur
    const error = validateField(name, values[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error || undefined
    }));
  }, [values, validateField]);

  const handleSubmit = useCallback(async (
    onSubmit: (values: T) => Promise<void> | void
  ) => {
    setIsSubmitting(true);
    
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {} as Partial<Record<keyof T, boolean>>);
    setTouched(allTouched);

    try {
      const isValid = validateForm();
      
      if (isValid) {
        await onSubmit(values);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm]);

  const reset = useCallback((newValues?: Partial<T>) => {
    setValues(newValues ? { ...initialValues, ...newValues } : initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const setFieldValue = useCallback((name: keyof T, value: any) => {
    handleChange(name, value);
  }, [handleChange]);

  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  const clearFieldError = useCallback((name: keyof T) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    validateForm,
    reset,
    setFieldValue,
    setFieldError,
    clearFieldError,
    isValid: Object.keys(errors).length === 0
  };
};

// Common validation schemas
export const commonValidations = {
  email: {
    required: true,
    email: true,
    message: 'Please enter a valid email address'
  } as ValidationRule,
  
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
  } as ValidationRule,
  
  phone: {
    phone: true,
    message: 'Please enter a valid phone number'
  } as ValidationRule,
  
  url: {
    url: true,
    message: 'Please enter a valid URL'
  } as ValidationRule,
  
  required: {
    required: true
  } as ValidationRule,
  
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
    message: 'Name must contain only letters and spaces'
  } as ValidationRule
};
