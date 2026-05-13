package middleware

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"pgregory.net/rapid"
)

// Feature: portfolio-platform, Property 17: CORS origin restriction
// Validates: Requirements 9.5

func createCORSTestRouter(cfg CORSConfig) *gin.Engine {
	r := gin.New()
	r.Use(CORS(cfg))
	r.GET("/projects", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"success": true, "data": []string{}})
	})
	r.POST("/admin/projects", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"success": true})
	})
	r.OPTIONS("/projects", func(c *gin.Context) {
		// This handler should not be reached for OPTIONS since CORS middleware handles it
		c.JSON(http.StatusOK, gin.H{})
	})
	r.OPTIONS("/admin/projects", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{})
	})
	return r
}

// genValidOrigin generates a random valid URL origin (scheme + host).
func genValidOrigin() *rapid.Generator[string] {
	return rapid.Custom(func(t *rapid.T) string {
		scheme := rapid.SampledFrom([]string{"http", "https"}).Draw(t, "scheme")
		// Generate a random domain-like host
		hostLen := rapid.IntRange(3, 20).Draw(t, "hostLen")
		hostBytes := make([]byte, hostLen)
		for i := range hostBytes {
			hostBytes[i] = byte(rapid.IntRange(97, 122).Draw(t, "hostByte")) // a-z
		}
		tld := rapid.SampledFrom([]string{".com", ".org", ".net", ".io", ".dev"}).Draw(t, "tld")
		host := string(hostBytes) + tld

		// Optionally add a port
		usePort := rapid.Bool().Draw(t, "usePort")
		if usePort {
			port := rapid.IntRange(1000, 9999).Draw(t, "port")
			return fmt.Sprintf("%s://%s:%d", scheme, host, port)
		}
		return fmt.Sprintf("%s://%s", scheme, host)
	})
}

// genDifferentOrigin generates an origin guaranteed to differ from the given allowed origin.
func genDifferentOrigin(allowedOrigin string) *rapid.Generator[string] {
	return rapid.Custom(func(t *rapid.T) string {
		for {
			origin := genValidOrigin().Draw(t, "differentOrigin")
			if origin != allowedOrigin {
				return origin
			}
		}
	})
}

func TestPropertyCORSAllowedOriginGetsHeaders(t *testing.T) {
	// Property: For any request from the configured allowed origin, the response SHALL include
	// Access-Control-Allow-Origin header matching that origin.
	rapid.Check(t, func(t *rapid.T) {
		allowedOrigin := genValidOrigin().Draw(t, "allowedOrigin")
		cfg := CORSConfig{AllowedOrigin: allowedOrigin}
		router := createCORSTestRouter(cfg)

		req := httptest.NewRequest("GET", "/projects", nil)
		req.Header.Set("Origin", allowedOrigin)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		acao := w.Header().Get("Access-Control-Allow-Origin")
		if acao != allowedOrigin {
			t.Fatalf("expected Access-Control-Allow-Origin=%q for allowed origin, got %q", allowedOrigin, acao)
		}

		// Verify other CORS headers are also set
		acam := w.Header().Get("Access-Control-Allow-Methods")
		if acam == "" {
			t.Fatalf("expected Access-Control-Allow-Methods to be set for allowed origin")
		}

		acah := w.Header().Get("Access-Control-Allow-Headers")
		if acah == "" {
			t.Fatalf("expected Access-Control-Allow-Headers to be set for allowed origin")
		}
	})
}

