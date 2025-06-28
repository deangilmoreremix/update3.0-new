# Smart CRM

## Overview

Smart CRM is a modern AI-powered customer relationship management platform built with React and Express.js. The application combines traditional CRM functionality with advanced AI capabilities to help sales teams work more efficiently. It features a modern frontend built with React, TypeScript, and Tailwind CSS, backed by a Node.js server using Express and Drizzle ORM with PostgreSQL.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components for consistent design
- **State Management**: Zustand for lightweight, type-safe state management
- **Router**: React Router for client-side navigation
- **Build Tool**: Vite for fast development and optimized builds
- **Component Library**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety
- **Database ORM**: Drizzle ORM for type-safe database queries
- **Database**: PostgreSQL (configured for Neon serverless)
- **Session Management**: In-memory storage with planned PostgreSQL persistence
- **API Architecture**: RESTful API design with /api prefix routing

### Database Architecture
- **Primary Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle with automatic migrations
- **Schema Location**: `shared/schema.ts` for type sharing between client and server
- **Connection**: WebSocket-enabled connection pooling for serverless deployment

## Key Components

### 1. Authentication System
- Planned integration with Supabase for user management
- JWT-based session handling
- Protected routes with role-based access control
- Profile management with avatar upload capabilities

### 2. Contact Management
- Full CRUD operations for contacts
- AI-enhanced contact insights and scoring
- Import/export functionality for bulk operations
- Advanced search and filtering capabilities
- Social profile integration

### 3. Deal Pipeline
- Kanban-style pipeline visualization
- Stage-based deal progression tracking
- AI-powered deal analysis and recommendations
- Revenue forecasting and analytics
- Customizable pipeline stages

### 4. AI-Powered Tools
- **Email Composer**: AI-generated personalized emails
- **Content Generator**: Marketing content creation
- **Lead Scoring**: Intelligent prospect prioritization
- **Voice Analysis**: Real-time call insights
- **Document Analysis**: Automated document processing
- **Smart Search**: Semantic search across all data

### 5. Task and Calendar Management
- Task creation and tracking
- Calendar integration for appointments
- Automated follow-up reminders
- Priority-based task organization

### 6. Communication Tools
- **Phone System**: VoIP integration for calls
- **Text Messaging**: SMS campaign management
- **Video Email**: Personalized video messaging
- **Email Templates**: Reusable email components

### 7. Analytics and Reporting
- Pipeline performance metrics
- Revenue forecasting
- Contact engagement analytics
- AI-driven insights and recommendations

## Data Flow

### 1. Client-Server Communication
- RESTful API endpoints prefixed with `/api`
- JSON-based request/response format
- Error handling with standardized error responses
- Request logging and performance monitoring

### 2. Database Operations
- Drizzle ORM handles all database interactions
- Type-safe queries with automatic TypeScript generation
- Migration management through `drizzle-kit`
- Connection pooling for optimal performance

### 3. AI Service Integration
- OpenAI GPT-4 for content generation and analysis
- Google Gemini for additional AI capabilities
- API key management through secure environment variables
- Rate limiting and error handling for AI services

### 4. State Management Flow
- Zustand stores for different domain entities (contacts, deals, tasks)
- Persistent storage for user preferences and API keys
- Real-time updates through optimistic UI patterns
- Error boundaries for graceful error handling

## External Dependencies

### AI Services
- **OpenAI**: GPT-4 for advanced text generation and analysis
- **Google Gemini**: Alternative AI model for specific use cases
- **API Key Management**: Secure storage and rotation capabilities

### Database and Backend
- **Neon**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations
- **Express.js**: Web server framework
- **WebSockets**: Real-time communication support

### Frontend Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **React Query**: Server state management (planned)
- **React Hook Form**: Form validation and management
- **Recharts**: Data visualization components

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the application
- **ESBuild**: Fast JavaScript bundling
- **Replit Integration**: Development environment support

## Deployment Strategy

### Development Environment
- Vite development server with HMR
- Express server with automatic restarts
- Environment variable management
- Replit-specific optimizations and integrations

### Production Build
- Vite optimized production build
- ESBuild bundling for server code
- Static asset optimization
- Environment-specific configuration

### Database Management
- Drizzle migrations for schema updates
- Automated database provisioning
- Connection string management
- Backup and recovery procedures

### Scalability Considerations
- Serverless-first architecture
- Connection pooling for database efficiency
- Lazy loading for optimal performance
- CDN integration for static assets

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### June 28, 2025 - AI Goals Navigation Fix
- **Navigation Issue Resolved**: Fixed back button on AI Goals page to navigate to `/dashboard` instead of landing page
- **User Experience**: Users now properly return to dashboard when clicking back from AI Goals page
- **Implementation**: Updated navigate('/') to navigate('/dashboard') in AIGoalsPage back button handler

### June 28, 2025 - Enhanced AI Goals System with Complete Integration Layer
- **Comprehensive AI Goals Platform**: Built complete AI Goals system with 21 pre-configured business automation goals
- **Interactive Goal Explorer**: Created comprehensive InteractiveGoalExplorer component with:
  - Live dashboard with real-time metrics tracking
  - Advanced filtering by category, priority, and complexity
  - Smart search functionality across all goal attributes
  - Quick action buttons for bulk goal execution
  - Demo/Live mode toggle for production readiness
