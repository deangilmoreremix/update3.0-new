# Contributing Guide

Welcome to the Smart CRM project! This guide outlines the development workflow, processes, and guidelines for contributing to the codebase.

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Branch Strategy](#branch-strategy)
4. [Commit Guidelines](#commit-guidelines)
5. [Pull Request Process](#pull-request-process)
6. [Code Review Guidelines](#code-review-guidelines)
7. [Testing Requirements](#testing-requirements)
8. [Documentation Updates](#documentation-updates)
9. [Release Process](#release-process)
10. [Troubleshooting](#troubleshooting)

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.0 or higher
- **npm** 9.0 or higher
- **Git** 2.30 or higher
- **VS Code** (recommended) with suggested extensions

### Development Environment Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/your-org/smart-crm.git
cd smart-crm
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

Required environment variables:
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

#### 4. Start Development Server
```bash
npm run dev
```

#### 5. Verify Setup
- Open http://localhost:3000
- Ensure the application loads without errors
- Check that all core features are working

### Recommended VS Code Extensions
```json
// .vscode/extensions.json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

## 🔄 Development Workflow

### Feature Development Process

#### 1. Issue Assignment
- Pick an issue from the project board
- Assign yourself to the issue
- Move the issue to "In Progress"
- Add appropriate labels and estimates

#### 2. Branch Creation
```bash
# Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/issue-number-short-description

# Example
git checkout -b feature/123-ai-goals-panel
```

#### 3. Development Cycle
```bash
# Make changes
# Add and commit frequently with meaningful messages
git add .
git commit -m "feat: add basic AI goals panel structure"

# Push changes regularly
git push origin feature/123-ai-goals-panel
```

#### 4. Pre-Pull Request Checklist
- [ ] Code follows project standards
- [ ] All tests pass locally
- [ ] ESLint and TypeScript checks pass
- [ ] Features work in both light and dark themes
- [ ] Responsive design is maintained
- [ ] Documentation is updated
- [ ] Performance impact is considered

#### 5. Pull Request Creation
- Create PR from your feature branch to `main`
- Use the provided PR template
- Link related issues
- Add appropriate reviewers
- Include screenshots for UI changes

## 🌿 Branch Strategy

### Branch Types

#### Main Branches
- **`main`**: Production-ready code
- **`develop`**: Integration branch for features (if needed)

#### Supporting Branches
- **`feature/issue-number-description`**: New features
- **`bugfix/issue-number-description`**: Bug fixes
- **`hotfix/issue-number-description`**: Critical production fixes
- **`docs/description`**: Documentation updates
- **`refactor/description`**: Code refactoring
- **`chore/description`**: Maintenance tasks

### Branch Naming Conventions
```bash
# Features
feature/123-user-authentication
feature/456-ai-goals-dashboard

# Bug fixes
bugfix/789-login-form-validation
bugfix/101-api-error-handling

# Hot fixes
hotfix/999-critical-security-patch

# Documentation
docs/api-documentation-update
docs/contributing-guide

# Refactoring
refactor/user-service-cleanup
refactor/component-structure

# Chores
chore/dependency-updates
chore/eslint-configuration
```

### Branch Lifecycle
```bash
# 1. Create branch
git checkout main
git pull origin main
git checkout -b feature/123-new-feature

# 2. Develop and commit
git add .
git commit -m "feat: implement new feature"
git push origin feature/123-new-feature

# 3. Create PR and merge
# (After PR approval and merge)

# 4. Clean up
git checkout main
git pull origin main
git branch -d feature/123-new-feature
```

## 📝 Commit Guidelines

### Commit Message Format
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks
- **ci**: CI/CD changes
- **build**: Build system changes

### Examples
```bash
# Feature commits
git commit -m "feat(auth): add user login functionality"
git commit -m "feat(ai): implement goal suggestions API"

# Bug fix commits
git commit -m "fix(ui): resolve mobile responsive issues"
git commit -m "fix(api): handle null response in user service"

# Documentation commits
git commit -m "docs: update API documentation"
git commit -m "docs(readme): add setup instructions"

# Refactoring commits
git commit -m "refactor(components): extract common button component"
git commit -m "refactor(services): simplify error handling"

# Breaking changes
git commit -m "feat(api)!: change user authentication flow

BREAKING CHANGE: User authentication now requires email verification"
```

### Commit Best Practices
- **Keep commits atomic**: One logical change per commit
- **Write clear descriptions**: Explain what and why, not how
- **Use present tense**: "Add feature" not "Added feature"
- **Limit first line to 50 characters**
- **Use body for complex changes**: Explain motivation and context
- **Reference issues**: Include issue numbers when relevant

## 🔍 Pull Request Process

### PR Template
```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Related Issues
Fixes #123
Relates to #456

## Screenshots (if applicable)
[Add screenshots for UI changes]

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Cross-browser testing (if applicable)

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Code is properly commented
- [ ] Documentation has been updated
- [ ] No breaking changes (or properly documented)
- [ ] Performance impact considered
- [ ] Security implications reviewed

## Additional Notes
Any additional information for reviewers.
```

### PR Requirements

#### Before Creating PR
- Ensure branch is up to date with main
- All tests pass locally
- Code meets quality standards
- Documentation is updated

#### PR Creation
- Use descriptive title following commit conventions
- Fill out the complete PR template
- Add appropriate labels
- Assign reviewers
- Link related issues

#### PR Size Guidelines
- **Small PR**: < 100 lines changed (preferred)
- **Medium PR**: 100-300 lines changed
- **Large PR**: > 300 lines changed (avoid if possible)

For large changes:
- Break into smaller, logical PRs
- Provide detailed description and context
- Consider draft PR for early feedback

### Review Process

#### Automated Checks
All PRs must pass:
- ESLint checks
- TypeScript compilation
- Unit tests
- Build process
- Security scans

#### Manual Review
- At least one approving review required
- Security-sensitive changes require two reviews
- Breaking changes require team lead approval

## 👥 Code Review Guidelines

### For Authors

#### Preparing for Review
- Self-review your code before requesting review
- Ensure CI/CD checks are passing
- Provide context and explanation for complex changes
- Add comments for non-obvious code
- Test your changes thoroughly

#### Responding to Feedback
- Address all feedback promptly
- Ask for clarification when needed
- Make requested changes or provide reasoning
- Thank reviewers for their time and input
- Update the PR description if scope changes

### For Reviewers

#### Review Checklist
- [ ] **Functionality**: Does the code work as intended?
- [ ] **Logic**: Is the logic clear and correct?
- [ ] **Standards**: Does code follow project standards?
- [ ] **Performance**: Are there performance implications?
- [ ] **Security**: Are there security concerns?
- [ ] **Tests**: Are there adequate tests?
- [ ] **Documentation**: Is documentation updated?
- [ ] **Error Handling**: Are errors handled properly?

#### Review Comments
```markdown
# ✅ Good feedback examples

## Suggestion with explanation
Consider using `useMemo` here to avoid recalculating on every render:
```javascript
const expensiveValue = useMemo(() => calculateValue(data), [data]);
```

## Question for clarification
Why did you choose this approach over using the existing `UserService`?

## Positive feedback
Great job on the error handling here! This will make debugging much easier.

## Required change
This could cause a memory leak. Please add cleanup in the useEffect:
```javascript
useEffect(() => {
  const subscription = subscribe();
  return () => subscription.unsubscribe();
}, []);
```

# ❌ Poor feedback examples
This is wrong.
Change this.
I don't like this approach.
```

#### Review Response Time
- **Critical/Hotfix**: Within 2 hours
- **Regular PRs**: Within 24 hours
- **Large PRs**: Within 48 hours

## 🧪 Testing Requirements

### Test Coverage Standards
- **Critical features**: 90%+ test coverage
- **Standard features**: 80%+ test coverage
- **UI components**: Focus on behavior and props
- **Services**: Mock external dependencies
- **Utilities**: 100% test coverage

### Testing Types

#### Unit Tests
```typescript
// Example: Testing a utility function
import { formatCurrency } from '../utils/formatCurrency';

describe('formatCurrency', () => {
  it('should format positive numbers correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('should handle zero values', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('should handle negative numbers', () => {
    expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
  });
});
```

#### Component Tests
```typescript
// Example: Testing a React component
import { render, screen, fireEvent } from '@testing-library/react';
import { UserCard } from '../UserCard';

const mockUser = {
  id: '1',
  fullName: 'John Doe',
  email: 'john@example.com',
};

describe('UserCard', () => {
  it('displays user information correctly', () => {
    render(<UserCard user={mockUser} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const handleEdit = jest.fn();
    render(<UserCard user={mockUser} onEdit={handleEdit} />);
    
    fireEvent.click(screen.getByText('Edit'));
    expect(handleEdit).toHaveBeenCalledWith(mockUser);
  });
});
```

#### Integration Tests
```typescript
// Example: Testing service integration
import { UserService } from '../services/userService';
import { supabase } from '../services/supabaseClient';

jest.mock('../services/supabaseClient');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch user data successfully', async () => {
    const mockUser = { id: '1', name: 'John Doe' };
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        }),
      }),
    });

    const result = await UserService.getById('1');
    expect(result).toEqual(mockUser);
  });
});
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test UserCard.test.tsx

