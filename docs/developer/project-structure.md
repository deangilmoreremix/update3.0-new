# Smart CRM - Project Structure Overview

This document outlines the complete directory structure of the Smart CRM application and explains the purpose of each folder and key files.

## 📁 Top-Level Directory Structure

```
update3.0-new/
├── 📁 src/                     # Main application source code
├── 📁 public/                  # Static assets served directly
├── 📁 supabase/               # Backend functions and configuration
├── 📁 docs/                   # Project documentation
├── 📁 pages/                  # Page-level components (root level)
├── 📁 ui/                     # UI components (root level)
├── 📁 hooks/                  # Custom React hooks (root level)
├── 📁 pipeline_repo/          # Pipeline-specific components
├── 📁 pipeline_deals_new/     # New deal functionality
├── 📁 attached_assets/        # Additional assets and backup components
├── 📁 agents/                 # AI agent components
├── 📁 dist/                   # Production build output
├── 📁 node_modules/           # Dependencies (auto-generated)
├── 📄 package.json            # Project dependencies and scripts
├── 📄 vite.config.ts          # Vite build configuration
├── 📄 tailwind.config.js      # Tailwind CSS configuration
├── 📄 tsconfig.json           # TypeScript configuration
├── 📄 netlify.toml            # Netlify deployment configuration
└── 📄 README.md               # Project overview and setup instructions
```

## 🎯 Core Application Structure (`src/`)

### Main Source Directory
```
src/
├── 📁 components/             # React components organized by feature
│   ├── 📁 aiTools/           # AI-powered tools and features
│   ├── 📁 common/            # Shared/reusable components
│   ├── 📁 dashboard/         # Dashboard-specific components
│   ├── 📁 shared/            # Cross-feature shared components
│   └── 📁 ui/                # Core UI components
├── 📁 contexts/              # React context providers
├── 📁 services/              # Business logic and API integrations
├── 📁 types/                 # TypeScript type definitions
├── 📄 App.tsx                # Main application component
├── 📄 main.tsx               # Application entry point
└── 📄 index.css              # Global styles and Tailwind imports
```

### Components Directory (`src/components/`)

#### AI Tools (`src/components/aiTools/`)
- **Purpose**: AI-powered features and integrations
- **Key Files**:
  - `AIGoalsPanel.tsx` - Goal tracking and management system
  - `CompetitorAnalysisContent.tsx` - Competitive intelligence tool
  - `ReasoningContentGenerator.tsx` - Advanced AI reasoning for content
  - `ComposioIntegrationsModal.tsx` - Third-party AI integrations

#### Common Components (`src/components/common/`)
- **Purpose**: Shared components used across the application
- **Key Files**:
  - `ErrorBoundary.tsx` - Error handling and graceful degradation
  - `LoadingSpinner.tsx` - Loading state indicators
  - `Layout.tsx` - Page layout wrappers

#### Dashboard Components (`src/components/dashboard/`)
- **Purpose**: Dashboard-specific UI components
- **Key Files**:
  - `ChartsSection.tsx` - Analytics and data visualization
  - `StatsCards.tsx` - KPI and metrics display
  - `QuickActions.tsx` - Quick action buttons and shortcuts

#### Shared Components (`src/components/shared/`)
- **Purpose**: Components shared across multiple features
- **Key Files**:
  - `AIToolContent.tsx` - Common AI tool interface
  - `FileUpload.tsx` - File upload functionality

#### UI Components (`src/components/ui/`)
- **Purpose**: Core UI building blocks
- **Key Files**:
  - `ContextualTour.tsx` - User onboarding and tutorials
  - `HelpTooltip.tsx` - Context-sensitive help system
  - `CustomizableAIToolbar.tsx` - AI tool interface elements

### Contexts (`src/contexts/`)
- **Purpose**: React context providers for global state management
- **Key Files**:
  - `ThemeContext.tsx` - Theme and dark mode management
  - `NavigationContext.tsx` - Navigation state and breadcrumbs
  - `VideoCallContext.tsx` - Video calling functionality state
  - `EnhancedHelpContext.tsx` - Help system state management
  - `AIToolsProvider.tsx` - AI tools configuration and state

### Services (`src/services/`)
- **Purpose**: Business logic, API integrations, and data management
- **Key Files**:
  - `supabaseService.ts` - Database operations and queries
  - `aiOrchestratorService.ts` - AI service coordination and management
  - `openaiService.ts` - OpenAI API integration
  - `geminiService.ts` - Google Gemini AI integration
  - `enhancedGeminiService.ts` - Enhanced Gemini functionality
  - `edgeFunctionService.ts` - Supabase Edge Function calls