- **Multi-Agent Architecture**: Implemented sophisticated multi-agent coordination with:
  - AgentOrchestrator for cross-agent workflow management
  - MCP (Model Context Protocol) client for function calling
  - Gemma optimization layer for agentic AI performance
  - Composio service integration for external tool connectivity
- **Goal Execution Modal**: Advanced GoalExecutionModal with:
  - Real-time agent coordination visualization
  - Step-by-step execution tracking with dependencies
  - Live logging and chain-of-thought reasoning display
  - Network activity monitoring between AI agents
  - Results dashboard with business impact metrics
- **Comprehensive Goal Dataset**: 21 goals across 8 categories:
  - Sales (3): Lead Scoring, Proposal Generation, Pipeline Optimization
  - Marketing (3): Email Campaigns, Content Calendar, Dynamic Pricing
  - Relationship (2): Customer Health Monitoring, Automated Onboarding
  - Automation (3): Invoice Processing, Meeting Scheduling, Workflow Designer
  - Analytics (3): Business Intelligence, CLV Prediction, Performance Optimization
  - Content (2): Blog Generation, Video Automation
  - Admin (2): HR Processing, Compliance Monitoring
  - AI-Native (3): Document Intelligence, Predictive Maintenance, Inventory Optimization
- **Advanced Integration Features**:
  - Real Composio API integration for LinkedIn, Twitter, Reddit, Email
  - MCP function calling with OpenAI and Gemini models
  - Gemma-specific optimization for agentic task performance
  - TypeScript interfaces for comprehensive type safety
  - Business impact tracking with ROI calculations
- **Production Components**: All UI components production-ready including dialog modals, progress tracking, and interactive cards
- **Status**: Fully implemented with real API integration capabilities and sophisticated multi-agent coordination

### June 28, 2025 - Clerk Authentication Production Configuration Complete
- **Production Configuration**: Successfully configured Clerk with production domain "smart-crm.videoremix.io"
- **Application Paths**:
  - Home URL: https://smart-crm.videoremix.io/dashboard
  - Unauthorized sign-in URL: https://smart-crm.videoremix.io/login
- **Component Paths** (Account Portal):
  - Sign-in: https://accounts.smart-crm.videoremix.io/sign-in
  - Sign-up: https://accounts.smart-crm.videoremix.io/sign-up
  - User profile: https://accounts.smart-crm.videoremix.io/user
  - Organization profile: https://accounts.smart-crm.videoremix.io/organization
  - After sign-out: https://smart-crm.videoremix.io (root domain)
- **Implementation**: ClerkProvider configured with all production URLs and redirect parameters
- **Authentication Flow**: Login/Register pages redirect to Clerk hosted authentication with proper return URLs
- **User Data Access**: Preserved existing user data with proper Clerk user object structure
- **Status**: Production-ready with exact Clerk dashboard configuration matching

### June 28, 2025 - AI Models Upgraded with Agentic Capabilities
- **Gemma Model Integration**: Updated all Gemini services to use `gemma-2-27b-it` for optimal agentic performance
  - Tool use and API integration capabilities
  - Planning and task decomposition
  - Complex reasoning for business analysis
  - Memory and context management support
- **OpenAI Model Upgrade**: Migrated OpenAI services to use latest reasoning models:
  - Primary content generation: `o1-preview` 
  - Secondary/lightweight tasks: `o1-mini`
  - Vision tasks: Maintained `gpt-4o` for image analysis
- **Enhanced Prompting Strategy**: Implemented Chain of Thought prompting for better agentic performance
  - Step-by-step task decomposition in business analysis
  - Systematic planning approach for personalization
  - Observation and reflection capabilities
- **API Structure Preserved**: Maintained original API call structure while only updating underlying models
- **O1 Model Handling**: Implemented proper support for O1 models (no system messages, no streaming, higher token limits)
- **Agentic Framework Ready**: CRM now leverages models optimized for autonomous iteration and tool use

### June 28, 2025 - AI Tools Modal System Fixed
- **Critical Fix**: Resolved AI tools modal system not opening when clicking buttons in navigation dropdown
- **Root Cause**: AIToolsProvider context was not properly wrapping the entire application
- **Solution**: Added AIToolsProvider wrapper around Router in App.tsx to provide context to all components
- **Impact**: All 29+ AI tools in navigation dropdown now properly open their respective modals
- **Testing**: Confirmed Email Analysis, Meeting Summary, and other AI tools modals open correctly

### Architecture Updates
- Enhanced React Context pattern implementation for AI tools state management
- Improved error handling with proper context validation in useAITools hook
- Maintained comprehensive AI tool categorization (Core AI Tools, Communication, Customer & Content, Advanced Features, Real-time Features, Reasoning Generators)
- **Authentication System**: Transitioned from custom Zustand auth to Clerk while maintaining custom UI design

## Changelog

Changelog:
- June 28, 2025. AI Tools modal system fixed and fully functional
- June 28, 2025. Initial setup