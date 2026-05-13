# Portfolio API

Go/Gin backend for the Portfolio Platform.

## Tech Stack

- **Language**: Go 1.22
- **Framework**: Gin
- **Database**: Supabase (PostgreSQL via REST API)
- **Auth**: Supabase Auth + JWT (golang-jwt/jwt/v5)
- **Testing**: Go testing + rapid (property-based tests)

## Architecture

Layered architecture: Handler → Service → Repository → Supabase

```
apps/api/
├── cmd/server/main.go          # Entry point, dependency wiring
├── internal/
│   ├── config/                 # Environment variable loading
│   ├── handler/                # HTTP handlers (Gin)
│   ├── middleware/             # CORS, rate limiting, logging, auth
│   ├── model/                  # Domain models (Project, Resume, ApiResponse)
│   ├── repository/             # Supabase data access layer
│   └── service/                # Business logic layer
└── pkg/supabase/               # Supabase HTTP client wrapper
```

## Endpoints

### Public

- `GET /projects?page=1&limit=10` — Paginated project list
- `GET /projects/:slug` — Project by slug
- `GET /featured-projects` — Featured projects
- `GET /resume` — Resume data

### Admin (JWT required)

- `POST /admin/login` — Authenticate, returns JWT
- `POST /admin/projects` — Create project
- `PUT /admin/projects/:id` — Update project
- `DELETE /admin/projects/:id` — Delete project
- `POST /admin/upload` — Upload file (image/PDF)
- `POST /admin/resume` — Upload resume PDF

## Running

```bash
go run cmd/server/main.go
```

## Environment Variables

```
API_PORT=8080
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=your-anon-key
FRONTEND_ORIGIN=http://localhost:8081
JWT_SECRET=your-secret
```

## Testing

```bash
go test ./...
```
