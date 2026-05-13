package handler

import (
	"io"
	"net/http"

	"github.com/gin-gonic/gin"

	"portfolio-platform/apps/api/internal/model"
	"portfolio-platform/apps/api/internal/service"
)

// ResumeHandler handles resume endpoints.
type ResumeHandler struct {
	svc service.ResumeService
}

// NewResumeHandler creates a new ResumeHandler.
func NewResumeHandler(svc service.ResumeService) *ResumeHandler {
	return &ResumeHandler{svc: svc}
}

// GetResume handles GET /resume.
func (h *ResumeHandler) GetResume(c *gin.Context) {
	resume, err := h.svc.GetResume()
	if err != nil {
		writeServiceError(c, err)
		return
	}

	c.JSON(http.StatusOK, model.ApiResponse{
		Success: true,
		Data:    resume.ToResponse(),
	})
}

// UploadResume handles POST /admin/resume.
func (h *ResumeHandler) UploadResume(c *gin.Context) {
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, model.ApiResponse{
			Success: false,
			Data:    nil,
			Error: &model.ApiError{
				Code:    "INVALID_FILE",
				Message: "no file provided — send a multipart/form-data request with field name 'file'",
			},
		})
		return
	}
	defer file.Close()

	// Read file data first so we can detect MIME type from bytes
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

	// Detect content type from file bytes (more reliable than header)
	contentType := http.DetectContentType(data)

	// Also accept if the filename ends in .pdf or header says pdf
	headerContentType := header.Header.Get("Content-Type")
	filename := header.Filename
	isPDF := contentType == "application/pdf" ||
		headerContentType == "application/pdf" ||
		(len(filename) > 4 && filename[len(filename)-4:] == ".pdf")

	// PDF magic bytes: %PDF
	if len(data) >= 4 && string(data[:4]) == "%PDF" {
		isPDF = true
	}

	if !isPDF {
		c.JSON(http.StatusBadRequest, model.ApiResponse{
			Success: false,
			Data:    nil,
			Error: &model.ApiError{
				Code:    "INVALID_FILE",
				Message: "file must be in PDF format",
			},
		})
		return
	}

	// Validate file size - max 10MB
	if header.Size > maxPDFSize {
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

	resume, err := h.svc.UploadResume(data, "application/pdf", header.Size)
	if err != nil {
		writeServiceError(c, err)
		return
	}

	c.JSON(http.StatusOK, model.ApiResponse{
		Success: true,
		Data:    resume.ToResponse(),
	})
}
