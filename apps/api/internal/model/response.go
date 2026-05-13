package model

// ApiResponse is the standard response envelope for all API endpoints.
type ApiResponse struct {
	Success bool            `json:"success"`
	Data    interface{}     `json:"data"`
	Meta    *PaginationMeta `json:"meta,omitempty"`
	Error   *ApiError       `json:"error,omitempty"`
}

// PaginationMeta holds pagination information for list endpoints.
type PaginationMeta struct {
	Page       int `json:"page"`
	Limit      int `json:"limit"`
	Total      int `json:"total"`
	TotalPages int `json:"totalPages"`
}

// ApiError represents a structured error in the response envelope.
type ApiError struct {
	Code    string            `json:"code"`
	Message string            `json:"message"`
	Fields  map[string]string `json:"fields,omitempty"`
}