func TestPropertyCORSDisallowedOriginNoHeaders(t *testing.T) {
	// Property: For any request from an origin NOT matching the configured frontend origin,
	// the response SHALL NOT include permissive Access-Control-Allow-Origin headers.
	rapid.Check(t, func(t *rapid.T) {
		allowedOrigin := genValidOrigin().Draw(t, "allowedOrigin")
		disallowedOrigin := genDifferentOrigin(allowedOrigin).Draw(t, "disallowedOrigin")
		cfg := CORSConfig{AllowedOrigin: allowedOrigin}
		router := createCORSTestRouter(cfg)

		req := httptest.NewRequest("GET", "/projects", nil)
		req.Header.Set("Origin", disallowedOrigin)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		acao := w.Header().Get("Access-Control-Allow-Origin")
		if acao != "" {
			t.Fatalf("expected no Access-Control-Allow-Origin for disallowed origin %q (allowed: %q), got %q",
				disallowedOrigin, allowedOrigin, acao)
		}

		// Also verify no other CORS headers leak
		acam := w.Header().Get("Access-Control-Allow-Methods")
		if acam != "" {
			t.Fatalf("expected no Access-Control-Allow-Methods for disallowed origin, got %q", acam)
		}
	})
}

func TestPropertyCORSPreflightAllowedOriginReturns204(t *testing.T) {
	// Property: For any OPTIONS preflight request from the allowed origin,
	// the response SHALL be 204 No Content.
	rapid.Check(t, func(t *rapid.T) {
		allowedOrigin := genValidOrigin().Draw(t, "allowedOrigin")
		endpoint := rapid.SampledFrom([]string{"/projects", "/admin/projects"}).Draw(t, "endpoint")
		cfg := CORSConfig{AllowedOrigin: allowedOrigin}
		router := createCORSTestRouter(cfg)

		req := httptest.NewRequest("OPTIONS", endpoint, nil)
		req.Header.Set("Origin", allowedOrigin)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code != http.StatusNoContent {
			t.Fatalf("expected 204 for OPTIONS preflight from allowed origin %q on %s, got %d",
				allowedOrigin, endpoint, w.Code)
		}

		// Verify CORS headers are present on preflight response
		acao := w.Header().Get("Access-Control-Allow-Origin")
		if acao != allowedOrigin {
			t.Fatalf("expected Access-Control-Allow-Origin=%q on preflight response, got %q", allowedOrigin, acao)
		}
	})
}

func TestPropertyCORSPreflightDisallowedOriginReturns403(t *testing.T) {
	// Property: For any OPTIONS preflight request from a disallowed origin,
	// the response SHALL be 403 Forbidden.
	rapid.Check(t, func(t *rapid.T) {
		allowedOrigin := genValidOrigin().Draw(t, "allowedOrigin")
		disallowedOrigin := genDifferentOrigin(allowedOrigin).Draw(t, "disallowedOrigin")
		endpoint := rapid.SampledFrom([]string{"/projects", "/admin/projects"}).Draw(t, "endpoint")
		cfg := CORSConfig{AllowedOrigin: allowedOrigin}
		router := createCORSTestRouter(cfg)

		req := httptest.NewRequest("OPTIONS", endpoint, nil)
		req.Header.Set("Origin", disallowedOrigin)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code != http.StatusForbidden {
			t.Fatalf("expected 403 for OPTIONS preflight from disallowed origin %q (allowed: %q) on %s, got %d",
				disallowedOrigin, allowedOrigin, endpoint, w.Code)
		}

		// Verify no CORS headers are set for disallowed origin
		acao := w.Header().Get("Access-Control-Allow-Origin")
		if acao != "" {
			t.Fatalf("expected no Access-Control-Allow-Origin for disallowed preflight, got %q", acao)
		}
	})
}

func TestPropertyCORSNoOriginHeaderNoPermissiveResponse(t *testing.T) {
	// Property: For any request without an Origin header, the response SHALL NOT include
	// Access-Control-Allow-Origin headers (no wildcard or permissive default).
	rapid.Check(t, func(t *rapid.T) {
		allowedOrigin := genValidOrigin().Draw(t, "allowedOrigin")
		cfg := CORSConfig{AllowedOrigin: allowedOrigin}
		router := createCORSTestRouter(cfg)

		req := httptest.NewRequest("GET", "/projects", nil)
		// No Origin header set
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		acao := w.Header().Get("Access-Control-Allow-Origin")
		if acao != "" {
			t.Fatalf("expected no Access-Control-Allow-Origin when no Origin header is sent, got %q", acao)
		}
	})
}
