# ─── Build stage ─────────────────────────────────────────────────────────────
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Install git (needed for some go modules)
RUN apk add --no-cache git

# Copy module files first for layer caching
COPY go.mod go.sum ./
RUN go mod download

# Copy all source
COPY . .

# Build a static binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -ldflags="-w -s" -o server ./cmd/server/main.go

# ─── Runtime stage ────────────────────────────────────────────────────────────
FROM alpine:3.19

WORKDIR /app

# CA certs for HTTPS calls to Supabase
RUN apk --no-cache add ca-certificates tzdata

COPY --from=builder /app/server .

# Fly.io sets PORT env var; default to 8080
ENV PORT=8080
EXPOSE 8080

CMD ["./server"]
