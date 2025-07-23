
# Manual Fix Guide for Remaining Lint Issues

## 🔴 High Priority (Fix First)

### 1. @typescript-eslint/no-explicit-any
**Issue**: Using 'any' type instead of specific types
**Fix**: Replace with proper types

```typescript
// ❌ Bad
const data: any = getData();

// ✅ Good  
const data: UserData = getData();
```

### 2. react-hooks/exhaustive-deps
**Issue**: Missing dependencies in React Hook arrays
**Fix**: Add missing dependencies or use useCallback

```typescript
// ❌ Bad
useEffect(() => {
  fetchData(userId);
}, []); // Missing userId dependency

// ✅ Good
useEffect(() => {
  fetchData(userId);
}, [userId]); // Added userId
```

### 3. @typescript-eslint/no-unused-vars
**Issue**: Variables declared but never used
**Fix**: Remove unused variables or prefix with underscore

```typescript
// ❌ Bad
const unusedVar = 'value';
const [data, setData] = useState();

// ✅ Good
const _unusedVar = 'value'; // or remove entirely
const [data] = useState(); // removed unused setData
```

## 🟡 Medium Priority

### 4. no-prototype-builtins
**Issue**: Direct access to Object.prototype methods
**Fix**: Use Object.prototype.hasOwnProperty.call()

```typescript
// ❌ Bad
if (obj.hasOwnProperty('key')) {}

// ✅ Good
if (Object.prototype.hasOwnProperty.call(obj, 'key')) {}
```

### 5. @typescript-eslint/ban-ts-comment
**Issue**: Using @ts-ignore instead of @ts-expect-error
**Fix**: Replace with @ts-expect-error

```typescript
// ❌ Bad
// @ts-ignore
const value = unsafeOperation();

// ✅ Good
// @ts-expect-error
const value = unsafeOperation();
```

## 🔵 Low Priority

### 6. react-refresh/only-export-components
**Issue**: Exporting non-components from component files
**Fix**: Move constants to separate files

### 7. no-useless-escape
**Issue**: Unnecessary escape characters in strings
**Fix**: Remove unnecessary backslashes

## 🚀 Quick Fix Commands

```bash
# Auto-fix what ESLint can handle
npx eslint . --fix

# Fix specific rule types
npx eslint . --fix --rule "@typescript-eslint/no-unused-vars: error"

# Format code after fixes
npx prettier --write "src/**/*.{ts,tsx}"
```