# Run tests for specific pattern
npm test -- --testPathPattern=components
```

## 📚 Documentation Updates

### When to Update Documentation
- Adding new features
- Changing existing APIs
- Updating configuration
- Adding new dependencies
- Changing development workflow

### Documentation Types

#### Code Documentation
- JSDoc comments for functions and classes
- README files for modules
- Inline comments for complex logic
- API documentation

#### User Documentation
- Feature guides
- Setup instructions
- Troubleshooting guides
- FAQ updates

#### Developer Documentation
- Architecture decisions
- Development setup
- Deployment guides
- Contributing guidelines

### Documentation Standards
```typescript
/**
 * Calculates user engagement score based on activity metrics
 * 
 * @param activities - Array of user activities
 * @param timeframe - Timeframe for calculation in days
 * @returns Engagement score between 0 and 100
 * 
 * @example
 * ```typescript
 * const score = calculateEngagement(userActivities, 30);
 * console.log(`Engagement score: ${score}%`);
 * ```
 * 
 * @throws {Error} When activities array is empty
 * @since v2.1.0
 */
function calculateEngagement(activities: Activity[], timeframe: number): number {
  // Implementation
}
```

## 🚀 Release Process

### Version Numbering
We follow [Semantic Versioning](https://semver.org/):
- **Major** (X.0.0): Breaking changes
- **Minor** (x.Y.0): New features (backward compatible)
- **Patch** (x.y.Z): Bug fixes (backward compatible)

### Release Types

#### Regular Release
```bash
# 1. Create release branch
git checkout main
git pull origin main
git checkout -b release/v2.1.0

