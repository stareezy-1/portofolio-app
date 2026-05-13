package middleware

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"pgregory.net/rapid"
)

// Feature: portfolio-platform, Property 16: Rate limiting enforcement
// Validates: Requirements 9.4

func createRateLimitTestRouter(cfg RateLimitConfig) *gin.Engine {
	r := gin.New()
	r.Use(RateLimiter(cfg))
	r.GET("/projects", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"success": true, "data": []string{}})
	})
	r.GET("/projects/:slug", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"success": true, "data": gin.H{"slug": c.Param("slug")}})
	})
	r.GET("/featured-projects", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"success": true, "data": []string{}})
	})
	r.GET("/resume", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"success": true, "data": gin.H{}})
	})
	return r
}

func TestPropertyRateLimitAllowsUpToLimit(t *testing.T) {
	// Property: For any rate limit configuration, exactly `rate` requests SHALL succeed with 200.
	rapid.Check(t, func(t *rapid.T) {
		rate := rapid.IntRange(5, 20).Draw(t, "rate")
		cfg := RateLimitConfig{
			Rate:   rate,
			Window: 1 * time.Minute,
		}
		router := createRateLimitTestRouter(cfg)

		for i := 0; i < rate; i++ {
			req := httptest.NewRequest("GET", "/projects", nil)
			req.RemoteAddr = "192.168.1.1:12345"
			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			if w.Code != http.StatusOK {
				t.Fatalf("request %d of %d: expected 200, got %d", i+1, rate, w.Code)
			}
		}
	})
}

func TestPropertyRateLimitRejectsAfterExceeding(t *testing.T) {
	// Property: For any client exceeding the configured rate limit, the next request SHALL receive 429.
	rapid.Check(t, func(t *rapid.T) {
		rate := rapid.IntRange(5, 20).Draw(t, "rate")
		cfg := RateLimitConfig{
			Rate:   rate,
			Window: 1 * time.Minute,
		}
		router := createRateLimitTestRouter(cfg)

		// Exhaust all tokens
		for i := 0; i < rate; i++ {
			req := httptest.NewRequest("GET", "/projects", nil)
			req.RemoteAddr = "10.0.0.1:9999"
			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			if w.Code != http.StatusOK {
				t.Fatalf("request %d of %d: expected 200 while exhausting tokens, got %d", i+1, rate, w.Code)
			}
		}

		// The next request should be rate limited
		req := httptest.NewRequest("GET", "/projects", nil)
		req.RemoteAddr = "10.0.0.1:9999"
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code != http.StatusTooManyRequests {
			t.Fatalf("request %d (exceeding limit of %d): expected 429, got %d", rate+1, rate, w.Code)
		}
	})
}

func TestPropertyRateLimitResponseContainsErrorCode(t *testing.T) {
	// Property: When rate limited, the 429 response SHALL contain the RATE_LIMITED error code.
	rapid.Check(t, func(t *rapid.T) {
		rate := rapid.IntRange(5, 20).Draw(t, "rate")
		endpoint := rapid.SampledFrom([]string{
			"/projects",
			"/projects/test-slug",
			"/featured-projects",
			"/resume",
		}).Draw(t, "endpoint")

		cfg := RateLimitConfig{
			Rate:   rate,
			Window: 1 * time.Minute,
		}
		router := createRateLimitTestRouter(cfg)

		// Exhaust all tokens
		for i := 0; i < rate; i++ {
			req := httptest.NewRequest("GET", endpoint, nil)
			req.RemoteAddr = "172.16.0.1:8080"
			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)
		}

		// Verify the 429 response body
		req := httptest.NewRequest("GET", endpoint, nil)
		req.RemoteAddr = "172.16.0.1:8080"
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code != http.StatusTooManyRequests {
			t.Fatalf("expected 429 on endpoint %s after %d requests, got %d", endpoint, rate, w.Code)
		}

		var body map[string]interface{}
		if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
			t.Fatalf("failed to parse response body: %v", err)
		}

		// Verify success is false
		success, ok := body["success"].(bool)
		if !ok || success {
			t.Fatalf("expected success=false in rate limit response, got %v", body["success"])
		}

		// Verify error.code is RATE_LIMITED
		errObj, ok := body["error"].(map[string]interface{})
		if !ok {
			t.Fatalf("expected error object in response, got %v", body["error"])
		}

		code, ok := errObj["code"].(string)
		if !ok || code != "RATE_LIMITED" {
			t.Fatalf("expected error code 'RATE_LIMITED', got %q", code)
		}
	})
}

func TestPropertyRateLimitPerIPIsolation(t *testing.T) {
	// Property: Rate limiting is per-IP; one client being rate limited SHALL NOT affect another client.
	rapid.Check(t, func(t *rapid.T) {
		rate := rapid.IntRange(5, 15).Draw(t, "rate")
		cfg := RateLimitConfig{
			Rate:   rate,
			Window: 1 * time.Minute,
		}
		router := createRateLimitTestRouter(cfg)

		// Exhaust tokens for client A
		for i := 0; i < rate; i++ {
			req := httptest.NewRequest("GET", "/projects", nil)
			req.RemoteAddr = "10.0.0.100:1234"
			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)
		}

		// Verify client A is rate limited
		reqA := httptest.NewRequest("GET", "/projects", nil)
		reqA.RemoteAddr = "10.0.0.100:1234"
		wA := httptest.NewRecorder()
		router.ServeHTTP(wA, reqA)

		if wA.Code != http.StatusTooManyRequests {
			t.Fatalf("client A should be rate limited, got %d", wA.Code)
		}

		// Client B should still be able to make requests
		reqB := httptest.NewRequest("GET", "/projects", nil)
		reqB.RemoteAddr = "10.0.0.200:5678"
		wB := httptest.NewRecorder()
		router.ServeHTTP(wB, reqB)

		if wB.Code != http.StatusOK {
			t.Fatalf("client B should not be rate limited (client A exhausted), got %d", wB.Code)
		}
	})
}
