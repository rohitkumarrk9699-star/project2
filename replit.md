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
- **Caching**: Persistent in-memory article cache that survives navigation and page refreshes, until manually triggered

### Data Flow
1. **On First Page Load**: Frontend requests articles via `/api/scrape-all` endpoint
2. **Cache Check**: Backend checks in-memory cache
3. **Initial Scrape** (if cache empty): Scraper fetches from news sources (BBC, Reuters, TechCrunch, etc.)
4. **Cache Storage**: Articles are parsed, normalized, and stored in persistent in-memory cache
5. **Subsequent Requests**: All navigation and page refreshes return cached articles instantly
6. **Manual Refresh Only**: User explicitly calls `POST /api/trigger-scrape` to refresh articles
7. **Vercel Compatible**: Caching works within serverless function lifetime; first request triggers scrape

### Data Flow Diagram
```
<!-- Removed all Replit references and signatures -->