# Code Standards and Guidelines

This document outlines the coding standards, conventions, and quality guidelines for the Smart CRM project to ensure consistency, maintainability, and quality across the codebase.

## 📋 Table of Contents

1. [General Principles](#general-principles)
2. [TypeScript Standards](#typescript-standards)
3. [React Component Guidelines](#react-component-guidelines)
4. [File Organization](#file-organization)
5. [Naming Conventions](#naming-conventions)
6. [Code Formatting](#code-formatting)
7. [Documentation Standards](#documentation-standards)
8. [Error Handling](#error-handling)
9. [Performance Guidelines](#performance-guidelines)
10. [Security Considerations](#security-considerations)

## 🎯 General Principles

### Clean Code Principles
- **Readability First**: Code should be self-documenting and easy to understand
- **Single Responsibility**: Each function/class should have one clear purpose
- **DRY (Don't Repeat Yourself)**: Avoid code duplication through abstraction
- **KISS (Keep It Simple, Stupid)**: Prefer simple solutions over complex ones
- **YAGNI (You Aren't Gonna Need It)**: Don't implement features until they're needed

### Code Quality Standards
- All code must pass ESLint and TypeScript checks
- Maintain minimum 80% test coverage for critical features
- Follow established patterns and conventions
- Write meaningful commit messages
- Use descriptive variable and function names

## 📝 TypeScript Standards

### Type Definitions

#### Interface Design
```typescript
// ✅ Good: Descriptive interface with clear purpose
interface UserProfile {
  readonly id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  lastLoginAt: Date;
  preferences: UserPreferences;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
}

// ❌ Bad: Vague interface with unclear types
interface User {
  id: any;
  data: object;
  stuff: any[];
}
```

#### Generic Types
```typescript
// ✅ Good: Well-defined generic with constraints
interface ApiResponse<T extends Record<string, unknown>> {
  data: T;
  success: boolean;
  message?: string;
  errors?: ValidationError[];
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Usage
type UserListResponse = PaginatedResponse<UserProfile>;
```

#### Union Types and Discriminated Unions
```typescript
// ✅ Good: Discriminated union for type safety
interface LoadingState {
  status: 'loading';
}

interface SuccessState {
  status: 'success';
  data: any;
}

interface ErrorState {
  status: 'error';
  error: string;
}

type AsyncState = LoadingState | SuccessState | ErrorState;

// Usage with type guards
function handleState(state: AsyncState) {
  switch (state.status) {
    case 'loading':
      return <LoadingSpinner />;
    case 'success':
      return <DataDisplay data={state.data} />;
    case 'error':
      return <ErrorMessage error={state.error} />;
  }
}
```

### Type Safety Rules

#### Strict TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  }
}
```

#### Avoid `any` Type
```typescript
// ✅ Good: Proper typing
interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

function handleApiError(error: ApiError): void {
  console.error(`API Error ${error.code}: ${error.message}`);
}

// ❌ Bad: Using any
function handleApiError(error: any): void {
  console.error(error.whatever);
}
```

#### Use Type Assertions Carefully
```typescript
// ✅ Good: Safe type assertion with validation
function isUser(obj: unknown): obj is UserProfile {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'email' in obj &&
    typeof (obj as any).id === 'string' &&
    typeof (obj as any).email === 'string'
  );
}

function processUser(data: unknown): void {
  if (isUser(data)) {
    // Now data is safely typed as UserProfile
    console.log(`Processing user: ${data.email}`);
  }
}

// ❌ Bad: Unsafe type assertion
function processUser(data: unknown): void {
  const user = data as UserProfile; // Dangerous!
  console.log(user.email); // Could crash
}
```

## ⚛️ React Component Guidelines

### Component Structure

#### Functional Components with TypeScript
```typescript
// ✅ Good: Well-structured component
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface UserCardProps {
  userId: string;
  showActions?: boolean;
  onUserUpdate?: (user: UserProfile) => void;
  className?: string;
}

export const UserCard: React.FC<UserCardProps> = ({
  userId,
  showActions = true,
  onUserUpdate,
  className = '',
}) => {
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await UserService.getById(userId);
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleUpdate = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const updatedUser = await UserService.update(user.id, updates);
      setUser(updatedUser);
      onUserUpdate?.(updatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    }
  }, [user, onUserUpdate]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 ${className}`}>
      <div className="flex items-center space-x-3">
        <img
          src={user.avatarUrl || '/default-avatar.png'}
          alt={user.fullName}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h3 className="font-medium text-gray-900">{user.fullName}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      </div>

      {showActions && currentUser?.id === user.id && (
        <div className="mt-4 flex space-x-2">
          <button
            onClick={() => handleUpdate({ fullName: 'Updated Name' })}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};
```

### Component Patterns

#### Compound Components
```typescript
// ✅ Good: Compound component pattern
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

interface ModalComponent extends React.FC<ModalProps> {
  Header: React.FC<{ children: React.ReactNode }>;
  Body: React.FC<{ children: React.ReactNode }>;
  Footer: React.FC<{ children: React.ReactNode }>;
}

const Modal: ModalComponent = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50">
      <div className="relative p-8 bg-white max-w-md mx-auto mt-20 rounded">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
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

export { Modal };
```

#### Custom Hooks
```typescript
// ✅ Good: Reusable custom hook
interface UseApiOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useApi<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList = [],
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(options.initialData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetcher();
      setData(result);
      options.onSuccess?.(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      options.onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setLoading(false);
    }
  }, [fetcher, options]);

  useEffect(() => {
    fetchData();
  }, deps);

  return { data, loading, error, refetch: fetchData };
}
```

### Performance Guidelines

#### Memoization Best Practices
```typescript
// ✅ Good: Proper memoization
const ExpensiveComponent = React.memo<{ items: Item[] }>(({ items }) => {
  const expensiveValue = useMemo(() => {
    return items.reduce((acc, item) => acc + item.calculateComplexValue(), 0);
  }, [items]);

  const handleItemClick = useCallback((id: string) => {
    // Handle click
  }, []);

  return (
    <div>
      <div>Total: {expensiveValue}</div>
      {items.map(item => (
        <ItemComponent
          key={item.id}
          item={item}
          onClick={handleItemClick}
        />
      ))}
    </div>
  );
});

// ❌ Bad: Unnecessary re-renders
const ExpensiveComponent: React.FC<{ items: Item[] }> = ({ items }) => {
  // Recalculated on every render
  const expensiveValue = items.reduce((acc, item) => acc + item.calculateComplexValue(), 0);

  // New function on every render
  const handleItemClick = (id: string) => {
    // Handle click
  };

  return (
    <div>
      <div>Total: {expensiveValue}</div>
      {items.map(item => (
        <ItemComponent
          key={item.id}
          item={item}
          onClick={handleItemClick} // Causes re-render of all items
        />
      ))}
    </div>
  );
};
```

## 📁 File Organization

### Directory Structure
```
src/
├── components/           # React components
│   ├── common/          # Shared components
│   ├── ui/              # Basic UI components
│   └── feature/         # Feature-specific components
├── contexts/            # React contexts
├── hooks/              # Custom hooks
├── services/           # Business logic and API calls
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── config/             # Configuration files
└── __tests__/          # Test files
```

### File Naming Conventions
```
// Components: PascalCase
UserProfile.tsx
AIGoalsPanel.tsx
NavigationBar.tsx

// Hooks: camelCase with 'use' prefix
useAuth.ts
useLocalStorage.ts
useApiCall.ts

// Services: camelCase with 'Service' suffix
userService.ts
authService.ts
supabaseService.ts

// Utilities: camelCase
formatDate.ts
validateEmail.ts
debounce.ts

// Types: camelCase
index.ts (for main types)
userTypes.ts
apiTypes.ts

// Constants: SCREAMING_SNAKE_CASE
API_ENDPOINTS.ts
ERROR_MESSAGES.ts
```

## 🏷️ Naming Conventions

### Variables and Functions
```typescript
// ✅ Good: Descriptive names
const userAuthenticationToken = generateAuthToken(user);
const isUserAuthenticated = checkUserAuthentication(token);
const fetchUserProfileData = async (userId: string) => { /* ... */ };

// ❌ Bad: Unclear abbreviations
const userAuthTkn = genAuthTkn(user);
const isAuth = checkAuth(tkn);
const fetchUsrData = async (id: string) => { /* ... */ };
```

### Components and Interfaces
```typescript
// ✅ Good: Clear, descriptive names
interface UserProfileData {
  id: string;
  personalInfo: PersonalInfo;
  accountSettings: AccountSettings;
}

interface UserProfileProps {
  userId: string;
  isEditable: boolean;
  onSave: (data: UserProfileData) => void;
}

const UserProfileComponent: React.FC<UserProfileProps> = ({ /* ... */ }) => {
  // Component implementation
};

// ❌ Bad: Generic or unclear names
interface Data {
  id: string;
  info: any;
  settings: object;
}

interface Props {
  id: string;
  editable: boolean;
  onSave: (data: any) => void;
}
```

### Constants and Enums
```typescript
// ✅ Good: Descriptive constants
const API_ENDPOINTS = {
  USER_PROFILE: '/api/users/profile',
  USER_SETTINGS: '/api/users/settings',
  AUTH_LOGIN: '/api/auth/login',
} as const;

enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
  GUEST = 'guest',
}

const ERROR_MESSAGES = {
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
  NETWORK_ERROR: 'Network connection failed. Please try again.',
} as const;

// ❌ Bad: Unclear or inconsistent naming
const endpoints = {
  profile: '/api/users/profile',
  settings: '/api/users/settings',
  login: '/api/auth/login',
};

enum Role {
  A = 'admin',
  M = 'manager',
  U = 'user',
}
```

## 🎨 Code Formatting

### ESLint Configuration
```json
// .eslintrc.json
{
  "extends": [
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "prefer-const": "error",
    "no-var": "error",
    "object-shorthand": "error",
    "prefer-template": "error"
  }
}
```

### Prettier Configuration
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

### Code Style Examples
```typescript
// ✅ Good: Consistent formatting
const userService = {
  async fetchUser(id: string): Promise<UserProfile> {
    const response = await fetch(`/api/users/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  async updateUser(
    id: string, 
    updates: Partial<UserProfile>
  ): Promise<UserProfile> {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update user: ${response.statusText}`);
    }
    
    return response.json();
  },
};

// ❌ Bad: Inconsistent formatting
const userService={
async fetchUser(id:string):Promise<UserProfile>{
const response=await fetch("/api/users/"+id);
if(!response.ok){throw new Error("Failed to fetch user: "+response.statusText);}
return response.json();},
async updateUser(id:string,updates:Partial<UserProfile>):Promise<UserProfile>{
const response=await fetch("/api/users/"+id,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(updates)});
if(!response.ok){throw new Error("Failed to update user: "+response.statusText);}
return response.json();}};
```

## 📚 Documentation Standards

### JSDoc Comments
```typescript
/**
 * Calculates the total value of items in a shopping cart
 * @param items - Array of cart items
 * @param taxRate - Tax rate as a decimal (e.g., 0.08 for 8%)
 * @param discountCode - Optional discount code to apply
 * @returns Object containing subtotal, tax, discount, and total
 * @throws {Error} When tax rate is negative or greater than 1
 * @example
 * ```typescript
 * const total = calculateCartTotal(
 *   [{ price: 10, quantity: 2 }],
 *   0.08,
 *   'SAVE10'
 * );
 * console.log(total.total); // 19.44
 * ```
 */
function calculateCartTotal(
  items: CartItem[],
  taxRate: number,
  discountCode?: string
): CartTotal {
  if (taxRate < 0 || taxRate > 1) {
    throw new Error('Tax rate must be between 0 and 1');
  }
  
  // Implementation...
}
```

### Component Documentation
```typescript
/**
 * A reusable card component for displaying user information
 * 
 * @example
 * ```tsx
 * <UserCard
 *   user={userData}
 *   showActions={true}
 *   onEdit={handleEdit}
 * />
 * ```
 */
interface UserCardProps {
  /** User data to display */
  user: UserProfile;
  /** Whether to show action buttons */
  showActions?: boolean;
  /** Callback when edit button is clicked */
  onEdit?: (user: UserProfile) => void;
  /** Additional CSS classes */
  className?: string;
}

export const UserCard: React.FC<UserCardProps> = ({ /* ... */ }) => {
  // Component implementation
};
```

### README Documentation
```markdown
## Component: UserCard

### Purpose
Displays user profile information in a card format with optional action buttons.

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| user | UserProfile | required | User data to display |
| showActions | boolean | true | Whether to show action buttons |
| onEdit | function | undefined | Callback when edit button is clicked |
| className | string | '' | Additional CSS classes |

### Usage
```tsx
import { UserCard } from './components/UserCard';

function App() {
  return (
    <UserCard
      user={userData}
      showActions={true}
      onEdit={handleEdit}
    />
  );
}
```

### Dependencies
- React 18+
- UserProfile interface
- CSS classes for styling
```

## 🚨 Error Handling

### Error Boundaries
```typescript
// ✅ Good: Comprehensive error boundary
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{ fallback?: React.ComponentType<{ error: Error }> }>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log error to monitoring service
    console.error('Error caught by boundary:', error, errorInfo);
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback;
      
      if (FallbackComponent) {
        return <FallbackComponent error={this.state.error!} />;
      }

      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>We're sorry, but something unexpected happened.</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
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
// ✅ Good: Proper async error handling
async function fetchUserData(userId: string): Promise<UserProfile> {
  try {
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      // Handle different HTTP errors
      switch (response.status) {
        case 404:
          throw new UserNotFoundError(`User ${userId} not found`);
        case 403:
          throw new UnauthorizedError('Access denied');
        case 500:
          throw new ServerError('Internal server error');
        default:
          throw new Error(`Request failed: ${response.statusText}`);
      }
    }
    
    const data = await response.json();
    
    // Validate response data
    if (!isValidUserProfile(data)) {
      throw new ValidationError('Invalid user data received');
    }
    
    return data;
  } catch (error) {
    // Re-throw custom errors
    if (error instanceof UserNotFoundError || 
        error instanceof UnauthorizedError) {
      throw error;
    }
    
    // Wrap unknown errors
    throw new Error(`Failed to fetch user data: ${error.message}`);
  }
}

// Custom error classes
class UserNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserNotFoundError';
  }
}

class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

## ⚡ Performance Guidelines

### Bundle Optimization
```typescript
// ✅ Good: Lazy loading with proper error handling
const LazyDashboard = React.lazy(() => 
  import('./pages/Dashboard').catch(error => {
    console.error('Failed to load Dashboard component:', error);
    // Return a fallback component
    return { default: () => <div>Failed to load Dashboard</div> };
  })
);

// Usage with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <LazyDashboard />
</Suspense>
```

### Image Optimization
```typescript
// ✅ Good: Optimized image component
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  lazy?: boolean;
  className?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  lazy = true,
  className = '',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={lazy ? 'lazy' : 'eager'}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
      
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-500">Failed to load image</span>
        </div>
      )}
    </div>
  );
};
```

## 🔒 Security Considerations

### Input Validation
```typescript
// ✅ Good: Proper input validation
import { z } from 'zod';

const UserProfileSchema = z.object({
  email: z.string().email('Invalid email format'),
  fullName: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  age: z.number().int().min(13, 'Must be 13 or older').max(120, 'Invalid age'),
  website: z.string().url('Invalid URL').optional(),
});

function validateUserProfile(data: unknown): UserProfile {
  try {
    return UserProfileSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(`Invalid user data: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
}

// Usage
async function updateUserProfile(data: unknown) {
  const validatedData = validateUserProfile(data);
  // Proceed with validated data
}
```

### Sanitization
```typescript
// ✅ Good: HTML sanitization
import DOMPurify from 'dompurify';

interface SafeHTMLProps {
  html: string;
  className?: string;
}

export const SafeHTML: React.FC<SafeHTMLProps> = ({ html, className }) => {
  const sanitizedHTML = useMemo(() => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: ['class'],
    });
  }, [html]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
};
```

### Environment Variables
```typescript
// ✅ Good: Secure environment variable handling
const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
] as const;

// Validate required environment variables
for (const envVar of requiredEnvVars) {
  if (!import.meta.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const config = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  // Never expose server-side keys in client code
} as const;

// ❌ Bad: Exposing sensitive data
export const config = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseServiceKey: import.meta.env.SUPABASE_SERVICE_KEY, // Don't do this!
};
```

## ✅ Quality Checklist

### Before Committing Code
- [ ] Code passes all ESLint rules
- [ ] TypeScript compilation succeeds without errors
- [ ] All tests pass
- [ ] Components are properly typed
- [ ] Error handling is implemented
- [ ] Performance considerations are addressed
- [ ] Security best practices are followed
- [ ] Documentation is updated
- [ ] Code is properly formatted
- [ ] No console.log statements in production code

### Code Review Checklist
- [ ] Logic is clear and well-structured
- [ ] Error scenarios are handled
- [ ] TypeScript types are accurate
- [ ] Performance implications are considered
- [ ] Security vulnerabilities are addressed
- [ ] Tests cover critical functionality
- [ ] Documentation is adequate
- [ ] Naming conventions are followed
- [ ] Code is DRY and follows SOLID principles
- [ ] Breaking changes are documented

## 🔗 Related Documentation

- [Project Structure](./project-structure.md) - Understanding the codebase organization
- [Frontend Guide](./frontend-guide.md) - React and TypeScript development patterns
- [Supabase Integration](./supabase-integration.md) - Backend integration guidelines
- [Contributing Guide](./contributing.md) - Development workflow and processes
