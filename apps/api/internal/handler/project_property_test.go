package handler

import (
	"bytes"
	"encoding/json"
	"fmt"
	"math"
	"net/http"
	"net/http/httptest"
	"sort"
	"sync"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"pgregory.net/rapid"

	"portfolio-platform/apps/api/internal/model"
	"portfolio-platform/apps/api/internal/service"
)

// =============================================================================
// In-memory ProjectService implementation for property-based testing
// =============================================================================

// inMemoryProjectService stores projects in memory and implements the full
// ProjectService interface with real CRUD logic.
type inMemoryProjectService struct {
	mu       sync.RWMutex
	projects map[string]*model.Project // keyed by ID
	nextID   int
}

func newInMemoryProjectService() *inMemoryProjectService {
	return &inMemoryProjectService{
		projects: make(map[string]*model.Project),
		nextID:   1,
	}
}

func (s *inMemoryProjectService) ListProjects(page, limit int) ([]model.Project, *model.PaginationMeta, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}

	// Collect all projects sorted by createdAt descending
	all := make([]model.Project, 0, len(s.projects))
	for _, p := range s.projects {
		all = append(all, *p)
	}
	sort.Slice(all, func(i, j int) bool {
		return all[i].CreatedAt.After(all[j].CreatedAt)
	})

	total := len(all)
	totalPages := int(math.Ceil(float64(total) / float64(limit)))

	offset := (page - 1) * limit
	end := offset + limit
	if offset > total {
		offset = total
	}
	if end > total {
		end = total
	}

	result := all[offset:end]

	meta := &model.PaginationMeta{
		Page:       page,
		Limit:      limit,
		Total:      total,
		TotalPages: totalPages,
	}

	return result, meta, nil
}

func (s *inMemoryProjectService) GetProject(slug string) (*model.Project, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	for _, p := range s.projects {
		if p.Slug == slug {
			return p, nil
		}
	}
	return nil, &service.ErrNotFound{Message: fmt.Sprintf("project with slug %q not found", slug)}
}

func (s *inMemoryProjectService) GetProjectByID(id string) (*model.Project, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	if p, ok := s.projects[id]; ok {
		return p, nil
	}
	return nil, &service.ErrNotFound{Message: fmt.Sprintf("project with id %q not found", id)}
}

func (s *inMemoryProjectService) GetFeaturedProjects() ([]model.Project, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var featured []model.Project
	for _, p := range s.projects {
		if p.Featured {
			featured = append(featured, *p)
		}
	}
	// Order by createdAt descending
	sort.Slice(featured, func(i, j int) bool {
		return featured[i].CreatedAt.After(featured[j].CreatedAt)
	})
	return featured, nil
}

