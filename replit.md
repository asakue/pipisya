# Chat Application with Voice Calls

## Overview

A real-time chat application with integrated voice calling capabilities. Users can join chat rooms, send messages, and initiate peer-to-peer voice calls with other online users. The application features a professional dark-themed interface inspired by modern communication platforms like Slack and Discord.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tool**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast hot module replacement
- Wouter for lightweight client-side routing

**UI Component System**
- Shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Dark theme as default with professional minimalist aesthetic
- Custom color system using HSL values for flexible theming

**State Management**
- React Context API for global chat state (ChatContext)
- TanStack Query (React Query) for server state management
- Local component state using React hooks

**Real-time Communication**
- Socket.io client for WebSocket-based real-time messaging
- WebRTC for peer-to-peer voice calling (referenced in attached assets)

### Backend Architecture

**Server Framework**
- Express.js as the HTTP server framework
- Native Node.js HTTP server for Socket.io integration
- TypeScript for type safety across the stack

**Real-time Communication**
- Socket.io server for WebSocket connections
- Event-driven architecture for chat and call signaling
- In-memory user session management using Map data structures

**Data Storage**
- In-memory storage (MemStorage class) for user and message data
- No persistent database in current implementation (Drizzle ORM configured but not actively used)
- Session-based architecture - data cleared on server restart

**API Architecture**
- RESTful endpoints served through Express (minimal usage)
- Primary communication via Socket.io events (join, message, call signaling)
- Middleware for request logging and JSON body parsing

### Design System

**Professional Dark Theme**
- Dark charcoal backgrounds with elevated panel surfaces
- High contrast text (WCAG AAA compliance target)
- Subtle borders and minimal shadows for depth
- Geometric layouts with precise alignment

**Typography**
- Inter or SF Pro Display as primary font family
- Defined hierarchy: 24px titles, 18px headers, 14px body, 12px meta
- System font fallbacks for cross-platform consistency

**Component Patterns**
- Isolated, reusable UI components (UserListItem, MessageBubble, CallControls)
- Consistent spacing and border radius (9px large, 6px medium, 3px small)
- Hover and active state elevations for interactive feedback

### Module Organization

**Shared Schema** (`shared/schema.ts`)
- Centralized data models using Drizzle ORM schemas
- Zod validation schemas for runtime type checking
- Type exports for use across client and server

**Path Aliases**
- `@/` maps to `client/src/` for frontend imports
- `@shared/` maps to `shared/` for shared types/schemas
- `@assets/` maps to `attached_assets/` for static resources

**File Structure**
- `/client` - Frontend React application
- `/server` - Backend Express/Socket.io server
- `/shared` - Shared types and schemas
- `/attached_assets` - Legacy implementation files (reference only)

## External Dependencies

### Core Runtime
- **Node.js**: Server runtime environment
- **Express.js**: Web application framework
- **Socket.io**: Real-time bidirectional event-based communication

### Database & ORM
- **Drizzle ORM**: TypeScript ORM (configured but not actively used)
- **@neondatabase/serverless**: Neon Postgres driver (configured in Drizzle config)
- **PostgreSQL**: Database system (configured via DATABASE_URL but storage currently in-memory)

### Frontend Libraries
- **React & React DOM**: UI library
- **TanStack Query**: Server state management and data synchronization
- **Wouter**: Lightweight routing solution
- **Socket.io Client**: WebSocket client for real-time features

### UI Components
- **Radix UI**: Unstyled accessible component primitives (20+ components)
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **class-variance-authority**: Type-safe variant styling
- **clsx & tailwind-merge**: Conditional className utilities

### Form & Validation
- **React Hook Form**: Form state management
- **Zod**: Schema validation library
- **@hookform/resolvers**: Validation resolver for React Hook Form

### Development Tools
- **Vite**: Frontend build tool and dev server
- **TypeScript**: Type system for JavaScript
- **ESBuild**: Fast JavaScript bundler for production builds
- **Drizzle Kit**: Database migration tool

### Session Management
- **connect-pg-simple**: PostgreSQL session store for Express (configured but session logic minimal)

### Additional Utilities
- **date-fns**: Date manipulation and formatting
- **nanoid**: Unique ID generation
- **cmdk**: Command menu component
- **embla-carousel-react**: Carousel component
- **vaul**: Drawer component
- **input-otp**: OTP input component
- **recharts**: Charting library
- **react-day-picker**: Date picker component

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal**: Error overlay for development
- **@replit/vite-plugin-cartographer**: Development tooling
- **@replit/vite-plugin-dev-banner**: Development banner