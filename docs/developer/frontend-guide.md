# Frontend Development Guide

This guide covers the frontend development practices, patterns, and technologies used in the Smart CRM application.

## 📋 Table of Contents

1. [Tech Stack Overview](#tech-stack-overview)
2. [React Patterns](#react-patterns)
3. [TypeScript Usage](#typescript-usage)
4. [Styling with Tailwind CSS](#styling-with-tailwind-css)
5. [Component Architecture](#component-architecture)
6. [State Management](#state-management)
7. [Performance Optimization](#performance-optimization)
8. [Error Handling](#error-handling)
9. [Testing Guidelines](#testing-guidelines)
10. [Build Process](#build-process)

## 🛠️ Tech Stack Overview

### Core Technologies
- **React 18**: UI library with concurrent features
- **TypeScript**: Type-safe JavaScript development
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework

### Key Libraries
- **React Router**: Client-side routing
- **Lucide React**: Icon library
- **React Hook Form**: Form handling
- **Recharts**: Data visualization
- **Framer Motion**: Animations

### Development Tools
- **ESLint**: Code linting and quality
- **Prettier**: Code formatting
- **TypeScript Compiler**: Type checking

## ⚛️ React Patterns

### Component Structure

#### Functional Components with Hooks
```typescript
import React, { useState, useEffect } from 'react';

interface ComponentProps {
  title: string;
  onAction?: () => void;
}

export const ExampleComponent: React.FC<ComponentProps> = ({ 
  title, 
  onAction 
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Side effects here
  }, []);

  return (
    <div className="p-4">
      <h1>{title}</h1>
      {loading && <LoadingSpinner />}
    </div>
  );
};
```

#### Custom Hooks Pattern
```typescript
// hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue] as const;
};
```

### Context Providers

#### Example: Theme Context
```typescript
// contexts/ThemeContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

### Code Splitting with React.lazy()

#### Lazy Loading Components
```typescript
// App.tsx
import React, { Suspense } from 'react';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Lazy load heavy components
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const AITools = React.lazy(() => import('./pages/AITools'));
const Pipeline = React.lazy(() => import('./pages/Pipeline'));

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Routes>
        <Route 
          path="/dashboard" 
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <Dashboard />
            </Suspense>
          } 
        />
        <Route 
          path="/ai-tools" 
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <AITools />
            </Suspense>
          } 
        />
      </Routes>
    </ErrorBoundary>
  );
};
```

## 📝 TypeScript Usage

### Type Definitions

#### Interface vs Type
```typescript
// Use interfaces for object shapes that might be extended
interface User {
  id: string;
  name: string;
  email: string;
}

interface AdminUser extends User {
  permissions: string[];
}

// Use types for unions, primitives, or computed types
type Status = 'pending' | 'approved' | 'rejected';
type UserWithStatus = User & { status: Status };
```

#### Generic Types
```typescript
// Generic service response
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Generic hook return type
type UseApiReturn<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};
```

### Component Prop Types

#### Props with Children
```typescript
interface CardProps {
  title: string;
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  title, 
  variant = 'primary', 
  children, 
  onClick 
}) => {
  return (
    <div 
      className={`card card-${variant}`}
      onClick={onClick}
    >
      <h2>{title}</h2>
      {children}
    </div>
  );
};
```

#### Event Handler Types
```typescript
interface FormProps {
  onSubmit: (data: FormData) => void;
  onChange: (field: string, value: string) => void;
}

// For DOM events
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
  // Handle click
};

const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = event.target;
  // Handle change
};
```

## 🎨 Styling with Tailwind CSS

### Design System

#### Color Palette
```css
/* tailwind.config.js */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          500: '#6b7280',
          800: '#1f2937',
          900: '#111827',
        }
      }
    }
  }
}
```

#### Responsive Design
```typescript
export const ResponsiveCard: React.FC = () => {
  return (
    <div className="
      w-full 
      p-4 
      sm:p-6 
      md:p-8 
      lg:max-w-4xl 
      xl:max-w-6xl 
      mx-auto
      bg-white 
      dark:bg-gray-800
      rounded-lg 
      shadow-sm 
      border 
      border-gray-200 
      dark:border-gray-700
    ">
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">
        Responsive Card
      </h2>
    </div>
  );
};
```

### Component Styling Patterns

#### CSS Modules Alternative with Tailwind
```typescript
// Use object for conditional classes
const cardClasses = {
  base: 'rounded-lg shadow-sm border p-4',
  variants: {
    primary: 'bg-blue-50 border-blue-200 text-blue-900',
    secondary: 'bg-gray-50 border-gray-200 text-gray-900',
    danger: 'bg-red-50 border-red-200 text-red-900',
  }
};

