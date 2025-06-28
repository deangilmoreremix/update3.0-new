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

## Changelog

Changelog:
- June 28, 2025. Initial setup