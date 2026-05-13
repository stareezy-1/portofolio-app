# Deploy to Fly.io (Free)

## 1. Install flyctl

```bash
# macOS
brew install flyctl

# or via script
curl -L https://fly.io/install.sh | sh
```

## 2. Sign up & login

```bash
fly auth signup   # creates a free account
# or
fly auth login    # if you already have an account
```

> Fly.io free tier: 3 shared VMs, no credit card required for basic usage.

## 3. Launch the app (first time only)

Run this from the `apps/api/` directory:

```bash
fly launch --no-deploy
```

When prompted:

- **App name**: `portfolio-api-bintang` (or any unique name)
- **Region**: `sin` (Singapore) — closest to South Tangerang
- **Dockerfile**: yes (it will detect it automatically)
- **PostgreSQL**: no (we use Supabase)
- **Redis**: no

This creates the app on Fly.io and updates `fly.toml`.

## 4. Set secrets (environment variables)

```bash
fly secrets set \
  SUPABASE_URL="https://YOUR_PROJECT_ID.supabase.co" \
  SUPABASE_KEY="your-anon-key" \
  SUPABASE_SERVICE_KEY="your-service-role-key" \
  JWT_SECRET="your-super-secret-jwt-key" \
  FRONTEND_ORIGIN="https://your-portfolio.vercel.app"
```

> Never commit secrets to git. `fly secrets` stores them encrypted.

## 5. Deploy

```bash
fly deploy
```

This builds the Docker image, pushes it, and starts the app. Takes ~2 minutes.

## 6. Get your API URL

```bash
fly status
```

Your API will be at: `https://portfolio-api-bintang.fly.dev`

Test it:

```bash
curl https://portfolio-api-bintang.fly.dev/health
# {"status":"ok"}
```

## 7. Update CORS after Vercel deploy

Once you have your Vercel URL, update the FRONTEND_ORIGIN secret:

```bash
fly secrets set FRONTEND_ORIGIN="https://your-actual-vercel-url.vercel.app"
```

## 8. Update frontend env

In Vercel dashboard → Settings → Environment Variables, add:

```
EXPO_PUBLIC_API_URL=https://portfolio-api-bintang.fly.dev
```

---

## Useful commands

```bash
fly logs          # View live logs
fly status        # App status
fly ssh console   # SSH into the container
fly deploy        # Redeploy after code changes
fly secrets list  # List secret names (not values)
```

## Free tier limits

- 3 shared-cpu-1x VMs with 256MB RAM
- `auto_stop_machines = true` means the VM sleeps when idle
- Cold start on first request after sleep: ~1-2 seconds
- For a portfolio this is perfectly fine

## Redeployment (after code changes)

```bash
# From apps/api/
fly deploy
```

Or set up GitHub Actions for auto-deploy on push (see below).

## Optional: Auto-deploy with GitHub Actions

Create `.github/workflows/deploy-api.yml` in the repo root:

```yaml
name: Deploy API to Fly.io

on:
  push:
    branches: [main]
    paths: [apps/api/**]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: fly deploy --remote-only
        working-directory: apps/api
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

Get your token: `fly tokens create deploy -x 999999h`
Add it to GitHub: Settings → Secrets → `FLY_API_TOKEN`
