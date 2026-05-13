package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// AuthConfig holds configuration for the auth middleware.
type AuthConfig struct {
	JWTSecret string
}

// Claims represents the JWT claims structure used for admin authentication.
type Claims struct {
	Role string `json:"role"`
	jwt.RegisteredClaims
}

// Auth returns a middleware that validates JWT tokens and enforces admin role.
// It expects an Authorization header with format: Bearer {token}.
func Auth(cfg AuthConfig) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			abortUnauthorized(c, "Authorization header is required")
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			abortUnauthorized(c, "Invalid authorization header format")
			return
		}

		tokenString := parts[1]
		if tokenString == "" {
			abortUnauthorized(c, "Token is required")
			return
		}

		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return []byte(cfg.JWTSecret), nil
		})

		if err != nil || !token.Valid {
			abortUnauthorized(c, "Invalid or expired token")
			return
		}

		if claims.Role != "admin" {
			abortUnauthorized(c, "Insufficient permissions")
			return
		}

		// Set claims in context for downstream handlers
		c.Set("claims", claims)
		c.Set("role", claims.Role)

		c.Next()
	}
}

func abortUnauthorized(c *gin.Context, message string) {
	c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
		"success": false,
		"data":    nil,
		"error": gin.H{
			"code":    "UNAUTHORIZED",
			"message": message,
		},
	})
}
