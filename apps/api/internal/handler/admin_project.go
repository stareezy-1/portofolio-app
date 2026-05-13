package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"portfolio-platform/apps/api/internal/model"
	"portfolio-platform/apps/api/internal/service"
)

// createProjectRequest is the JSON body for POST /admin/projects.
type createProjectRequest struct {
	Title          string               `json:"title"`
	Slug           string               `json:"slug"`
	Description    string               `json:"description"`
	Type           string               `json:"type"`
	Thumbnail      string               `json:"thumbnail"`
	Gallery        []string             `json:"gallery"`
	Technologies   []string             `json:"technologies"`
	GithubURL      *string              `json:"githubUrl"`
	LiveURL        *string              `json:"liveUrl"`
	PlayStoreURL   *string              `json:"playStoreUrl"`
	AppStoreURL    *string              `json:"appStoreUrl"`
	DemoMode       bool                 `json:"demoMode"`
	EmulatorConfig *model.EmulatorConfig `json:"emulatorConfig"`
	Featured       bool                 `json:"featured"`
}

// updateProjectRequest is the JSON body for PUT /admin/projects/:id.
type updateProjectRequest struct {
	Title          *string              `json:"title"`
	Slug           *string              `json:"slug"`
	Description    *string              `json:"description"`
	Type           *string              `json:"type"`
	Thumbnail      *string              `json:"thumbnail"`
	Gallery        []string             `json:"gallery"`
	Technologies   []string             `json:"technologies"`
	GithubURL      *string              `json:"githubUrl"`
	LiveURL        *string              `json:"liveUrl"`
	PlayStoreURL   *string              `json:"playStoreUrl"`
	AppStoreURL    *string              `json:"appStoreUrl"`
	DemoMode       *bool                `json:"demoMode"`
	EmulatorConfig *model.EmulatorConfig `json:"emulatorConfig"`
	Featured       *bool                `json:"featured"`
}

// AdminProjectHandler handles admin project endpoints.
type AdminProjectHandler struct {
	svc service.ProjectService
}

// NewAdminProjectHandler creates a new AdminProjectHandler.
func NewAdminProjectHandler(svc service.ProjectService) *AdminProjectHandler {
	return &AdminProjectHandler{svc: svc}
}

// GetProject handles GET /admin/projects/:id — fetches a single project by ID for editing.
func (h *AdminProjectHandler) GetProject(c *gin.Context) {
	id := c.Param("id")

	project, err := h.svc.GetProjectByID(id)
	if err != nil {
		writeServiceError(c, err)
		return
	}

	c.JSON(http.StatusOK, model.ApiResponse{
		Success: true,
		Data:    project,
	})
}

// CreateProject handles POST /admin/projects.
func (h *AdminProjectHandler) CreateProject(c *gin.Context) {
	var req createProjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, model.ApiResponse{
			Success: false,
			Data:    nil,
			Error: &model.ApiError{
				Code:    "VALIDATION_ERROR",
				Message: "invalid request body",
			},
		})
		return
	}

	input := &service.ProjectCreateInput{
		Title:          req.Title,
		Slug:           req.Slug,
		Description:    req.Description,
		Type:           req.Type,
		Thumbnail:      req.Thumbnail,
		Gallery:        req.Gallery,
		Technologies:   req.Technologies,
		GithubURL:      req.GithubURL,
		LiveURL:        req.LiveURL,
		PlayStoreURL:   req.PlayStoreURL,
		AppStoreURL:    req.AppStoreURL,
		DemoMode:       req.DemoMode,
		EmulatorConfig: req.EmulatorConfig,
		Featured:       req.Featured,
	}

	project, err := h.svc.CreateProject(input)
	if err != nil {
		writeServiceError(c, err)
		return
	}

	c.JSON(http.StatusCreated, model.ApiResponse{
		Success: true,
		Data:    project,
	})
}

// UpdateProject handles PUT /admin/projects/:id.
func (h *AdminProjectHandler) UpdateProject(c *gin.Context) {
	id := c.Param("id")

	var req updateProjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, model.ApiResponse{
			Success: false,
			Data:    nil,
			Error: &model.ApiError{
				Code:    "VALIDATION_ERROR",
				Message: "invalid request body",
			},
		})
		return
	}

	input := &service.ProjectUpdateInput{
		Title:          req.Title,
		Slug:           req.Slug,
		Description:    req.Description,
		Type:           req.Type,
		Thumbnail:      req.Thumbnail,
		Gallery:        req.Gallery,
		Technologies:   req.Technologies,
		GithubURL:      req.GithubURL,
		LiveURL:        req.LiveURL,
		PlayStoreURL:   req.PlayStoreURL,
		AppStoreURL:    req.AppStoreURL,
		DemoMode:       req.DemoMode,
		EmulatorConfig: req.EmulatorConfig,
		Featured:       req.Featured,
	}

	project, err := h.svc.UpdateProject(id, input)
	if err != nil {
		writeServiceError(c, err)
		return
	}

	c.JSON(http.StatusOK, model.ApiResponse{
		Success: true,
		Data:    project,
	})
}

// DeleteProject handles DELETE /admin/projects/:id.
func (h *AdminProjectHandler) DeleteProject(c *gin.Context) {
	id := c.Param("id")

	if err := h.svc.DeleteProject(id); err != nil {
		writeServiceError(c, err)
		return
	}

	c.JSON(http.StatusOK, model.ApiResponse{
		Success: true,
		Data:    map[string]string{"message": "project deleted successfully"},
	})
}
