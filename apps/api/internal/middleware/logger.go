package middleware

import (
	"encoding/json"
	"log"
	"time"

	"github.com/gin-gonic/gin"
)

// logEntry represents a structured log record for an HTTP request.
type logEntry struct {
	Method   string  `json:"method"`
	Path     string  `json:"path"`
	Status   int     `json:"status"`
	Duration float64 `json:"duration_ms"`
	ClientIP string  `json:"client_ip"`
}

// Logger returns a middleware that produces structured JSON logs for each request.
// It logs method, path, status code, duration in milliseconds, and client IP.
func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()

		// Process request
		c.Next()

		entry := logEntry{
			Method:   c.Request.Method,
			Path:     c.Request.URL.Path,
			Status:   c.Writer.Status(),
			Duration: float64(time.Since(start).Microseconds()) / 1000.0,
			ClientIP: c.ClientIP(),
		}

		data, err := json.Marshal(entry)
		if err != nil {
			log.Printf("failed to marshal log entry: %v", err)
			return
		}

		log.Println(string(data))
	}
}
