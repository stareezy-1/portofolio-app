package handler

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"portfolio-platform/apps/api/pkg/supabase"
)

func setupAuthTestRouter(supabaseURL, jwtSecret string) *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	client := supabase.NewClient(supabaseURL, "test-api-key")
	authHandler := NewAuthHandler(jwtSecret, client)
	r.POST("/admin/login", authHandler.Login)

	return r
}

func TestLogin_InvalidBody(t *testing.T) {
	r := setupAuthTestRouter("http://localhost:9999", "test-secret")

	// Missing email and password
	body := bytes.NewBufferString(`{}`)
	req := httptest.NewRequest(http.MethodPost, "/admin/login", body)
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)

	var resp map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	require.NoError(t, err)
	assert.Equal(t, false, resp["success"])
}

func TestLogin_InvalidCredentials(t *testing.T) {
	// Start a fake Supabase auth server that returns 400
	fakeServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"error":"invalid_grant","error_description":"Invalid login credentials"}`))
	}))
	defer fakeServer.Close()

	r := setupAuthTestRouter(fakeServer.URL, "test-secret")

	body := bytes.NewBufferString(`{"email":"bad@example.com","password":"wrong"}`)
	req := httptest.NewRequest(http.MethodPost, "/admin/login", body)
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)

	var resp map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	require.NoError(t, err)
	assert.Equal(t, false, resp["success"])

	errObj := resp["error"].(map[string]interface{})
	assert.Equal(t, "UNAUTHORIZED", errObj["code"])
}

func TestLogin_Success(t *testing.T) {
	// Start a fake Supabase auth server that returns a valid token
	fakeServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"access_token":"supabase-token-123","token_type":"bearer","expires_in":3600}`))
	}))
	defer fakeServer.Close()

	jwtSecret := "my-test-secret"
	r := setupAuthTestRouter(fakeServer.URL, jwtSecret)

	body := bytes.NewBufferString(`{"email":"admin@example.com","password":"correct-password"}`)
	req := httptest.NewRequest(http.MethodPost, "/admin/login", body)
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var resp map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	require.NoError(t, err)
	assert.Equal(t, true, resp["success"])

	data := resp["data"].(map[string]interface{})
	tokenString, ok := data["token"].(string)
	require.True(t, ok)
	require.NotEmpty(t, tokenString)

	// Verify the JWT token is valid and has admin role
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(jwtSecret), nil
	})
	require.NoError(t, err)
	require.True(t, token.Valid)

	claims, ok := token.Claims.(jwt.MapClaims)
	require.True(t, ok)
	assert.Equal(t, "admin", claims["role"])
	assert.Equal(t, "admin@example.com", claims["sub"])
}

func TestLogin_MissingEmail(t *testing.T) {
	r := setupAuthTestRouter("http://localhost:9999", "test-secret")

	body := bytes.NewBufferString(`{"password":"somepass"}`)
	req := httptest.NewRequest(http.MethodPost, "/admin/login", body)
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestLogin_MissingPassword(t *testing.T) {
	r := setupAuthTestRouter("http://localhost:9999", "test-secret")

	body := bytes.NewBufferString(`{"email":"admin@example.com"}`)
	req := httptest.NewRequest(http.MethodPost, "/admin/login", body)
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestLogin_InvalidEmailFormat(t *testing.T) {
	r := setupAuthTestRouter("http://localhost:9999", "test-secret")

	body := bytes.NewBufferString(`{"email":"not-an-email","password":"somepass"}`)
	req := httptest.NewRequest(http.MethodPost, "/admin/login", body)
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}
