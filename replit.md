# The Daily Pulse - News Aggregator

## Overview

A full-stack news aggregator web application that scrapes trending articles from multiple news sources across five categories: International, Sports, Technology, Health, and Science. The application provides a clean, newspaper-style interface for browsing and reading news articles with live web scraping capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management and caching
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **UI Components**: Radix UI primitives wrapped with custom styling, Framer Motion for animations
- **Typography**: Playfair Display for headings (serif), Inter for body text (sans-serif)

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript compiled with tsx for development, esbuild for production
- **API Design**: RESTful endpoints under `/api/` prefix
- **Web Scraping**: Axios for HTTP requests, Cheerio for HTML parsing
- **Caching**: In-memory article cache with configurable TTL to reduce scraping frequency

### Data Flow
1. Frontend requests articles via `/api/articles` endpoint
2. Backend checks in-memory cache for existing articles
3. If cache is empty or stale, scraper fetches from news sources (BBC, Reuters, etc.)
4. Articles are parsed, normalized, and stored in cache
5. Response sent to client with article data

### Key Design Decisions

**In-Memory Caching Over Database for Articles**
- Articles are scraped content, not user-generated data
- Reduces database load for read-heavy operations
- Cache invalidation is simple since content refreshes periodically

**Monorepo Structure**
- `client/` - React frontend application
- `server/` - Express backend with scraping logic
- `shared/` - Shared TypeScript types and database schema

**Database Schema (PostgreSQL with Drizzle ORM)**
- Currently minimal schema with users table for potential future authentication
- Schema defined in `shared/schema.ts` using Drizzle ORM
- Migrations stored in `migrations/` directory

## External Dependencies

### Database
- **PostgreSQL**: Primary database configured via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database access with schema defined in `shared/schema.ts`
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### News Sources (Scraping Targets)
- BBC News World section
- Reuters World news
- Additional sources per category defined in `server/scraper.ts`

### Third-Party Services
- No external API keys required for core functionality
- Scraping relies on public news websites

### Key NPM Packages
- **axios**: HTTP client for scraping requests
- **cheerio**: jQuery-like HTML parsing for server-side scraping
- **date-fns**: Date formatting and manipulation
- **framer-motion**: Animation library for UI transitions
- **zod**: Runtime type validation for API payloads