package config

import (
	"os"

	"github.com/joho/godotenv"
)

// Config holds all application configuration loaded from environment variables.
type Config struct {
	APIPort            string
	SupabaseURL        string
	SupabaseKey        string // anon key — for public reads
	SupabaseServiceKey string // service role key — for admin writes (bypasses RLS)
	FrontendOrigin     string
	JWTSecret          string
}

// Load reads configuration from environment variables with sensible defaults.
// It also attempts to load a .env file from the current directory (ignored if not found).
func Load() *Config {
	// Load .env file if present (silently ignored if missing — production uses env vars)
	_ = godotenv.Load()

	return &Config{
		// Fly.io sets PORT; fall back to API_PORT, then 8080
		APIPort:            getEnv("PORT", getEnv("API_PORT", "8080")),
		SupabaseURL:        getEnv("SUPABASE_URL", ""),
		SupabaseKey:        getEnv("SUPABASE_KEY", ""),
		SupabaseServiceKey: getEnv("SUPABASE_SERVICE_KEY", getEnv("SUPABASE_KEY", "")),
		FrontendOrigin:     getEnv("FRONTEND_ORIGIN", "http://localhost:8081"),
		JWTSecret:          getEnv("JWT_SECRET", "dev-secret-change-in-production"),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
