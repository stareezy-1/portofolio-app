package handler

import (
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

// mockProjectService is a test double for service.ProjectService.
type mockProjectService struct {
	listFn       func(page, limit int) ([]model.Project, *model.PaginationMeta, error)
	getFn        func(slug string) (*model.Project, error)
	getByIDFn    func(id string) (*model.Project, error)
	featuredFn   func() ([]model.Project, error)
	createFn     func(input *service.ProjectCreateInput) (*model.Project, error)
	updateFn     func(id string, input *service.ProjectUpdateInput) (*model.Project, error)
	deleteFn     func(id string) error
}

func (m *mockProjectService) ListProjects(page, limit int) ([]model.Project, *model.PaginationMeta, error) {
	return m.listFn(page, limit)
}
func (m *mockProjectService) GetProject(slug string) (*model.Project, error) {
	return m.getFn(slug)
}
func (m *mockProjectService) GetProjectByID(id string) (*model.Project, error) {
	if m.getByIDFn != nil {
		return m.getByIDFn(id)
	}
	return nil, &service.ErrNotFound{Message: "not found"}
}
func (m *mockProjectService) GetFeaturedProjects() ([]model.Project, error) {
	return m.featuredFn()
}
func (m *mockProjectService) CreateProject(input *service.ProjectCreateInput) (*model.Project, error) {
	return m.createFn(input)
}
func (m *mockProjectService) UpdateProject(id string, input *service.ProjectUpdateInput) (*model.Project, error) {
	return m.updateFn(id, input)
}
func (m *mockProjectService) DeleteProject(id string) error {
	return m.deleteFn(id)
}

func setupRouter(svc service.ProjectService) *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	h := NewProjectHandler(svc)
	r.GET("/projects", h.ListProjects)
	r.GET("/projects/:slug", h.GetProject)
	r.GET("/featured-projects", h.GetFeaturedProjects)
	return r
}

func TestListProjects_Success(t *testing.T) {
	svc := &mockProjectService{
		listFn: func(page, limit int) ([]model.Project, *model.PaginationMeta, error) {
			assert.Equal(t, 1, page)
			assert.Equal(t, 10, limit)
			return []model.Project{{Title: "Test"}}, &model.PaginationMeta{Page: 1, Limit: 10, Total: 1, TotalPages: 1}, nil
		},
	}
	r := setupRouter(svc)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/projects", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var resp model.ApiResponse
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	require.NoError(t, err)
	assert.True(t, resp.Success)
	assert.NotNil(t, resp.Meta)
	assert.Equal(t, 1, resp.Meta.Page)
}

func TestListProjects_CustomPagination(t *testing.T) {
	svc := &mockProjectService{
		listFn: func(page, limit int) ([]model.Project, *model.PaginationMeta, error) {
			assert.Equal(t, 2, page)
			assert.Equal(t, 5, limit)
			return []model.Project{}, &model.PaginationMeta{Page: 2, Limit: 5, Total: 0, TotalPages: 0}, nil
		},
	}
	r := setupRouter(svc)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/projects?page=2&limit=5", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestListProjects_InvalidPageDefaultsTo1(t *testing.T) {
	svc := &mockProjectService{
		listFn: func(page, limit int) ([]model.Project, *model.PaginationMeta, error) {
			assert.Equal(t, 1, page)
			assert.Equal(t, 10, limit)
			return []model.Project{}, &model.PaginationMeta{Page: 1, Limit: 10, Total: 0, TotalPages: 0}, nil
		},
	}
	r := setupRouter(svc)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/projects?page=abc&limit=-1", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestGetProject_Success(t *testing.T) {
	svc := &mockProjectService{
		getFn: func(slug string) (*model.Project, error) {
			assert.Equal(t, "my-project", slug)
			return &model.Project{Title: "My Project", Slug: "my-project"}, nil
		},
	}
	r := setupRouter(svc)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/projects/my-project", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var resp model.ApiResponse
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	require.NoError(t, err)
	assert.True(t, resp.Success)
}

func TestGetProject_NotFound(t *testing.T) {
	svc := &mockProjectService{
		getFn: func(slug string) (*model.Project, error) {
			return nil, &service.ErrNotFound{Message: "project not found"}
		},
	}
	r := setupRouter(svc)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/projects/nonexistent", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code)

	var resp model.ApiResponse
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	require.NoError(t, err)
	assert.False(t, resp.Success)
	assert.Equal(t, "NOT_FOUND", resp.Error.Code)
}

func TestGetFeaturedProjects_Success(t *testing.T) {
	svc := &mockProjectService{
		featuredFn: func() ([]model.Project, error) {
			return []model.Project{{Title: "Featured", Featured: true}}, nil
		},
	}
	r := setupRouter(svc)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/featured-projects", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var resp model.ApiResponse
	err := json.Unmarshal(w.Body.Bytes(), &resp)
	require.NoError(t, err)
	assert.True(t, resp.Success)
	assert.Nil(t, resp.Meta)
}
