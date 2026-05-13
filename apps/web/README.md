# Portfolio Web App

Expo 55 web frontend for the Portfolio Platform.

## Tech Stack

- **Framework**: Expo 55 + React Native Web
- **Routing**: Expo Router (file-based)
- **State**: React Query (server state) + Zustand (client state)
- **HTTP**: Axios via `@portfolio/utils/api-client`
- **Styling**: StyleSheet.create — no inline styles, co-located `.style.ts` files
- **Testing**: Vitest + fast-check (property-based tests)

## Structure

```
apps/web/
├── app/                    # Expo Router file-based routes
│   ├── (public)/           # Public routes (landing, projects, resume)
│   ├── (admin)/            # Protected admin routes
│   ├── _layout.tsx         # Root layout (ErrorBoundary + QueryClient + ThemeProvider)
│   ├── login.tsx           # Admin login page
│   └── +not-found.tsx      # 404 page
├── src/
│   ├── components/         # App-specific components
│   │   ├── admin/          # Admin-only components (ProjectForm)
│   │   └── MetaHead.tsx    # SEO metadata hook
│   ├── error/              # ErrorBoundary component
│   ├── providers/          # ThemeProvider
│   ├── stores/             # Zustand stores (theme, auth, ui)
│   └── utils/              # App-specific utilities (metadata)
└── __tests__/
    └── properties/         # Property-based tests (fast-check)
```

## Running

```bash
yarn start          # Start dev server
yarn build          # Export static web build
yarn test           # Run property tests
```

## Environment Variables

```
EXPO_PUBLIC_API_URL=http://localhost:8080
```