### Types (`src/types/`)
- **Purpose**: TypeScript type definitions and interfaces
- **Key Files**:
  - `index.ts` - Main type exports and definitions

## 🌐 Backend Structure (`supabase/`)

```
supabase/
├── 📁 functions/              # Supabase Edge Functions
│   ├── 📁 ai-content-generator/ # AI content generation API
│   │   └── index.ts           # OpenAI integration endpoint
│   └── 📁 _shared/            # Shared utilities for functions
│       └── cors.ts            # CORS handling
├── 📄 config.toml             # Supabase project configuration
└── 📁 migrations/             # Database schema migrations (if any)
```

## 📱 Page Components (Root Level)

### Pages Directory (`pages/`)
- **Purpose**: Top-level page components and routes
- **Key Files**:
  - `Dashboard.tsx` - Main dashboard page
  - `Pipeline.tsx` - Sales pipeline management
  - `Contacts.tsx` - Contact and lead management
  - `Settings.tsx` - Application settings
  - `AITools.tsx` - AI tools hub
  - `BusinessAnalyzer.tsx` - Business analysis tools

### UI Directory (Root Level) (`ui/`)
- **Purpose**: Root-level UI components (legacy structure)
- **Note**: This is a non-standard location but contains working components
- **Key Files**:
  - `ContextualTour.tsx` - User onboarding tours
  - `HelpTooltip.tsx` - Help system integration
  - `CustomizableAIToolbar.tsx` - AI toolbar components

### Hooks Directory (Root Level) (`hooks/`)
- **Purpose**: Custom React hooks for shared functionality
- **Key Files**:
  - `use-toast.ts` - Toast notification system

## 🔧 Specialized Repositories

### Pipeline Repository (`pipeline_repo/`)
- **Purpose**: Pipeline-specific components and functionality
- **Structure**: Contains its own `src/` directory with components focused on sales pipeline management

### Pipeline Deals New (`pipeline_deals_new/`)
- **Purpose**: New deal functionality and components
- **Structure**: Latest deal management features and improvements

### Attached Assets (`attached_assets/`)
- **Purpose**: Additional assets, backup components, and legacy code
- **Structure**: Contains various project assets and component backups

### Agents (`agents/`)
- **Purpose**: AI agent components and runners
- **Key Files**:
  - `composioAgentRunner.ts` - AI agent orchestration and execution

## ⚙️ Configuration Files

### Build and Development
- **`vite.config.ts`**: Vite build tool configuration including bundle optimization
- **`tsconfig.json`**: TypeScript compiler configuration
- **`tailwind.config.js`**: Tailwind CSS framework configuration
- **`eslint.config.js`**: ESLint code quality rules

### Deployment
- **`netlify.toml`**: Netlify deployment and routing configuration
- **`package.json`**: Project metadata, dependencies, and scripts

### Environment
- **`.env`**: Environment variables (not tracked in git)
- **`.gitignore`**: Files and directories excluded from version control

## 🎯 Key Architectural Patterns

### Component Organization
1. **Feature-Based**: Components grouped by business functionality
2. **Shared Components**: Reusable components in common directories
3. **Service Layer**: Business logic separated from UI components
4. **Context Providers**: Global state management using React Context

### File Naming Conventions
- **Components**: PascalCase (e.g., `AIGoalsPanel.tsx`)
- **Services**: camelCase (e.g., `aiOrchestratorService.ts`)
- **Types**: camelCase (e.g., `index.ts`)
- **Contexts**: PascalCase with "Context" suffix (e.g., `ThemeContext.tsx`)

### Import/Export Patterns
- **Default Exports**: For main component files
- **Named Exports**: For utility functions and types
- **Barrel Exports**: Index files that re-export from multiple modules

## 🚀 Getting Started

To understand the codebase:
1. Start with `src/App.tsx` - the main application entry point
2. Review `src/components/` - understand the component hierarchy
3. Examine `src/services/` - understand data flow and business logic
4. Check `src/contexts/` - understand global state management
5. Look at `pages/` - understand the application routes and pages

## 📚 Related Documentation

- [Frontend Development Guide](./frontend-guide.md) - React, TypeScript, and component patterns
- [Backend Integration](./supabase-integration.md) - Supabase setup and usage
- [AI Integration](./ai-integration.md) - AI services and tools
- [Code Standards](./code-standards.md) - Coding conventions and quality
- [Contributing](./contributing.md) - Development workflow and guidelines
