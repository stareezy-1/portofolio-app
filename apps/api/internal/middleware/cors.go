package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// CORSConfig holds configuration for the CORS middleware.
type CORSConfig struct {
	AllowedOrigin string
}

// CORS returns a middleware that restricts cross-origin requests to the configured origin.
func CORS(cfg CORSConfig) gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.GetHeader("Origin")

		if origin == cfg.AllowedOrigin {
			c.Header("Access-Control-Allow-Origin", cfg.AllowedOrigin)
			c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
			c.Header("Access-Control-Max-Age", "86400")
		}

		// Handle preflight OPTIONS requests
		if c.Request.Method == http.MethodOptions {
			if origin == cfg.AllowedOrigin {
				c.AbortWithStatus(http.StatusNoContent)
			} else {
				c.AbortWithStatus(http.StatusForbidden)
			}
			return
		}

		c.Next()
	}
}
