import { memo, ReactElement, Suspense } from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

interface LazyComponentProps {
  children: ReactElement;
  fallback?: ReactElement;
  height?: number | string;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

// Loading Skeleton Component
const DefaultSkeleton = memo<{ height?: number | string }>(({ height = 200 }) => (
  <div 
    className="animate-pulse bg-gray-200 rounded-lg"
    style={{ height: typeof height === 'number' ? `${height}px` : height }}
  >
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
    </div>
  </div>
));

DefaultSkeleton.displayName = 'DefaultSkeleton';

// Lazy Component Wrapper with Intersection Observer
const LazyComponent = memo<LazyComponentProps>(({
  children,
  fallback,
  height = 200,
  className = '',
  threshold = 0.1,
  rootMargin = '100px',
  triggerOnce = true
}) => {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce
  });

  const containerStyle = {
    height: typeof height === 'number' ? `${height}px` : height,
    minHeight: typeof height === 'number' ? `${height}px` : height
  };

  return (
    <div 
      ref={ref} 
      className={`lazy-component-container ${className}`}
      style={containerStyle}
    >
      {isIntersecting ? (
        <Suspense fallback={fallback || <DefaultSkeleton height={height} />}>
          {children}
        </Suspense>
      ) : (
        fallback || <DefaultSkeleton height={height} />
      )}
    </div>
  );
});

LazyComponent.displayName = 'LazyComponent';

export default LazyComponent;
