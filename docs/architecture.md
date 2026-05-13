# Portfolio Platform — Architecture

> Last updated: May 2026

---

## Overview

A personal portfolio platform with a public-facing web app and an admin panel for content management. The stack is Expo (React Native Web) on the frontend and Go on the backend, deployed separately.

---

## Repository Structure

```
portfolio-platform/
├── apps/
│   ├── web/          # Expo web app (public portfolio + admin)
│   └── api/          # Go REST API
└── docs/             # Architecture documentation
```

No shared packages at the root — all frontend code lives inside `apps/web/`.

---

## apps/web

### Tech Stack

| Concern       | Choice                         |
| ------------- | ------------------------------ |
| Framework     | Expo SDK 55 / React Native Web |
| Language      | TypeScript (strict)            |
| Routing       | expo-router (file-based)       |
| State         | Zustand                        |
| Data fetching | TanStack React Query v5        |
| HTTP client   | Axios                          |
| Testing       | Vitest + fast-check (property) |

### Directory Layout

```
apps/web/
├── app/                        # Expo Router file-based routes
│   ├── (public)/               # Public portfolio routes
│   │   ├── _layout.tsx         # Wraps PublicLayout
│   │   ├── index.tsx           # Landing page
│   │   ├── resume.tsx          # Resume / PDF viewer
│   │   └── projects/
│   │       ├── index.tsx       # Project list
│   │       └── [slug].tsx      # Project detail
│   ├── admin/                  # Admin panel routes (auth-gated)
│   │   ├── _layout.tsx         # Wraps AdminLayout, auth guard
│   │   ├── index.tsx           # Dashboard
│   │   ├── content.tsx         # Portfolio content editor
│   │   ├── resume.tsx          # Resume PDF upload
│   │   └── projects/
│   │       ├── index.tsx       # Project list
│   │       ├── new.tsx         # Create project
│   │       └── [id].tsx        # Edit project
│   ├── login.tsx               # Login page
│   ├── _layout.tsx             # Root layout (QueryClient, ThemeProvider)
│   └── +not-found.tsx          # 404 page
│
└── src/                        # Application source
    ├── lib/                    # Self-contained library code
    │   ├── constants/          # Enums, API constants, theme tokens, upload limits
    │   ├── types/              # TypeScript interfaces (project, resume, api, content, theme)
    │   ├── utils/              # api-client (Axios), storage helpers, validators
    │   ├── hooks/              # React Query hooks (useProjects, useResume, useContent, useAdmin)
    │   └── ui/                 # Atomic design component library
    │       ├── atoms/          # Button, Text, Input, Icon, Badge, Skeleton, Image
    │       ├── molecules/      # ProjectCard, NavLink, ThemeToggle, SocialLink, FormField, SkeletonCard
    │       ├── organisms/      # HeroSection, TechStackSection, Timeline, ProjectGrid,
    │       │                   # ContactForm, DemoRunner, EmulatorView
    │       ├── layouts/        # PublicLayout, AdminLayout
    │       └── hooks/          # useTheme
    │
    ├── components/             # App-specific components
    │   ├── MetaHead.tsx        # SEO / Open Graph meta injection
    │   └── admin/
    │       ├── ProjectForm/    # Project create/edit form
    │       └── content/        # Content editor tabs (Identity, Social, Tech, Work, Edu)
    │
    ├── stores/                 # Zustand stores
    │   ├── auth-store.ts       # Token, isAuthenticated
    │   ├── theme-store.ts      # Dark/light mode, localStorage persistence
    │   └── ui-store.ts         # Sidebar, modal visibility
    │
    ├── hooks/                  # Screen-level hooks
    │   └── projects/
    │       ├── useProjectList.ts   # Pagination state + useProjects
    │       └── useProjectDetail.ts # useProject by slug
    │
    ├── providers/
    │   └── theme-provider.tsx  # ThemeContext, hydrates from store
    │
    ├── error/
    │   └── error-boundary.tsx  # React error boundary
    │
    └── utils/
        └── metadata.ts         # generateMetadata(), generateSitemap()
```

### Component Convention

Every component lives in its own folder:

```
ComponentName/
├── ComponentName.tsx       # Component logic only — no StyleSheet.create
├── ComponentName.style.ts  # All styles
└── index.ts                # Re-export
```

### Path Alias

All `src/` imports use the `@/` alias:

```ts
import { apiClient } from "@/lib/utils/api-client";
import { useProjects } from "@/lib/hooks/useProjects";
import { HeroSection } from "@/lib/ui/organisms/HeroSection";
```

Configured in `tsconfig.json` (`baseUrl: "."`, `paths: { "@/*": ["src/*"] }`) and `vitest.config.ts`.

### Data Flow

```
Route (app/)
  └── Screen hook (src/hooks/) or direct React Query hook (src/lib/hooks/)
        └── apiClient (src/lib/utils/api-client.ts)
              └── Go API (apps/api)
```

Auth token is injected via Axios request interceptor. 401 responses clear the token and redirect to `/login`.

### State Management

| Store       | Responsibility                            |
| ----------- | ----------------------------------------- |
| auth-store  | JWT token, isAuthenticated flag           |
| theme-store | Dark/light mode, localStorage persistence |
| ui-store    | Sidebar open state, active modal          |

### Testing

Property-based tests live in `__tests__/properties/` using Vitest + fast-check. They cover:

- JWT injection on every request
- Theme persistence round-trip
- Cache invalidation on admin mutations
- Demo runner routing by project type
- SEO metadata generation
- Admin route redirect when unauthenticated
- ARIA labels on interactive elements
- WCAG contrast ratios
- Modal focus trapping

---

## apps/api

Go REST API. See `apps/api/README.md` for full details.

### Structure

```
apps/api/
├── cmd/server/main.go          # Entry point
└── internal/
    ├── config/                 # Environment config
    ├── handler/                # HTTP handlers
    ├── middleware/             # Auth, CORS, rate limit, logger
    ├── model/                  # Domain types
    ├── repository/             # Supabase data access
    └── service/                # Business logic
```

### Key Endpoints

| Method | Path                | Auth   | Description              |
| ------ | ------------------- | ------ | ------------------------ |
| GET    | /projects           | —      | List projects            |
| GET    | /projects/:slug     | —      | Project detail           |
| GET    | /featured-projects  | —      | Featured projects        |
| GET    | /resume             | —      | Resume data              |
| GET    | /content            | —      | Portfolio content        |
| POST   | /contact            | —      | Send contact message     |
| POST   | /admin/login        | —      | Get JWT token            |
| POST   | /admin/projects     | Bearer | Create project           |
| PUT    | /admin/projects/:id | Bearer | Update project           |
| DELETE | /admin/projects/:id | Bearer | Delete project           |
| POST   | /admin/upload       | Bearer | Upload image             |
| POST   | /admin/resume       | Bearer | Upload resume PDF        |
| PUT    | /admin/content      | Bearer | Update portfolio content |

---

## Deployment

- **Web**: Expo static export → served as static files
- **API**: Docker container on Fly.io (see `apps/api/DEPLOY.md`)
- **Storage**: Supabase (PostgreSQL + Storage)
