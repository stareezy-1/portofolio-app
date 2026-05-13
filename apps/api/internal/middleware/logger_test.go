package middleware

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"pgregory.net/rapid"
)

// Feature: portfolio-platform, Property 18: Structured request logging
// Validates: Requirements 9.6

func createLoggerTestRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(Logger())
	r.GET("/*path", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"success": true})
	})
	r.POST("/*path", func(c *gin.Context) {
		c.JSON(http.StatusCreated, gin.H{"success": true})
	})
	r.PUT("/*path", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"success": true})
	})
	r.DELETE("/*path", func(c *gin.Context) {
		c.JSON(http.StatusNoContent, nil)
	})
	return r
}

// genLoggerHTTPMethod generates a random HTTP method from common methods.
func genLoggerHTTPMethod() *rapid.Generator[string] {
	return rapid.SampledFrom([]string{"GET", "POST", "PUT", "DELETE"})
}

// genPath generates a random URL path starting with /.
func genPath() *rapid.Generator[string] {
	return rapid.Custom(func(t *rapid.T) string {
		segments := rapid.IntRange(1, 4).Draw(t, "numSegments")
		path := ""
		for i := 0; i < segments; i++ {
			segLen := rapid.IntRange(1, 12).Draw(t, "segLen")
			segBytes := make([]byte, segLen)
			for j := range segBytes {
				segBytes[j] = byte(rapid.SampledFrom([]byte("abcdefghijklmnopqrstuvwxyz0123456789-")).Draw(t, "pathChar"))
			}
			path += "/" + string(segBytes)
		}
		return path
	})
}

func TestPropertyLoggerOutputContainsRequiredFields(t *testing.T) {
	// Property: For any HTTP request processed by the backend, the structured log output
	// SHALL contain the fields: method, path, status code, and duration.
	rapid.Check(t, func(t *rapid.T) {
		method := genLoggerHTTPMethod().Draw(t, "method")
		path := genPath().Draw(t, "path")

		router := createLoggerTestRouter()

		// Capture log output
		var buf bytes.Buffer
		log.SetOutput(&buf)
		log.SetFlags(0) // Remove timestamp prefix for clean JSON parsing
		defer func() {
			log.SetOutput(nil)
			log.SetFlags(log.LstdFlags)
		}()

		req := httptest.NewRequest(method, path, nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		// Parse the log output as JSON
		logOutput := buf.String()
		if logOutput == "" {
			t.Fatalf("expected log output for %s %s, got empty string", method, path)
		}

		// log.Println adds a trailing newline; trim it
		logOutput = logOutput[:len(logOutput)-1]

		var entry map[string]interface{}
		if err := json.Unmarshal([]byte(logOutput), &entry); err != nil {
			t.Fatalf("log output is not valid JSON for %s %s: %v\nOutput: %q", method, path, err, logOutput)
		}

		// Verify "method" field exists and matches
		logMethod, ok := entry["method"].(string)
		if !ok {
			t.Fatalf("log entry missing 'method' field for %s %s: %v", method, path, entry)
		}
		if logMethod != method {
			t.Fatalf("expected method=%q, got %q", method, logMethod)
		}

		// Verify "path" field exists and matches
		logPath, ok := entry["path"].(string)
		if !ok {
			t.Fatalf("log entry missing 'path' field for %s %s: %v", method, path, entry)
		}
		if logPath != path {
			t.Fatalf("expected path=%q, got %q", path, logPath)
		}

		// Verify "status" field exists and is a number
		logStatus, ok := entry["status"].(float64)
		if !ok {
			t.Fatalf("log entry missing 'status' field for %s %s: %v", method, path, entry)
		}
		if logStatus < 100 || logStatus > 599 {
			t.Fatalf("expected valid HTTP status code, got %v", logStatus)
		}

		// Verify "duration_ms" field exists and is non-negative
		logDuration, ok := entry["duration_ms"].(float64)
		if !ok {
			t.Fatalf("log entry missing 'duration_ms' field for %s %s: %v", method, path, entry)
		}
		if logDuration < 0 {
			t.Fatalf("expected non-negative duration_ms, got %v", logDuration)
		}
	})
}

func TestPropertyLoggerDurationIsNonNegative(t *testing.T) {
	// Property: For any HTTP request, the logged duration_ms SHALL be non-negative.
	rapid.Check(t, func(t *rapid.T) {
		method := genLoggerHTTPMethod().Draw(t, "method")
		path := genPath().Draw(t, "path")

		router := createLoggerTestRouter()

		var buf bytes.Buffer
		log.SetOutput(&buf)
		log.SetFlags(0)
		defer func() {
			log.SetOutput(nil)
			log.SetFlags(log.LstdFlags)
		}()

		req := httptest.NewRequest(method, path, nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		logOutput := buf.String()
		logOutput = logOutput[:len(logOutput)-1]

		var entry map[string]interface{}
		if err := json.Unmarshal([]byte(logOutput), &entry); err != nil {
			t.Fatalf("log output is not valid JSON: %v\nOutput: %q", err, logOutput)
		}

		duration, ok := entry["duration_ms"].(float64)
		if !ok {
			t.Fatalf("log entry missing 'duration_ms' field: %v", entry)
		}
		if duration < 0 {
			t.Fatalf("duration_ms must be non-negative, got %v for %s %s", duration, method, path)
		}
	})
}

func TestPropertyLoggerStatusMatchesResponse(t *testing.T) {
	// Property: The logged status code SHALL match the actual HTTP response status code.
	rapid.Check(t, func(t *rapid.T) {
		method := genLoggerHTTPMethod().Draw(t, "method")
		path := genPath().Draw(t, "path")

		router := createLoggerTestRouter()

		var buf bytes.Buffer
		log.SetOutput(&buf)
		log.SetFlags(0)
		defer func() {
			log.SetOutput(nil)
			log.SetFlags(log.LstdFlags)
		}()

		req := httptest.NewRequest(method, path, nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		logOutput := buf.String()
		logOutput = logOutput[:len(logOutput)-1]

		var entry map[string]interface{}
		if err := json.Unmarshal([]byte(logOutput), &entry); err != nil {
			t.Fatalf("log output is not valid JSON: %v\nOutput: %q", err, logOutput)
		}

		logStatus := int(entry["status"].(float64))
		actualStatus := w.Code

		if logStatus != actualStatus {
			t.Fatalf("logged status %d does not match actual response status %d for %s %s",
				logStatus, actualStatus, method, path)
		}
	})
}