interface AlertProps {
  variant: keyof typeof cardClasses.variants;
  children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({ variant, children }) => {
  return (
    <div className={`${cardClasses.base} ${cardClasses.variants[variant]}`}>
      {children}
    </div>
  );
};
```

#### Dark Mode Support
```typescript
export const ThemeAwareComponent: React.FC = () => {
  return (
    <div className="
      bg-white dark:bg-gray-900
      text-gray-900 dark:text-gray-100
      border-gray-200 dark:border-gray-700
    ">
      <button className="
        bg-blue-500 hover:bg-blue-600
        dark:bg-blue-600 dark:hover:bg-blue-700
        text-white
        px-4 py-2 rounded
        transition-colors duration-200
      ">
        Theme Aware Button
      </button>
    </div>
  );
};
```

## 🏗️ Component Architecture

### Folder Structure by Feature
```
src/components/
├── aiTools/                   # AI-related components
│   ├── AIGoalsPanel.tsx
│   ├── CompetitorAnalysis.tsx
│   └── index.ts               # Barrel export
├── common/                    # Shared components
│   ├── ErrorBoundary.tsx
│   ├── LoadingSpinner.tsx
│   └── Layout.tsx
├── dashboard/                 # Dashboard-specific
│   ├── StatsCards.tsx
│   ├── ChartsSection.tsx
│   └── QuickActions.tsx
└── ui/                        # Core UI components
    ├── Button.tsx
    ├── Card.tsx
    └── Modal.tsx
```

### Component Composition

#### Compound Components Pattern
```typescript
// Modal compound component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

interface ModalHeaderProps {
  children: React.ReactNode;
}

interface ModalBodyProps {
  children: React.ReactNode;
}

interface ModalFooterProps {
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> & {
  Header: React.FC<ModalHeaderProps>;
  Body: React.FC<ModalBodyProps>;
  Footer: React.FC<ModalFooterProps>;
} = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50">
      <div className="relative p-8 bg-white max-w-md mx-auto mt-20 rounded">
        <button onClick={onClose} className="absolute top-2 right-2">×</button>
        {children}
      </div>
    </div>
  );
};

Modal.Header = ({ children }) => (
  <div className="mb-4 text-xl font-semibold">{children}</div>
);

Modal.Body = ({ children }) => (
  <div className="mb-4">{children}</div>
);

Modal.Footer = ({ children }) => (
  <div className="flex justify-end space-x-2">{children}</div>
);

// Usage
<Modal isOpen={isOpen} onClose={closeModal}>
  <Modal.Header>Confirm Action</Modal.Header>
  <Modal.Body>Are you sure you want to proceed?</Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={closeModal}>Cancel</Button>
    <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
  </Modal.Footer>
</Modal>
```

### Higher-Order Components (HOCs)

#### withErrorBoundary HOC
```typescript
interface WithErrorBoundaryProps {
  fallback?: React.ComponentType<{ error: Error }>;
}

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: Error }>
) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// Usage
const SafeAIGoalsPanel = withErrorBoundary(AIGoalsPanel);
```

## 🔄 State Management

### React Context for Global State
```typescript
// contexts/AppContext.tsx
interface AppState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface AppContextType extends AppState {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [state, setState] = useState<AppState>({
    user: null,
    loading: false,
    error: null,
  });

  const setUser = (user: User | null) => {
    setState(prev => ({ ...prev, user }));
  };

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return (
    <AppContext.Provider value={{
      ...state,
      setUser,
      setLoading,
      setError,
      clearError,
    }}>
      {children}
    </AppContext.Provider>
  );
};
```

### useReducer for Complex State
```typescript
// hooks/useGoalState.ts
interface Goal {
  id: string;
  title: string;
  completed: boolean;
  category: string;
}

type GoalAction = 
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'TOGGLE_GOAL'; payload: string }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'SET_GOALS'; payload: Goal[] };

const goalReducer = (state: Goal[], action: GoalAction): Goal[] => {
  switch (action.type) {
    case 'ADD_GOAL':
      return [...state, action.payload];
    case 'TOGGLE_GOAL':
      return state.map(goal =>
        goal.id === action.payload
          ? { ...goal, completed: !goal.completed }
          : goal
      );
    case 'DELETE_GOAL':
      return state.filter(goal => goal.id !== action.payload);
    case 'SET_GOALS':
      return action.payload;
    default:
      return state;
  }
};

export const useGoalState = () => {
  const [goals, dispatch] = useReducer(goalReducer, []);

  const addGoal = (goal: Goal) => {
    dispatch({ type: 'ADD_GOAL', payload: goal });
  };

  const toggleGoal = (id: string) => {
    dispatch({ type: 'TOGGLE_GOAL', payload: id });
  };

  const deleteGoal = (id: string) => {
    dispatch({ type: 'DELETE_GOAL', payload: id });
  };

  const setGoals = (goals: Goal[]) => {
    dispatch({ type: 'SET_GOALS', payload: goals });
  };

  return { goals, addGoal, toggleGoal, deleteGoal, setGoals };
};
```

## ⚡ Performance Optimization

### Memoization Strategies

#### React.memo for Component Memoization
```typescript
interface ExpensiveComponentProps {
  data: ComplexData[];
  onItemClick: (id: string) => void;
}

