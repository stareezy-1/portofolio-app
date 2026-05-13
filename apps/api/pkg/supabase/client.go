package supabase

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"
)

// Client wraps HTTP calls to the Supabase REST API.
type Client struct {
	baseURL    string
	apiKey     string
	httpClient *http.Client
}

// NewClient creates a new Supabase client with the given base URL and API key.
func NewClient(baseURL, apiKey string) *Client {
	return &Client{
		baseURL: baseURL,
		apiKey:  apiKey,
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

// Get performs a GET request to the Supabase REST API at the given path.
func (c *Client) Get(path string) ([]byte, error) {
	req, err := http.NewRequest(http.MethodGet, c.url(path), nil)
	if err != nil {
		return nil, fmt.Errorf("supabase: failed to create request: %w", err)
	}
	c.setHeaders(req)

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("supabase: request failed: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("supabase: failed to read response: %w", err)
	}

	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("supabase: request returned status %d: %s", resp.StatusCode, string(body))
	}

	return body, nil
}
// GetCount performs a HEAD-like GET request with Prefer: count=exact to retrieve the total row count.
// It uses the Content-Range header from the response to extract the total.
func (c *Client) GetCount(path string) (int, error) {
	req, err := http.NewRequest(http.MethodGet, c.url(path), nil)
	if err != nil {
		return 0, fmt.Errorf("supabase: failed to create request: %w", err)
	}
	c.setHeaders(req)
	req.Header.Set("Prefer", "count=exact")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return 0, fmt.Errorf("supabase: request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		body, _ := io.ReadAll(resp.Body)
		return 0, fmt.Errorf("supabase: request returned status %d: %s", resp.StatusCode, string(body))
	}

	// Parse Content-Range header: "*/total" or "0-N/total"
	contentRange := resp.Header.Get("Content-Range")
	if contentRange == "" {
		return 0, fmt.Errorf("supabase: no Content-Range header in response")
	}

	parts := strings.Split(contentRange, "/")
	if len(parts) != 2 {
		return 0, fmt.Errorf("supabase: invalid Content-Range format: %s", contentRange)
	}

	total, err := strconv.Atoi(parts[1])
	if err != nil {
		return 0, fmt.Errorf("supabase: invalid total in Content-Range: %s", parts[1])
	}

	return total, nil
}

// Post performs a POST request to the Supabase REST API at the given path with the provided body.
func (c *Client) Post(path string, body []byte) ([]byte, error) {
	req, err := http.NewRequest(http.MethodPost, c.url(path), bytes.NewReader(body))
	if err != nil {
		return nil, fmt.Errorf("supabase: failed to create request: %w", err)
	}
	c.setHeaders(req)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Prefer", "return=representation")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("supabase: request failed: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("supabase: failed to read response: %w", err)
	}

	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("supabase: request returned status %d: %s", resp.StatusCode, string(respBody))
	}

	return respBody, nil
}

// Patch performs a PATCH request to the Supabase REST API at the given path with the provided body.
func (c *Client) Patch(path string, body []byte) ([]byte, error) {
	req, err := http.NewRequest(http.MethodPatch, c.url(path), bytes.NewReader(body))
	if err != nil {
		return nil, fmt.Errorf("supabase: failed to create request: %w", err)
	}
	c.setHeaders(req)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Prefer", "return=representation")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("supabase: request failed: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("supabase: failed to read response: %w", err)
	}

	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("supabase: request returned status %d: %s", resp.StatusCode, string(respBody))
	}

	return respBody, nil
}

// Delete performs a DELETE request to the Supabase REST API at the given path.
func (c *Client) Delete(path string) error {
	req, err := http.NewRequest(http.MethodDelete, c.url(path), nil)
	if err != nil {
		return fmt.Errorf("supabase: failed to create request: %w", err)
	}
	c.setHeaders(req)

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("supabase: request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("supabase: request returned status %d: %s", resp.StatusCode, string(body))
	}

	return nil
}
// UploadFile uploads a file to Supabase Storage and returns the public URL.
// Uses PUT (upsert) so re-uploading the same path overwrites the existing file.
func (c *Client) UploadFile(bucket, path string, data []byte, contentType string) (string, error) {
	uploadURL := fmt.Sprintf("%s/storage/v1/object/%s/%s", c.baseURL, bucket, path)

	// Try PUT first (upsert — works for both new and existing files)
	req, err := http.NewRequest(http.MethodPut, uploadURL, bytes.NewReader(data))
	if err != nil {
		return "", fmt.Errorf("supabase: failed to create upload request: %w", err)
	}
	req.Header.Set("apikey", c.apiKey)
	req.Header.Set("Authorization", "Bearer "+c.apiKey)
	req.Header.Set("Content-Type", contentType)
	req.Header.Set("x-upsert", "true")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("supabase: upload request failed: %w", err)
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)

	if resp.StatusCode >= 400 {
		return "", fmt.Errorf("supabase: upload returned status %d: %s", resp.StatusCode, string(respBody))
	}

	// Return the public URL for the uploaded file
	publicURL := fmt.Sprintf("%s/storage/v1/object/public/%s/%s", c.baseURL, bucket, path)
	return publicURL, nil
}
// AuthLogin authenticates a user via Supabase Auth and returns the access token.
// It calls POST {baseURL}/auth/v1/token?grant_type=password with email and password.
func (c *Client) AuthLogin(email, password string) (string, error) {
	authURL := fmt.Sprintf("%s/auth/v1/token?grant_type=password", c.baseURL)

	payload := fmt.Sprintf(`{"email":%q,"password":%q}`, email, password)

	req, err := http.NewRequest(http.MethodPost, authURL, bytes.NewReader([]byte(payload)))
	if err != nil {
		return "", fmt.Errorf("supabase: failed to create auth request: %w", err)
	}
	req.Header.Set("apikey", c.apiKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("supabase: auth request failed: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("supabase: failed to read auth response: %w", err)
	}

	if resp.StatusCode >= 400 {
		return "", fmt.Errorf("supabase: auth failed with status %d: %s", resp.StatusCode, string(body))
	}

	// Parse access_token from response JSON
	type authResponse struct {
		AccessToken string `json:"access_token"`
	}
	var authResp authResponse
	if err := json.Unmarshal(body, &authResp); err != nil {
		return "", fmt.Errorf("supabase: failed to parse auth response: %w", err)
	}

	if authResp.AccessToken == "" {
		return "", fmt.Errorf("supabase: no access token in response")
	}

	return authResp.AccessToken, nil
}



func (c *Client) url(path string) string {
	return fmt.Sprintf("%s/rest/v1/%s", c.baseURL, path)
}

func (c *Client) setHeaders(req *http.Request) {
	req.Header.Set("apikey", c.apiKey)
	req.Header.Set("Authorization", "Bearer "+c.apiKey)
}
