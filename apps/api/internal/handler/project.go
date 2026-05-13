package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"portfolio-platform/apps/api/internal/model"
	"portfolio-platform/apps/api/internal/service"
)

// ProjectHandler handles public project endpoints.
type ProjectHandler struct {
	svc service.ProjectService
}

// NewProjectHandler creates a new ProjectHandler.
func NewProjectHandler(svc service.ProjectService) *ProjectHandler {
	return &ProjectHandler{svc: svc}
}

// ListProjects handles GET /projects with pagination query params.
func (h *ProjectHandler) ListProjects(c *gin.Context) {
	page := parseIntParam(c.Query("page"), 1)
	limit := parseIntParam(c.Query("limit"), 10)

	projects, meta, err := h.svc.ListProjects(page, limit)
	if err != nil {
		writeServiceError(c, err)
		return
	}

	c.JSON(http.StatusOK, model.ApiResponse{
		Success: true,
		Data:    projects,
		Meta:    meta,
	})
}

// GetProject handles GET /projects/:slug.
func (h *ProjectHandler) GetProject(c *gin.Context) {
	slug := c.Param("slug")

	project, err := h.svc.GetProject(slug)
	if err != nil {
		writeServiceError(c, err)
		return
	}

	c.JSON(http.StatusOK, model.ApiResponse{
		Success: true,
		Data:    project,
	})
}

// GetFeaturedProjects handles GET /featured-projects.
func (h *ProjectHandler) GetFeaturedProjects(c *gin.Context) {
	projects, err := h.svc.GetFeaturedProjects()
	if err != nil {
		writeServiceError(c, err)
		return
	}

	c.JSON(http.StatusOK, model.ApiResponse{
		Success: true,
		Data:    projects,
	})
}

// parseIntParam parses a string to int, returning defaultVal on failure.
func parseIntParam(s string, defaultVal int) int {
	if s == "" {
		return defaultVal
	}
	val, err := strconv.Atoi(s)
	if err != nil || val < 1 {
		return defaultVal
	}
	return val
}

// writeServiceError maps service-layer errors to HTTP responses.
// writeServiceError maps service-layer errors to HTTP responses.
// It includes the actual error detail to help with debugging.
func writeServiceError(c *gin.Context, err error) {
	switch e := err.(type) {
	case *service.ErrValidation:
		c.JSON(http.StatusBadRequest, model.ApiResponse{
			Success: false,
			Data:    nil,
			Error: &model.ApiError{
				Code:    "VALIDATION_ERROR",
				Message: e.Message,
				Fields:  e.Fields,
			},
		})
	case *service.ErrNotFound:
		c.JSON(http.StatusNotFound, model.ApiResponse{
			Success: false,
			Data:    nil,
			Error: &model.ApiError{
				Code:    "NOT_FOUND",
				Message: e.Message,
			},
		})
	case *service.ErrConflict:
		c.JSON(http.StatusConflict, model.ApiResponse{
			Success: false,
			Data:    nil,
			Error: &model.ApiError{
				Code:    "CONFLICT",
				Message: e.Message,
			},
		})
	case *service.ErrInvalidFile:
		c.JSON(http.StatusBadRequest, model.ApiResponse{
			Success: false,
			Data:    nil,
			Error: &model.ApiError{
				Code:    "INVALID_FILE",
				Message: e.Message,
			},
		})
	default:
		// Include the actual error message for easier debugging
		c.JSON(http.StatusInternalServerError, model.ApiResponse{
			Success: false,
			Data:    nil,
			Error: &model.ApiError{
				Code:    "INTERNAL_ERROR",
				Message: err.Error(),
			},
		})
	}
}
