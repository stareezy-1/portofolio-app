package middleware

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"pgregory.net/rapid"
)

// Feature: portfolio-platform, Property 8: Authentication middleware enforcement
// Validates: Requirements 5.2, 5.3, 5.6

func init() {
	gin.SetMode(gin.TestMode)
}

// createTestRouter sets up a gin router with the auth middleware and a simple handler.
func createTestRouter(secret string) *gin.Engine {
	r := gin.New()
	admin := r.Group("/admin")
	admin.Use(Auth(AuthConfig{JWTSecret: secret}))
	admin.GET("/test", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"success": true})
	})
	admin.POST("/projects", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"success": true})
	})
	admin.PUT("/projects/:id", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"success": true})
	})
	admin.DELETE("/projects/:id", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"success": true})
	})
	return r
}

// generateValidToken creates a valid JWT token with the given role and expiration.
func generateValidToken(secret string, role string, expiresAt time.Time) string {
	claims := &Claims{
		Role: role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(time.Now().Add(-1 * time.Hour)),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, _ := token.SignedString([]byte(secret))
	return tokenString
}

// genJWTSecret generates a random non-empty JWT secret.
func genJWTSecret() *rapid.Generator[string] {
	return rapid.Custom(func(t *rapid.T) string {
		length := rapid.IntRange(8, 64).Draw(t, "secretLength")
		bytes := make([]byte, length)
		for i := range bytes {
			bytes[i] = byte(rapid.IntRange(33, 126).Draw(t, "secretByte"))
		}
		return string(bytes)
	})
}

// genAdminPath generates a random admin endpoint path.
func genAdminPath() *rapid.Generator[string] {
	return rapid.SampledFrom([]string{
		"/admin/test",
		"/admin/projects",
		"/admin/projects/some-id",
	})
}

// genHTTPMethod generates a random HTTP method appropriate for admin endpoints.
func genHTTPMethod(path string) string {
	switch {
	case path == "/admin/projects" && true:
		return "POST"
	case len(path) > len("/admin/projects/") && path[:len("/admin/projects/")] == "/admin/projects/":
		methods := []string{"PUT", "DELETE"}
		return methods[time.Now().UnixNano()%2]
	default:
		return "GET"
	}
}

// genInvalidToken generates a random string that is not a valid JWT.
func genInvalidToken() *rapid.Generator[string] {
	return rapid.Custom(func(t *rapid.T) string {
		length := rapid.IntRange(1, 200).Draw(t, "tokenLength")
		bytes := make([]byte, length)
		for i := range bytes {
			bytes[i] = byte(rapid.IntRange(33, 126).Draw(t, "tokenByte"))
		}
		return string(bytes)
	})
}

// genNonAdminRole generates a random role string that is not "admin".
func genNonAdminRole() *rapid.Generator[string] {
	return rapid.Custom(func(t *rapid.T) string {
		roles := []string{"user", "viewer", "editor", "moderator", "guest", "member", "operator"}
		idx := rapid.IntRange(0, len(roles)-1).Draw(t, "roleIdx")
		return roles[idx]
	})
}

func TestPropertyAuthMiddlewareMissingToken(t *testing.T) {
	// Property: For any request to an /admin/* endpoint without a token, response SHALL be 401.
	rapid.Check(t, func(t *rapid.T) {
		secret := genJWTSecret().Draw(t, "secret")
		router := createTestRouter(secret)

		req := httptest.NewRequest("GET", "/admin/test", nil)
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		if w.Code != http.StatusUnauthorized {
			t.Fatalf("expected 401 for missing token, got %d", w.Code)
		}
	})
}

func TestPropertyAuthMiddlewareInvalidToken(t *testing.T) {
	// Property: For any request with an invalid token (random string), response SHALL be 401.
	rapid.Check(t, func(t *rapid.T) {
		secret := genJWTSecret().Draw(t, "secret")
		invalidToken := genInvalidToken().Draw(t, "invalidToken")
		router := createTestRouter(secret)

		req := httptest.NewRequest("GET", "/admin/test", nil)
		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", invalidToken))
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		if w.Code != http.StatusUnauthorized {
			t.Fatalf("expected 401 for invalid token %q, got %d", invalidToken, w.Code)
		}
	})
}

func TestPropertyAuthMiddlewareExpiredToken(t *testing.T) {
	// Property: For any request with an expired valid token, response SHALL be 401.
	rapid.Check(t, func(t *rapid.T) {
		secret := genJWTSecret().Draw(t, "secret")
		router := createTestRouter(secret)

		// Generate a token that expired in the past
		hoursAgo := rapid.IntRange(1, 720).Draw(t, "hoursAgo")
		expiredAt := time.Now().Add(-time.Duration(hoursAgo) * time.Hour)
		token := generateValidToken(secret, "admin", expiredAt)

		req := httptest.NewRequest("GET", "/admin/test", nil)
		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		if w.Code != http.StatusUnauthorized {
			t.Fatalf("expected 401 for expired token (expired %d hours ago), got %d", hoursAgo, w.Code)
		}
	})
}

func TestPropertyAuthMiddlewareNonAdminRole(t *testing.T) {
	// Property: For any request with a valid token but non-admin role, response SHALL be 401.
	rapid.Check(t, func(t *rapid.T) {
		secret := genJWTSecret().Draw(t, "secret")
		role := genNonAdminRole().Draw(t, "role")
		router := createTestRouter(secret)

		// Valid token with non-admin role
		expiresAt := time.Now().Add(1 * time.Hour)
		token := generateValidToken(secret, role, expiresAt)

		req := httptest.NewRequest("GET", "/admin/test", nil)
		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		if w.Code != http.StatusUnauthorized {
			t.Fatalf("expected 401 for non-admin role %q, got %d", role, w.Code)
		}
	})
}

func TestPropertyAuthMiddlewareValidAdminToken(t *testing.T) {
	// Property: For any request with a valid admin token, the request SHALL proceed to the handler (200).
	rapid.Check(t, func(t *rapid.T) {
		secret := genJWTSecret().Draw(t, "secret")
		router := createTestRouter(secret)

		// Valid admin token
		hoursUntilExpiry := rapid.IntRange(1, 24).Draw(t, "hoursUntilExpiry")
		expiresAt := time.Now().Add(time.Duration(hoursUntilExpiry) * time.Hour)
		token := generateValidToken(secret, "admin", expiresAt)

		req := httptest.NewRequest("GET", "/admin/test", nil)
		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		if w.Code != http.StatusOK {
			t.Fatalf("expected 200 for valid admin token (expires in %d hours), got %d", hoursUntilExpiry, w.Code)
		}
	})
}

func TestPropertyAuthMiddlewareEnforcementOnAllAdminPaths(t *testing.T) {
	// Property: For any /admin/* path, missing token always results in 401.
	rapid.Check(t, func(t *rapid.T) {
		secret := genJWTSecret().Draw(t, "secret")
		path := genAdminPath().Draw(t, "path")
		router := createTestRouter(secret)

		method := "GET"
		if path == "/admin/projects" {
			method = "POST"
		} else if len(path) > 16 && path[:16] == "/admin/projects/" {
			method = rapid.SampledFrom([]string{"PUT", "DELETE"}).Draw(t, "method")
		}

		req := httptest.NewRequest(method, path, nil)
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		if w.Code != http.StatusUnauthorized {
			t.Fatalf("expected 401 for %s %s without token, got %d", method, path, w.Code)
		}
	})
}
