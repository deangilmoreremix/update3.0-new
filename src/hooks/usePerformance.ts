import { useState, useEffect, useRef, useCallback } from 'react';

// Performance metrics interface
export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  firstInputDelay?: number;
}

// Hook for tracking component performance
export const usePerformanceMonitor = (componentName: string) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const startTimeRef = useRef<number>(performance.now());
  const renderStartRef = useRef<number>(performance.now());

  useEffect(() => {
    const loadTime = performance.now() - startTimeRef.current;
    const renderTime = performance.now() - renderStartRef.current;

    // Get memory usage if available
    const memoryUsage = (performance as any).memory?.usedJSHeapSize;

    // Get web vitals if available
    const webVitals: Partial<PerformanceMetrics> = {};
    
    if ('getEntriesByType' in performance) {
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      
      if (fcpEntry) {
        webVitals.firstContentfulPaint = fcpEntry.startTime;
      }
    }

    const newMetrics: PerformanceMetrics = {
      loadTime,
      renderTime,
      memoryUsage,
      ...webVitals
    };

    setMetrics(newMetrics);

    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🔍 Performance Metrics - ${componentName}`);
      console.log(`Load Time: ${loadTime.toFixed(2)}ms`);
      console.log(`Render Time: ${renderTime.toFixed(2)}ms`);
      if (memoryUsage) {
        console.log(`Memory Usage: ${(memoryUsage / 1024 / 1024).toFixed(2)}MB`);
      }
      console.groupEnd();
    }
  }, [componentName]);

  return metrics;
};

// Hook for code splitting and lazy loading
export const useLazyComponent = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) => {
  const [Component, setComponent] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadComponent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const module = await importFn();
        
        if (mounted) {
          setComponent(() => module.default);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to load component'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadComponent();

    return () => {
      mounted = false;
    };
  }, [importFn]);

  return { Component, loading, error };
};

// Hook for image lazy loading with intersection observer
export const useImageLazyLoading = (threshold = 0.1) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const current = imgRef.current;
    if (!current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsIntersecting(true);
          setHasLoaded(true);
          observer.unobserve(current);
        }
      },
      { threshold }
    );

    observer.observe(current);

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [threshold, hasLoaded]);

  return { imgRef, shouldLoad: isIntersecting || hasLoaded };
};

// Hook for debouncing expensive operations
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook for throttling operations
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastRun = useRef<number>(Date.now());

  return useCallback(
    ((...args: Parameters<T>) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    }) as T,
    [callback, delay]
  );
};

// Hook for measuring viewport performance
export const useViewportPerformance = () => {
  const [metrics, setMetrics] = useState({
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio,
    connectionType: (navigator as any).connection?.effectiveType || 'unknown'
  });

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics({
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
        connectionType: (navigator as any).connection?.effectiveType || 'unknown'
      });
    };

    window.addEventListener('resize', updateMetrics);
    window.addEventListener('orientationchange', updateMetrics);

    // Listen for connection changes
    if ('connection' in navigator) {
      (navigator as any).connection.addEventListener('change', updateMetrics);
    }

    return () => {
      window.removeEventListener('resize', updateMetrics);
      window.removeEventListener('orientationchange', updateMetrics);
      
      if ('connection' in navigator) {
        (navigator as any).connection.removeEventListener('change', updateMetrics);
      }
    };
  }, []);

  return metrics;
};

// Performance optimization utilities
export const performanceUtils = {
  // Preload a route
  preloadRoute: async (routeImport: () => Promise<any>) => {
    try {
      await routeImport();
    } catch (error) {
      console.warn('Failed to preload route:', error);
    }
  },

  // Measure function execution time
  measureAsync: async <T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<T> => {
    const start = performance.now();
    try {
      const result = await fn();
      const end = performance.now();
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⚡ ${name}: ${(end - start).toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const end = performance.now();
      
      if (process.env.NODE_ENV === 'development') {
        console.error(`❌ ${name} failed after ${(end - start).toFixed(2)}ms:`, error);
      }
      
      throw error;
    }
  },

  // Check if the user prefers reduced motion
  prefersReducedMotion: () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Get optimal image format
  getOptimalImageFormat: () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return 'jpg';
    
    // Check WebP support
    if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
      return 'webp';
    }
    
    // Check AVIF support
    if (canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0) {
      return 'avif';
    }
    
    return 'jpg';
  }
};