# 2. Update version
npm version minor

# 3. Update CHANGELOG.md
# Add release notes and changes

# 4. Create PR for release branch
# 5. After approval, merge to main
# 6. Tag the release
git tag v2.1.0
git push origin v2.1.0
```

#### Hotfix Release
```bash
# 1. Create hotfix branch from main
git checkout main
git checkout -b hotfix/v2.0.1

# 2. Fix the issue
# 3. Update version
npm version patch

# 4. Create PR and merge
# 5. Tag the release
git tag v2.0.1
git push origin v2.0.1
```

### Release Checklist
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] CHANGELOG.md is updated
- [ ] Version number is bumped
- [ ] Release notes are prepared
- [ ] Breaking changes are documented
- [ ] Migration guides are provided (if needed)

## 🔧 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
npm run dev
```

#### TypeScript Errors
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Restart TypeScript server in VS Code
Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

#### ESLint Errors
```bash
# Fix auto-fixable issues
npm run lint:fix

# Check specific file
npx eslint src/components/UserCard.tsx
```

#### Test Failures
```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test with debugging
npm test -- --testNamePattern="should display user" --verbose
```

### Getting Help

#### Before Asking for Help
1. Check this documentation
2. Search existing issues
3. Review error messages carefully
4. Try reproducing in clean environment

#### How to Ask for Help
1. **Create detailed issue**: Include error messages, steps to reproduce, environment details
2. **Use discussions**: For questions and general help
3. **Slack/Discord**: For real-time help (if available)
4. **Tag team members**: For urgent issues

#### Issue Template
```markdown
## Problem Description
Clear description of what's happening vs. what you expected.

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Environment
- OS: [e.g., macOS 12.0]
- Node.js version: [e.g., 18.16.0]
- npm version: [e.g., 9.5.1]
- Browser: [e.g., Chrome 115.0.0.0]

## Error Messages
```
[Paste any error messages here]
```

## Additional Context
Any other relevant information.
```

### Performance Debugging
```bash
# Analyze bundle size
npm run build
npm run analyze

# Check for memory leaks
# Use React DevTools Profiler

# Monitor network requests
# Use browser DevTools Network tab
```

## 📊 Project Metrics and Monitoring

### Code Quality Metrics
- Test coverage percentage
- ESLint violations
- TypeScript errors
- Bundle size
- Performance metrics

### Development Metrics
- PR merge time
- Code review turnaround
- Build success rate
- Deployment frequency

### Monitoring Tools
- GitHub Actions (CI/CD)
- Codecov (test coverage)
- Lighthouse CI (performance)
- Dependabot (security)

## 🤝 Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Celebrate successes
- Learn from mistakes

### Communication
- Use clear, concise language
- Provide context and examples
- Be patient with new contributors
- Ask questions when unclear
- Share knowledge and resources

## 🔗 Related Resources

- [Project Structure](./project-structure.md) - Understanding the codebase organization
- [Frontend Guide](./frontend-guide.md) - React and TypeScript development
- [Code Standards](./code-standards.md) - Coding conventions and quality
- [AI Integration](./ai-integration.md) - AI services and tools
- [Supabase Integration](./supabase-integration.md) - Backend integration

## 📞 Contact and Support

- **Project Lead**: [Name] - [email]
- **Technical Lead**: [Name] - [email]
- **Issues**: [GitHub Issues](https://github.com/your-org/smart-crm/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/smart-crm/discussions)

---

Thank you for contributing to Smart CRM! Your efforts help make this project better for everyone. 🙌