const ExpensiveComponent = React.memo<ExpensiveComponentProps>(({ 
  data, 
  onItemClick 
}) => {
  return (
    <div>
      {data.map(item => (
        <div key={item.id} onClick={() => onItemClick(item.id)}>
          {item.name}
        </div>
      ))}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function
  return (
    prevProps.data.length === nextProps.data.length &&
    prevProps.onItemClick === nextProps.onItemClick
  );
});
```

#### useMemo and useCallback
```typescript
const OptimizedComponent: React.FC<{ items: Item[] }> = ({ items }) => {
  // Memoize expensive calculations
  const expensiveValue = useMemo(() => {
    return items.reduce((acc, item) => acc + item.value, 0);
  }, [items]);

  // Memoize callback functions
  const handleClick = useCallback((id: string) => {
    // Handle click logic
    console.log('Clicked item:', id);
  }, []);

  // Memoize filtered data
  const filteredItems = useMemo(() => {
    return items.filter(item => item.active);
  }, [items]);

  return (
    <div>
      <div>Total Value: {expensiveValue}</div>
      {filteredItems.map(item => (
        <div key={item.id} onClick={() => handleClick(item.id)}>
          {item.name}
        </div>
      ))}
    </div>
  );
};
```

### Virtual Scrolling for Large Lists
```typescript
// For very large datasets, consider react-window
import { FixedSizeList as List } from 'react-window';

interface VirtualListProps {
  items: any[];
  height: number;
  itemHeight: number;
}

const VirtualList: React.FC<VirtualListProps> = ({ 
  items, 
  height, 
  itemHeight 
}) => {
  const Row = ({ index, style }: { index: number; style: any }) => (
    <div style={style}>
      <div className="p-2 border-b">
        {items[index].name}
      </div>
    </div>
  );

  return (
    <List
      height={height}
      itemCount={items.length}
      itemSize={itemHeight}
    >
      {Row}
    </List>
  );
};
```

## 🚨 Error Handling

### Error Boundaries
```typescript
// components/common/ErrorBoundary.tsx
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to external service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h2 className="text-red-800 font-semibold">Something went wrong</h2>
          <details className="mt-2 text-red-600">
            <summary>Error details</summary>
            <pre className="mt-2 text-sm">
              {this.state.error?.message}
            </pre>
          </details>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Async Error Handling
```typescript
// hooks/useAsyncError.ts
export const useAsyncError = () => {
  const [, setError] = useState();
  return useCallback(
    (error: Error) => {
      setError(() => {
        throw error;
      });
    },
    [setError]
  );
};

// Usage in async operations
const MyComponent: React.FC = () => {
  const throwError = useAsyncError();

  const handleAsyncOperation = async () => {
    try {
      await riskyAsyncOperation();
    } catch (error) {
      throwError(error as Error);
    }
  };

  return <button onClick={handleAsyncOperation}>Do Something</button>;
};
```

## 🧪 Testing Guidelines

### Component Testing with React Testing Library
```typescript
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct CSS classes', () => {
    render(<Button variant="primary">Primary Button</Button>);
    const button = screen.getByText('Primary Button');
    expect(button).toHaveClass('btn-primary');
  });
});
```

### Custom Hook Testing
```typescript
// __tests__/hooks/useLocalStorage.test.ts
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../hooks/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with default value', () => {
    const { result } = renderHook(() => useLocalStorage('test', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test', 'initial'));
    
    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem('test')).toBe('"updated"');
  });
});
```

## 🏗️ Build Process

### Vite Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react', 'framer-motion'],
          charts: ['recharts'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    open: true,
  },
});
```

### Environment Variables
```typescript
// src/config/env.ts
interface Config {
  supabaseUrl: string;
  supabaseKey: string;
  openaiApiKey: string;
  geminiApiKey: string;
}

const config: Config = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY,
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY,
};

// Validate required environment variables
const requiredEnvVars = Object.entries(config);
for (const [key, value] of requiredEnvVars) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export default config;
```

## 📚 Best Practices Summary

### Do's ✅
- Use TypeScript for type safety
- Implement proper error boundaries
- Optimize performance with React.memo, useMemo, useCallback
- Use semantic HTML and accessibility features
- Follow consistent naming conventions
- Write tests for critical components
- Use lazy loading for large components
- Implement proper loading states

### Don'ts ❌
- Don't mutate props or state directly
- Don't use index as key in dynamic lists
- Don't ignore console warnings
- Don't skip error handling
- Don't optimize prematurely
- Don't use any type in TypeScript
- Don't forget to cleanup effects
- Don't ignore accessibility

## 🔗 Related Documentation

- [Project Structure](./project-structure.md) - Understanding the codebase organization
- [Supabase Integration](./supabase-integration.md) - Backend integration patterns
- [AI Integration](./ai-integration.md) - AI services and components
- [Code Standards](./code-standards.md) - Coding conventions and quality guidelines
