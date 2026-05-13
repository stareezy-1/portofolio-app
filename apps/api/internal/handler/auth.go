package handler

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"

	"portfolio-platform/apps/api/pkg/supabase"
)

// AuthHandler handles admin authentication endpoints.
type AuthHandler struct {
	jwtSecret      string
	supabaseClient *supabase.Client
}

// NewAuthHandler creates a new AuthHandler with the given JWT secret and Supabase client.
func NewAuthHandler(jwtSecret string, supabaseClient *supabase.Client) *AuthHandler {
	return &AuthHandler{
		jwtSecret:      jwtSecret,
		supabaseClient: supabaseClient,
	}
}

// loginRequest represents the expected JSON body for the login endpoint.
type loginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// Login handles POST /admin/login.
// It authenticates credentials via Supabase Auth and returns a JWT access token with admin role.
func (h *AuthHandler) Login(c *gin.Context) {
	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"data":    nil,
			"error": gin.H{
				"code":    "VALIDATION_ERROR",
				"message": "Invalid request body: email and password are required",
			},
		})
		return
	}

	// Authenticate via Supabase Auth
	_, err := h.supabaseClient.AuthLogin(req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"data":    nil,
			"error": gin.H{
				"code":    "UNAUTHORIZED",
				"message": "Invalid email or password",
			},
		})
		return
	}

	// Generate a JWT with admin role using the configured JWT secret
	claims := jwt.MapClaims{
		"role": "admin",
		"sub":  req.Email,
		"iat":  time.Now().Unix(),
		"exp":  time.Now().Add(24 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(h.jwtSecret))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"data":    nil,
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "Failed to generate token",
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"token": tokenString,
		},
		"error": nil,
	})
}
