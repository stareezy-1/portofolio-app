package handler

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"portfolio-platform/apps/api/internal/model"
	"portfolio-platform/apps/api/internal/service"
)

func setupAdminRouter(svc service.ProjectService) *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	h := NewAdminProjectHandler(svc)
	r.POST("/admin/projects", h.CreateProject)
	r.PUT("/admin/projects/:id", h.UpdateProject)
	r.DELETE("/admin/projects/:id", h.DeleteProject)
	return r
}

func TestCreateProject_Success(t *testing.T) {
	svc := &mockProjectService{
		createFn: func(input *service.ProjectCreateInput) (*model.Project, error) {
			assert.Equal(t, "New Project", input.Title)
			assert.Equal(t, "new-project", input.Slug)
			return &model.Project{ID: "123", Title: "New Project", Slug: "new-project"}, nil
		},
	}
	r := setupAdminRouter(svc)

	body := createProjectRequest{
		Title:       "New Project",
		Slug:        "new-project",
		Description: "A new project",
		Type:        "web",
	}
	jsonBody, _ := json.Marshal(body)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/admin/projects", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)

	var resp model.ApiResponse
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	require.NoError(t, err)
	assert.True(t, resp.Success)
}

func TestCreateProject_ValidationError(t *testing.T) {
	svc := &mockProjectService{
		createFn: func(input *service.ProjectCreateInput) (*model.Project, error) {
			return nil, &service.ErrValidation{
				Message: "validation failed",
				Fields:  map[string]string{"title": "title is required"},
			}
		},
	}
	r := setupAdminRouter(svc)

	body := createProjectRequest{}
	jsonBody, _ := json.Marshal(body)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/admin/projects", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)

	var resp model.ApiResponse
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	require.NoError(t, err)
	assert.False(t, resp.Success)
	assert.Equal(t, "VALIDATION_ERROR", resp.Error.Code)
	assert.Contains(t, resp.Error.Fields, "title")
}

func TestCreateProject_ConflictError(t *testing.T) {
	svc := &mockProjectService{
		createFn: func(input *service.ProjectCreateInput) (*model.Project, error) {
			return nil, &service.ErrConflict{Message: "slug already exists"}
		},
	}
	r := setupAdminRouter(svc)

	body := createProjectRequest{
		Title:       "Duplicate",
		Slug:        "existing-slug",
		Description: "Duplicate project",
		Type:        "web",
	}
	jsonBody, _ := json.Marshal(body)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/admin/projects", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusConflict, w.Code)

	var resp model.ApiResponse
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	require.NoError(t, err)
	assert.False(t, resp.Success)
	assert.Equal(t, "CONFLICT", resp.Error.Code)
}

func TestCreateProject_InvalidJSON(t *testing.T) {
	svc := &mockProjectService{}
	r := setupAdminRouter(svc)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/admin/projects", bytes.NewBufferString("not json"))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)

	var resp model.ApiResponse
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	require.NoError(t, err)
	assert.False(t, resp.Success)
	assert.Equal(t, "VALIDATION_ERROR", resp.Error.Code)
	assert.Equal(t, "invalid request body", resp.Error.Message)
}

func TestUpdateProject_Success(t *testing.T) {
	title := "Updated Title"
	svc := &mockProjectService{
		updateFn: func(id string, input *service.ProjectUpdateInput) (*model.Project, error) {
			assert.Equal(t, "abc-123", id)
			assert.Equal(t, &title, input.Title)
			return &model.Project{ID: "abc-123", Title: "Updated Title"}, nil
		},
	}
	r := setupAdminRouter(svc)

	body := updateProjectRequest{Title: &title}
	jsonBody, _ := json.Marshal(body)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/admin/projects/abc-123", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var resp model.ApiResponse
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	require.NoError(t, err)
	assert.True(t, resp.Success)
}

func TestUpdateProject_NotFound(t *testing.T) {
	title := "Updated"
	svc := &mockProjectService{
		updateFn: func(id string, input *service.ProjectUpdateInput) (*model.Project, error) {
			return nil, &service.ErrNotFound{Message: "project not found"}
		},
	}
	r := setupAdminRouter(svc)

	body := updateProjectRequest{Title: &title}
	jsonBody, _ := json.Marshal(body)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/admin/projects/nonexistent", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func TestDeleteProject_Success(t *testing.T) {
	svc := &mockProjectService{
		deleteFn: func(id string) error {
			assert.Equal(t, "abc-123", id)
			return nil
		},
	}
	r := setupAdminRouter(svc)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("DELETE", "/admin/projects/abc-123", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var resp model.ApiResponse
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	require.NoError(t, err)
	assert.True(t, resp.Success)
}

func TestDeleteProject_InternalError(t *testing.T) {
	svc := &mockProjectService{
		deleteFn: func(id string) error {
			return assert.AnError
		},
	}
	r := setupAdminRouter(svc)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("DELETE", "/admin/projects/abc-123", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code)

	var resp model.ApiResponse
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	require.NoError(t, err)
	assert.False(t, resp.Success)
	assert.Equal(t, "INTERNAL_ERROR", resp.Error.Code)
}
