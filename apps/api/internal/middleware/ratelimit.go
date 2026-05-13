package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

// RateLimitConfig holds configuration for the rate limiter middleware.
type RateLimitConfig struct {
	Rate     int           // Maximum number of requests allowed per window
	Window   time.Duration // Time window for rate limiting
}

// bucket tracks token state for a single IP.
type bucket struct {
	tokens    int
	lastReset time.Time
}

// RateLimiter returns a middleware that enforces per-IP rate limiting using a token bucket algorithm.
func RateLimiter(cfg RateLimitConfig) gin.HandlerFunc {
	var buckets sync.Map

	return func(c *gin.Context) {
		ip := c.ClientIP()
		now := time.Now()

		val, _ := buckets.LoadOrStore(ip, &bucket{
			tokens:    cfg.Rate,
			lastReset: now,
		})

		b := val.(*bucket)

		// Refill tokens if the window has elapsed
		elapsed := now.Sub(b.lastReset)
		if elapsed >= cfg.Window {
			periods := int(elapsed / cfg.Window)
			b.tokens = min(cfg.Rate, b.tokens+periods*cfg.Rate)
			b.lastReset = b.lastReset.Add(time.Duration(periods) * cfg.Window)
		}

		if b.tokens <= 0 {
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"success": false,
				"data":    nil,
				"error": gin.H{
					"code":    "RATE_LIMITED",
					"message": "Too many requests. Please try again later.",
				},
			})
			return
		}

		b.tokens--
		c.Next()
	}
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
