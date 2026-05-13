package handler

import (
	"fmt"
	"io"
	"net/http"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"

	"portfolio-platform/apps/api/internal/model"
	"portfolio-platform/apps/api/pkg/supabase"
)

const (
	maxImageSize = 5 * 1024 * 1024  // 5MB
	maxPDFSize   = 10 * 1024 * 1024 // 10MB
)

// allowedFileTypes maps MIME types to their allowed status.
var allowedFileTypes = map[string]bool{
	"image/jpeg":      true,
	"image/png":       true,
	"image/webp":      true,
	"application/pdf": true,
}

// isImageType returns true if the content type is an image type.
func isImageType(contentType string) bool {
	return contentType == "image/jpeg" || contentType == "image/png" || contentType == "image/webp"
}

// UploadHandler handles file upload endpoints.
type UploadHandler struct {
	storage *supabase.Client
	bucket  string
}

// NewUploadHandler creates a new UploadHandler.
func NewUploadHandler(storage *supabase.Client, bucket string) *UploadHandler {
	return &UploadHandler{storage: storage, bucket: bucket}
}

// Upload handles POST /admin/upload.
func (h *UploadHandler) Upload(c *gin.Context) {
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, model.ApiResponse{
			Success: false,
			Data:    nil,
			Error: &model.ApiError{
				Code:    "INVALID_FILE",
				Message: "no file provided",
			},
		})
		return
	}
	defer file.Close()

	// Validate file type
	contentType := header.Header.Get("Content-Type")
	if !allowedFileTypes[contentType] {
		c.JSON(http.StatusBadRequest, model.ApiResponse{
			Success: false,
			Data:    nil,
			Error: &model.ApiError{
				Code:    "INVALID_FILE",
				Message: fmt.Sprintf("file type %q is not allowed; allowed types: PDF, JPG, PNG, WEBP", contentType),
			},
		})
		return
	}

	// Validate file size
	size := header.Size
	if isImageType(contentType) && size > maxImageSize {
		c.JSON(http.StatusBadRequest, model.ApiResponse{
			Success: false,
			Data:    nil,
			Error: &model.ApiError{
				Code:    "INVALID_FILE",
				Message: "image file exceeds maximum size of 5MB",
			},
		})
		return
	}
	if contentType == "application/pdf" && size > maxPDFSize {
		c.JSON(http.StatusBadRequest, model.ApiResponse{
			Success: false,
			Data:    nil,
			Error: &model.ApiError{
				Code:    "INVALID_FILE",
				Message: "PDF file exceeds maximum size of 10MB",
			},
		})
		return
	}

	// Read file data
	data, err := io.ReadAll(file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, model.ApiResponse{
			Success: false,
			Data:    nil,
			Error: &model.ApiError{
				Code:    "INTERNAL_ERROR",
				Message: "failed to read file",
			},
		})
		return
	}

	// Generate unique file path
	ext := filepath.Ext(header.Filename)
	storagePath := fmt.Sprintf("uploads/%d%s", time.Now().UnixNano(), ext)

	// Upload to Supabase Storage
	publicURL, err := h.storage.UploadFile(h.bucket, storagePath, data, contentType)
	if err != nil {
		c.JSON(http.StatusInternalServerError, model.ApiResponse{
			Success: false,
			Data:    nil,
			Error: &model.ApiError{
				Code:    "INTERNAL_ERROR",
				Message: "failed to upload file to storage",
			},
		})
		return
	}

	c.JSON(http.StatusOK, model.ApiResponse{
		Success: true,
		Data:    map[string]string{"url": publicURL},
	})
}