func (s *inMemoryProjectService) CreateProject(input *service.ProjectCreateInput) (*model.Project, error) {
	// Validate required fields
	fields := make(map[string]string)
	if input.Title == "" {
		fields["title"] = "title is required"
	}
	if input.Slug == "" {
		fields["slug"] = "slug is required"
	}
	if input.Description == "" {
		fields["description"] = "description is required"
	}
	if input.Type == "" {
		fields["type"] = "type is required"
	} else if input.Type != "mobile" && input.Type != "web" && input.Type != "backend" {
		fields["type"] = "type must be one of: mobile, web, backend"
	}
	if len(fields) > 0 {
		return nil, &service.ErrValidation{Message: "validation failed", Fields: fields}
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	// Check slug uniqueness
	for _, p := range s.projects {
		if p.Slug == input.Slug {
			return nil, &service.ErrConflict{Message: fmt.Sprintf("project with slug %q already exists", input.Slug)}
		}
	}

	id := fmt.Sprintf("proj-%d", s.nextID)
	s.nextID++

	now := time.Now()
	project := &model.Project{
		ID:             id,
		Title:          input.Title,
		Slug:           input.Slug,
		Description:    input.Description,
		Thumbnail:      input.Thumbnail,
		Gallery:        input.Gallery,
		Technologies:   input.Technologies,
		Type:           input.Type,
		GithubURL:      input.GithubURL,
		LiveURL:        input.LiveURL,
		PlayStoreURL:   input.PlayStoreURL,
		AppStoreURL:    input.AppStoreURL,
		DemoMode:       input.DemoMode,
		EmulatorConfig: input.EmulatorConfig,
		Featured:       input.Featured,
		CreatedAt:      now,
		UpdatedAt:      now,
	}

	if project.Gallery == nil {
		project.Gallery = []string{}
	}
	if project.Technologies == nil {
		project.Technologies = []string{}
	}

	s.projects[id] = project
	return project, nil
}

func (s *inMemoryProjectService) UpdateProject(id string, input *service.ProjectUpdateInput) (*model.Project, error) {
	// Validate update input
	fields := make(map[string]string)
	if input.Title != nil && *input.Title == "" {
		fields["title"] = "title cannot be empty"
	}
	if input.Slug != nil && *input.Slug == "" {
		fields["slug"] = "slug cannot be empty"
	}
	if input.Description != nil && *input.Description == "" {
		fields["description"] = "description cannot be empty"
	}
	if input.Type != nil {
		t := *input.Type
		if t == "" {
			fields["type"] = "type cannot be empty"
		} else if t != "mobile" && t != "web" && t != "backend" {
			fields["type"] = "type must be one of: mobile, web, backend"
		}
	}
	if len(fields) > 0 {
		return nil, &service.ErrValidation{Message: "validation failed", Fields: fields}
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	project, exists := s.projects[id]
	if !exists {
		return nil, &service.ErrNotFound{Message: fmt.Sprintf("project with id %q not found", id)}
	}

	// Check slug uniqueness if slug is being changed
	if input.Slug != nil && *input.Slug != project.Slug {
		for _, p := range s.projects {
			if p.Slug == *input.Slug {
				return nil, &service.ErrConflict{Message: fmt.Sprintf("project with slug %q already exists", *input.Slug)}
			}
		}
	}

	if input.Title != nil {
		project.Title = *input.Title
	}
	if input.Slug != nil {
		project.Slug = *input.Slug
	}
	if input.Description != nil {
		project.Description = *input.Description
	}
	if input.Type != nil {
		project.Type = *input.Type
	}
	if input.Thumbnail != nil {
		project.Thumbnail = *input.Thumbnail
	}
	if input.Gallery != nil {
		project.Gallery = input.Gallery
	}
	if input.Technologies != nil {
		project.Technologies = input.Technologies
	}
	project.GithubURL = input.GithubURL
	project.LiveURL = input.LiveURL
	project.PlayStoreURL = input.PlayStoreURL
	project.AppStoreURL = input.AppStoreURL
	if input.DemoMode != nil {
		project.DemoMode = *input.DemoMode
	}
	project.EmulatorConfig = input.EmulatorConfig
	if input.Featured != nil {
		project.Featured = *input.Featured
	}
	project.UpdatedAt = time.Now()

	return project, nil
}

func (s *inMemoryProjectService) DeleteProject(id string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if _, exists := s.projects[id]; !exists {
		return &service.ErrNotFound{Message: fmt.Sprintf("project with id %q not found", id)}
	}
	delete(s.projects, id)
	return nil
}

// =============================================================================
// Test helpers
// =============================================================================

func setupPropertyRouter(svc service.ProjectService) *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	ph := NewProjectHandler(svc)
	ah := NewAdminProjectHandler(svc)
	r.GET("/projects", ph.ListProjects)
	r.GET("/projects/:slug", ph.GetProject)
	r.GET("/featured-projects", ph.GetFeaturedProjects)
	r.POST("/admin/projects", ah.CreateProject)
	r.PUT("/admin/projects/:id", ah.UpdateProject)
	r.DELETE("/admin/projects/:id", ah.DeleteProject)
	return r
}

// projectResponseData is used to unmarshal the data field from API responses.
type projectResponseData struct {
	ID             string               `json:"id"`
	Title          string               `json:"title"`
	Slug           string               `json:"slug"`
	Description    string               `json:"description"`
	Thumbnail      string               `json:"thumbnail"`
	Gallery        []string             `json:"gallery"`
	Technologies   []string             `json:"technologies"`
	Type           string               `json:"type"`
	GithubURL      *string              `json:"githubUrl"`
	LiveURL        *string              `json:"liveUrl"`
	PlayStoreURL   *string              `json:"playStoreUrl"`
	AppStoreURL    *string              `json:"appStoreUrl"`
	DemoMode       bool                 `json:"demoMode"`
	EmulatorConfig *model.EmulatorConfig `json:"emulatorConfig"`
	Featured       bool                 `json:"featured"`
	CreatedAt      string               `json:"createdAt"`
}

// listResponse is used to unmarshal the full list response.
type listResponse struct {
	Success bool                  `json:"success"`
	Data    []projectResponseData `json:"data"`
	Meta    *model.PaginationMeta `json:"meta,omitempty"`
	Error   *model.ApiError       `json:"error,omitempty"`
}

// singleResponse is used to unmarshal a single project response.
type singleResponse struct {
	Success bool                 `json:"success"`
	Data    *projectResponseData `json:"data"`
	Meta    *model.PaginationMeta `json:"meta,omitempty"`
	Error   *model.ApiError      `json:"error,omitempty"`
}

// errorResponse is used to unmarshal error responses.
type errorResponse struct {
	Success bool            `json:"success"`
	Data    interface{}     `json:"data"`
	Error   *model.ApiError `json:"error,omitempty"`
}

// =============================================================================
// Generators
// =============================================================================

var validProjectTypes = []string{"mobile", "web", "backend"}

func genSlug() *rapid.Generator[string] {
	return rapid.Custom(func(t *rapid.T) string {
		// Generate a slug-like string: lowercase letters and hyphens
		parts := rapid.SliceOfN(rapid.StringMatching(`[a-z]{2,8}`), 1, 3).Draw(t, "slugParts")
		slug := ""
		for i, p := range parts {
			if i > 0 {
				slug += "-"
			}
			slug += p
		}
		return slug
	})
}

func genProjectType() *rapid.Generator[string] {
	return rapid.Custom(func(t *rapid.T) string {
		idx := rapid.IntRange(0, len(validProjectTypes)-1).Draw(t, "typeIdx")
		return validProjectTypes[idx]
	})
}

func genCreateInput() *rapid.Generator[createProjectRequest] {
	return rapid.Custom(func(t *rapid.T) createProjectRequest {
		return createProjectRequest{
			Title:        rapid.StringMatching(`[A-Za-z ]{3,30}`).Draw(t, "title"),
			Slug:         genSlug().Draw(t, "slug"),
			Description:  rapid.StringMatching(`[A-Za-z0-9 .,]{10,100}`).Draw(t, "description"),
			Type:         genProjectType().Draw(t, "type"),
			Thumbnail:    "https://example.com/thumb.png",
			Gallery:      []string{"https://example.com/img1.png"},
			Technologies: []string{"Go", "React"},
			Featured:     rapid.Bool().Draw(t, "featured"),
			DemoMode:     rapid.Bool().Draw(t, "demoMode"),
		}
	})
}

// =============================================================================
// Property 1: Project API response shape completeness
// Feature: portfolio-platform, Property 1: Project API response shape completeness
// Validates: Requirements 2.2
// =============================================================================

func TestPropertyResponseShapeCompleteness(t *testing.T) {
	rapid.Check(t, func(t *rapid.T) {
		svc := newInMemoryProjectService()
		router := setupPropertyRouter(svc)

		// Generate and create a project
		input := genCreateInput().Draw(t, "input")
		body, _ := json.Marshal(input)

		w := httptest.NewRecorder()
		req, _ := http.NewRequest("POST", "/admin/projects", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)
		require.Equal(t, http.StatusCreated, w.Code)

		// Fetch via GET /projects (list)
		w = httptest.NewRecorder()
		req, _ = http.NewRequest("GET", "/projects", nil)
		router.ServeHTTP(w, req)
		require.Equal(t, http.StatusOK, w.Code)

		var listResp listResponse
		err := json.Unmarshal(w.Body.Bytes(), &listResp)
		require.NoError(t, err)
		require.True(t, listResp.Success)
		require.NotEmpty(t, listResp.Data)

		proj := listResp.Data[0]
		assertResponseShapeComplete(t, proj)

		// Fetch via GET /projects/:slug
		w = httptest.NewRecorder()
		req, _ = http.NewRequest("GET", "/projects/"+input.Slug, nil)
		router.ServeHTTP(w, req)
		require.Equal(t, http.StatusOK, w.Code)

		var singleResp singleResponse
		err = json.Unmarshal(w.Body.Bytes(), &singleResp)
		require.NoError(t, err)
		require.True(t, singleResp.Success)
		require.NotNil(t, singleResp.Data)

		assertResponseShapeComplete(t, *singleResp.Data)
	})
}

func assertResponseShapeComplete(t *rapid.T, proj projectResponseData) {
	// All required fields must be present (non-zero for strings, non-nil for pointers is not required
	// but the JSON keys must exist - we verify the struct fields are populated correctly)
	assert.NotEmpty(t, proj.ID, "id must be present")
	assert.NotEmpty(t, proj.Title, "title must be present")
	assert.NotEmpty(t, proj.Slug, "slug must be present")
	assert.NotEmpty(t, proj.Description, "description must be present")
	// thumbnail can be empty string but field must exist (it's in the struct)
	assert.NotNil(t, proj.Gallery, "gallery must be present")
	assert.NotNil(t, proj.Technologies, "technologies must be present")
	assert.NotEmpty(t, proj.Type, "type must be present")
	// githubUrl, liveUrl, playStoreUrl, appStoreUrl can be nil (optional)
	// demoMode is a bool (always present in JSON)
	// emulatorConfig can be nil (optional)
	// featured is a bool (always present in JSON)
	assert.NotEmpty(t, proj.CreatedAt, "createdAt must be present")
}

// =============================================================================
// Property 2: Pagination bounds
// Feature: portfolio-platform, Property 2: Pagination bounds
// Validates: Requirements 2.4, 11.4
// =============================================================================

func TestPropertyPaginationBounds(t *testing.T) {
	rapid.Check(t, func(t *rapid.T) {
		svc := newInMemoryProjectService()
		router := setupPropertyRouter(svc)

		// Create a random number of projects (1 to 25)
		numProjects := rapid.IntRange(1, 25).Draw(t, "numProjects")
		for i := 0; i < numProjects; i++ {
			input := createProjectRequest{
				Title:        fmt.Sprintf("Project %d", i),
				Slug:         fmt.Sprintf("project-%d-%d", i, rapid.IntRange(1000, 9999).Draw(t, "rand")),
				Description:  "A test project description",
				Type:         "web",
				Gallery:      []string{},
				Technologies: []string{},
			}
			body, _ := json.Marshal(input)
			w := httptest.NewRecorder()
			req, _ := http.NewRequest("POST", "/admin/projects", bytes.NewBuffer(body))
			req.Header.Set("Content-Type", "application/json")
			router.ServeHTTP(w, req)
			require.Equal(t, http.StatusCreated, w.Code)
			// Small delay to ensure distinct createdAt
			time.Sleep(time.Millisecond)
		}

		// Test with explicit limit
		limit := rapid.IntRange(1, 15).Draw(t, "limit")
		page := rapid.IntRange(1, 5).Draw(t, "page")

		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", fmt.Sprintf("/projects?page=%d&limit=%d", page, limit), nil)
		router.ServeHTTP(w, req)
		require.Equal(t, http.StatusOK, w.Code)

		var resp listResponse
		err := json.Unmarshal(w.Body.Bytes(), &resp)
		require.NoError(t, err)
		require.True(t, resp.Success)
		require.NotNil(t, resp.Meta)

		// Response SHALL contain at most `limit` items
		assert.LessOrEqual(t, len(resp.Data), limit)

		// meta.totalPages SHALL equal ceil(meta.total / limit)
		expectedTotalPages := int(math.Ceil(float64(resp.Meta.Total) / float64(limit)))
		assert.Equal(t, expectedTotalPages, resp.Meta.TotalPages)

		// meta.total should equal the number of projects we created
		assert.Equal(t, numProjects, resp.Meta.Total)

		// Test default limit (no limit specified)
		w = httptest.NewRecorder()
		req, _ = http.NewRequest("GET", "/projects", nil)
		router.ServeHTTP(w, req)
		require.Equal(t, http.StatusOK, w.Code)

		var defaultResp listResponse
		err = json.Unmarshal(w.Body.Bytes(), &defaultResp)
		require.NoError(t, err)

		// Default limit is 10
		assert.LessOrEqual(t, len(defaultResp.Data), 10)
		assert.Equal(t, 10, defaultResp.Meta.Limit)
	})
}

// =============================================================================
// Property 10: Project CRUD round-trip
// Feature: portfolio-platform, Property 10: Project CRUD round-trip
// Validates: Requirements 6.1, 6.2, 6.3
// =============================================================================

func TestPropertyCRUDRoundTrip(t *testing.T) {
	rapid.Check(t, func(t *rapid.T) {
		svc := newInMemoryProjectService()
		router := setupPropertyRouter(svc)

		// Generate a valid project input
		input := genCreateInput().Draw(t, "input")

		// CREATE: POST /admin/projects
		body, _ := json.Marshal(input)
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("POST", "/admin/projects", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)
		require.Equal(t, http.StatusCreated, w.Code)

		var createResp singleResponse
		err := json.Unmarshal(w.Body.Bytes(), &createResp)
		require.NoError(t, err)
		require.True(t, createResp.Success)
		require.NotNil(t, createResp.Data)
		createdID := createResp.Data.ID

		// READ: GET /projects/:slug - verify fields match
		w = httptest.NewRecorder()
		req, _ = http.NewRequest("GET", "/projects/"+input.Slug, nil)
		router.ServeHTTP(w, req)
		require.Equal(t, http.StatusOK, w.Code)

		var getResp singleResponse
		err = json.Unmarshal(w.Body.Bytes(), &getResp)
		require.NoError(t, err)
		require.True(t, getResp.Success)
		require.NotNil(t, getResp.Data)

		assert.Equal(t, input.Title, getResp.Data.Title)
		assert.Equal(t, input.Slug, getResp.Data.Slug)
		assert.Equal(t, input.Description, getResp.Data.Description)
		assert.Equal(t, input.Type, getResp.Data.Type)

		// UPDATE: PUT /admin/projects/:id
		newTitle := "Updated " + input.Title
		newDesc := "Updated " + input.Description
		updateBody := updateProjectRequest{
			Title:       &newTitle,
			Description: &newDesc,
		}
		body, _ = json.Marshal(updateBody)
		w = httptest.NewRecorder()
		req, _ = http.NewRequest("PUT", "/admin/projects/"+createdID, bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)
		require.Equal(t, http.StatusOK, w.Code)

		// READ after UPDATE: verify updates reflected
		w = httptest.NewRecorder()
		req, _ = http.NewRequest("GET", "/projects/"+input.Slug, nil)
		router.ServeHTTP(w, req)
		require.Equal(t, http.StatusOK, w.Code)

		var updatedResp singleResponse
		err = json.Unmarshal(w.Body.Bytes(), &updatedResp)
		require.NoError(t, err)
		require.True(t, updatedResp.Success)
		require.NotNil(t, updatedResp.Data)

		assert.Equal(t, newTitle, updatedResp.Data.Title)
		assert.Equal(t, newDesc, updatedResp.Data.Description)
		// Slug and type should remain unchanged
		assert.Equal(t, input.Slug, updatedResp.Data.Slug)
		assert.Equal(t, input.Type, updatedResp.Data.Type)

		// DELETE: DELETE /admin/projects/:id
		w = httptest.NewRecorder()
		req, _ = http.NewRequest("DELETE", "/admin/projects/"+createdID, nil)
		router.ServeHTTP(w, req)
		require.Equal(t, http.StatusOK, w.Code)

		// READ after DELETE: should return 404
		w = httptest.NewRecorder()
		req, _ = http.NewRequest("GET", "/projects/"+input.Slug, nil)
		router.ServeHTTP(w, req)
		assert.Equal(t, http.StatusNotFound, w.Code)
	})
}

// =============================================================================
// Property 11: Project validation rejects missing required fields
// Feature: portfolio-platform, Property 11: Project validation rejects missing required fields
// Validates: Requirements 6.5, 9.2, 9.3
// =============================================================================

func TestPropertyValidationRejectsMissingFields(t *testing.T) {
	rapid.Check(t, func(t *rapid.T) {
		svc := newInMemoryProjectService()
		router := setupPropertyRouter(svc)

		// Generate a bitmask for which required fields to omit (at least one must be missing)
		// Fields: title(1), slug(2), description(4), type(8)
		omitMask := rapid.IntRange(1, 15).Draw(t, "omitMask")

		input := createProjectRequest{
			Gallery:      []string{},
			Technologies: []string{},
		}

		// Only set fields that are NOT omitted
		if omitMask&1 == 0 {
			input.Title = "Valid Title"
		}
		if omitMask&2 == 0 {
			input.Slug = genSlug().Draw(t, "slug")
		}
		if omitMask&4 == 0 {
			input.Description = "Valid description text"
		}
		if omitMask&8 == 0 {
			input.Type = genProjectType().Draw(t, "type")
		}

		body, _ := json.Marshal(input)
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("POST", "/admin/projects", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)

		// SHALL return 400
		assert.Equal(t, http.StatusBadRequest, w.Code)

		var resp errorResponse
		err := json.Unmarshal(w.Body.Bytes(), &resp)
		require.NoError(t, err)
		assert.False(t, resp.Success)
		require.NotNil(t, resp.Error)
		assert.Equal(t, "VALIDATION_ERROR", resp.Error.Code)

		// SHALL have field-level error details for each missing field
		if omitMask&1 != 0 {
			assert.Contains(t, resp.Error.Fields, "title")
		}
		if omitMask&2 != 0 {
			assert.Contains(t, resp.Error.Fields, "slug")
		}
		if omitMask&4 != 0 {
			assert.Contains(t, resp.Error.Fields, "description")
		}
		if omitMask&8 != 0 {
			assert.Contains(t, resp.Error.Fields, "type")
		}
	})
}

// =============================================================================
// Property 12: Slug uniqueness enforcement
// Feature: portfolio-platform, Property 12: Slug uniqueness enforcement
// Validates: Requirements 6.6
// =============================================================================

func TestPropertySlugUniquenessEnforcement(t *testing.T) {
	rapid.Check(t, func(t *rapid.T) {
		svc := newInMemoryProjectService()
		router := setupPropertyRouter(svc)

		// Generate a slug that will be used by both requests
		slug := genSlug().Draw(t, "slug")

		// First creation should succeed
		input1 := createProjectRequest{
			Title:        "First Project",
			Slug:         slug,
			Description:  "First project description",
			Type:         "web",
			Gallery:      []string{},
			Technologies: []string{},
		}
		body, _ := json.Marshal(input1)
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("POST", "/admin/projects", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)
		require.Equal(t, http.StatusCreated, w.Code)

		// Second creation with same slug SHALL return 409 Conflict
		input2 := createProjectRequest{
			Title:        "Second Project",
			Slug:         slug,
			Description:  "Second project description",
			Type:         "mobile",
			Gallery:      []string{},
			Technologies: []string{},
		}
		body, _ = json.Marshal(input2)
		w = httptest.NewRecorder()
		req, _ = http.NewRequest("POST", "/admin/projects", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusConflict, w.Code)

		var resp errorResponse
		err := json.Unmarshal(w.Body.Bytes(), &resp)
		require.NoError(t, err)
		assert.False(t, resp.Success)
		require.NotNil(t, resp.Error)
		assert.Equal(t, "CONFLICT", resp.Error.Code)
	})
}

// =============================================================================
// Property 15: Featured projects filter and ordering
// Feature: portfolio-platform, Property 15: Featured projects filter and ordering
// Validates: Requirements 8.2
// =============================================================================

func TestPropertyFeaturedProjectsFilterAndOrdering(t *testing.T) {
	rapid.Check(t, func(t *rapid.T) {
		svc := newInMemoryProjectService()
		router := setupPropertyRouter(svc)

		// Create a mix of featured and non-featured projects
		numProjects := rapid.IntRange(3, 15).Draw(t, "numProjects")
		expectedFeaturedCount := 0

		for i := 0; i < numProjects; i++ {
			featured := rapid.Bool().Draw(t, fmt.Sprintf("featured_%d", i))
			if featured {
				expectedFeaturedCount++
			}
			input := createProjectRequest{
				Title:        fmt.Sprintf("Project %d", i),
				Slug:         fmt.Sprintf("proj-%d-%d", i, rapid.IntRange(1000, 9999).Draw(t, fmt.Sprintf("rand_%d", i))),
				Description:  "A test project description",
				Type:         "web",
				Gallery:      []string{},
				Technologies: []string{},
				Featured:     featured,
			}
			body, _ := json.Marshal(input)
			w := httptest.NewRecorder()
			req, _ := http.NewRequest("POST", "/admin/projects", bytes.NewBuffer(body))
			req.Header.Set("Content-Type", "application/json")
			router.ServeHTTP(w, req)
			require.Equal(t, http.StatusCreated, w.Code)
			// Small delay to ensure distinct createdAt ordering
			time.Sleep(time.Millisecond)
		}

		// GET /featured-projects
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/featured-projects", nil)
		router.ServeHTTP(w, req)
		require.Equal(t, http.StatusOK, w.Code)

		var resp listResponse
		err := json.Unmarshal(w.Body.Bytes(), &resp)
		require.NoError(t, err)
		require.True(t, resp.Success)

		// SHALL return only projects where featured=true
		assert.Equal(t, expectedFeaturedCount, len(resp.Data))
		for _, p := range resp.Data {
			assert.True(t, p.Featured, "all returned projects must be featured")
		}

		// SHALL be ordered by createdAt descending
		if len(resp.Data) > 1 {
			for i := 0; i < len(resp.Data)-1; i++ {
				t1, err1 := time.Parse(time.RFC3339Nano, resp.Data[i].CreatedAt)
				t2, err2 := time.Parse(time.RFC3339Nano, resp.Data[i+1].CreatedAt)
				require.NoError(t, err1)
				require.NoError(t, err2)
				assert.True(t, !t1.Before(t2),
					"featured projects must be ordered by createdAt descending: %s should be >= %s",
					resp.Data[i].CreatedAt, resp.Data[i+1].CreatedAt)
			}
		}
	})
}
