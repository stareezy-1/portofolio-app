package repository

import (
	"encoding/json"
	"fmt"
	"math"
	"strconv"
	"strings"

	"portfolio-platform/apps/api/internal/model"
	"portfolio-platform/apps/api/pkg/supabase"
)

// ProjectRepository defines the interface for project data access.
type ProjectRepository interface {
	List(page, limit int) ([]model.Project, *model.PaginationMeta, error)
	GetBySlug(slug string) (*model.Project, error)
	GetByID(id string) (*model.Project, error)
	GetFeatured() ([]model.Project, error)
	Create(project *model.Project) (*model.Project, error)
	Update(id string, project *model.Project) (*model.Project, error)
	Delete(id string) error
	SlugExists(slug string) (bool, error)
}

// projectRepository implements ProjectRepository using the Supabase client.
type projectRepository struct {
	client *supabase.Client
}

// NewProjectRepository creates a new ProjectRepository backed by Supabase.
func NewProjectRepository(client *supabase.Client) ProjectRepository {
	return &projectRepository{client: client}
}

// List retrieves a paginated list of projects ordered by created_at descending.
func (r *projectRepository) List(page, limit int) ([]model.Project, *model.PaginationMeta, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}

	offset := (page - 1) * limit

	// Get total count using Supabase head request with count=exact
	countPath := "projects?select=id&limit=0"
	total, err := r.client.GetCount(countPath)
	if err != nil {
		return nil, nil, fmt.Errorf("repository: failed to get project count: %w", err)
	}

	// Fetch paginated results
	path := fmt.Sprintf("projects?select=*&order=created_at.desc&offset=%d&limit=%d", offset, limit)
	data, err := r.client.Get(path)
	if err != nil {
		return nil, nil, fmt.Errorf("repository: failed to list projects: %w", err)
	}

	var projects []model.Project
	if err := json.Unmarshal(data, &projects); err != nil {
		return nil, nil, fmt.Errorf("repository: failed to parse projects: %w", err)
	}

	totalPages := int(math.Ceil(float64(total) / float64(limit)))

	meta := &model.PaginationMeta{
		Page:       page,
		Limit:      limit,
		Total:      total,
		TotalPages: totalPages,
	}

	return projects, meta, nil
}

// GetBySlug retrieves a single project by its unique slug.
func (r *projectRepository) GetBySlug(slug string) (*model.Project, error) {
	path := fmt.Sprintf("projects?slug=eq.%s&select=*&limit=1", slug)
	data, err := r.client.Get(path)
	if err != nil {
		return nil, fmt.Errorf("repository: failed to get project by slug: %w", err)
	}

	var projects []model.Project
	if err := json.Unmarshal(data, &projects); err != nil {
		return nil, fmt.Errorf("repository: failed to parse project: %w", err)
	}

	if len(projects) == 0 {
		return nil, nil
	}

	return &projects[0], nil
}

// GetByID retrieves a single project by its UUID.
func (r *projectRepository) GetByID(id string) (*model.Project, error) {
	path := fmt.Sprintf("projects?id=eq.%s&select=*&limit=1", id)
	data, err := r.client.Get(path)
	if err != nil {
		return nil, fmt.Errorf("repository: failed to get project by id: %w", err)
	}

	var projects []model.Project
	if err := json.Unmarshal(data, &projects); err != nil {
		return nil, fmt.Errorf("repository: failed to parse project: %w", err)
	}

	if len(projects) == 0 {
		return nil, nil
	}

	return &projects[0], nil
}

// GetFeatured retrieves all featured projects ordered by created_at descending.
func (r *projectRepository) GetFeatured() ([]model.Project, error) {
	path := "projects?featured=eq.true&select=*&order=created_at.desc"
	data, err := r.client.Get(path)
	if err != nil {
		return nil, fmt.Errorf("repository: failed to get featured projects: %w", err)
	}

	var projects []model.Project
	if err := json.Unmarshal(data, &projects); err != nil {
		return nil, fmt.Errorf("repository: failed to parse featured projects: %w", err)
	}

	return projects, nil
}

// Create inserts a new project and returns the created record.
func (r *projectRepository) Create(project *model.Project) (*model.Project, error) {
	// Use a separate insert struct to avoid sending zero-value id/timestamps to Supabase
	insert := struct {
		Title          string               `json:"title"`
		Slug           string               `json:"slug"`
		Description    string               `json:"description"`
		Thumbnail      string               `json:"thumbnail"`
		Gallery        []string             `json:"gallery"`
		Technologies   []string             `json:"technologies"`
		Type           string               `json:"type"`
		GithubURL      *string              `json:"github_url,omitempty"`
		LiveURL        *string              `json:"live_url,omitempty"`
		PlayStoreURL   *string              `json:"play_store_url,omitempty"`
		AppStoreURL    *string              `json:"app_store_url,omitempty"`
		DemoMode       bool                 `json:"demo_mode"`
		EmulatorConfig *model.EmulatorConfig `json:"emulator_config,omitempty"`
		Featured       bool                 `json:"featured"`
	}{
		Title:          project.Title,
		Slug:           project.Slug,
		Description:    project.Description,
		Thumbnail:      project.Thumbnail,
		Gallery:        project.Gallery,
		Technologies:   project.Technologies,
		Type:           project.Type,
		GithubURL:      project.GithubURL,
		LiveURL:        project.LiveURL,
		PlayStoreURL:   project.PlayStoreURL,
		AppStoreURL:    project.AppStoreURL,
		DemoMode:       project.DemoMode,
		EmulatorConfig: project.EmulatorConfig,
		Featured:       project.Featured,
	}

	body, err := json.Marshal(insert)
	if err != nil {
		return nil, fmt.Errorf("repository: failed to marshal project: %w", err)
	}

	data, err := r.client.Post("projects", body)
	if err != nil {
		if isConflictError(err) {
			return nil, ErrSlugConflict
		}
		return nil, fmt.Errorf("repository: failed to create project: %w", err)
	}

	var created []model.Project
	if err := json.Unmarshal(data, &created); err != nil {
		return nil, fmt.Errorf("repository: failed to parse created project: %w", err)
	}

	if len(created) == 0 {
		return nil, fmt.Errorf("repository: no project returned after creation")
	}

	return &created[0], nil
}

// Update modifies an existing project by ID and returns the updated record.
func (r *projectRepository) Update(id string, project *model.Project) (*model.Project, error) {
	// Use a map so nullable pointer fields send explicit null (not omitted).
	// omitempty on *string would skip nil fields, leaving old values intact.
	patch := map[string]interface{}{
		"title":           project.Title,
		"slug":            project.Slug,
		"description":     project.Description,
		"thumbnail":       project.Thumbnail,
		"gallery":         project.Gallery,
		"technologies":    project.Technologies,
		"type":            project.Type,
		"github_url":      project.GithubURL,
		"live_url":        project.LiveURL,
		"play_store_url":  project.PlayStoreURL,
		"app_store_url":   project.AppStoreURL,
		"demo_mode":       project.DemoMode,
		"emulator_config": project.EmulatorConfig,
		"featured":        project.Featured,
	}

	body, err := json.Marshal(patch)
	if err != nil {
		return nil, fmt.Errorf("repository: failed to marshal project: %w", err)
	}

	path := fmt.Sprintf("projects?id=eq.%s", id)
	data, err := r.client.Patch(path, body)
	if err != nil {
		if isConflictError(err) {
			return nil, ErrSlugConflict
		}
		return nil, fmt.Errorf("repository: failed to update project: %w", err)
	}

	var updated []model.Project
	if len(data) > 2 {
		if err := json.Unmarshal(data, &updated); err != nil {
			return nil, fmt.Errorf("repository: failed to parse updated project: %w", err)
		}
	}

	if len(updated) == 0 {
		// Re-fetch to confirm update was applied
		return r.GetByID(id)
	}

	return &updated[0], nil
}

// Delete removes a project by ID.
func (r *projectRepository) Delete(id string) error {
	path := fmt.Sprintf("projects?id=eq.%s", id)
	if err := r.client.Delete(path); err != nil {
		return fmt.Errorf("repository: failed to delete project: %w", err)
	}
	return nil
}

// SlugExists checks whether a project with the given slug already exists.
func (r *projectRepository) SlugExists(slug string) (bool, error) {
	path := fmt.Sprintf("projects?slug=eq.%s&select=id&limit=1", slug)
	data, err := r.client.Get(path)
	if err != nil {
		return false, fmt.Errorf("repository: failed to check slug existence: %w", err)
	}

	// Parse response to check if any records were returned
	var results []struct {
		ID string `json:"id"`
	}
	if err := json.Unmarshal(data, &results); err != nil {
		return false, fmt.Errorf("repository: failed to parse slug check response: %w", err)
	}

	return len(results) > 0, nil
}

// ErrSlugConflict is returned when a project slug already exists.
var ErrSlugConflict = fmt.Errorf("repository: slug already exists")

// isConflictError checks if a Supabase error indicates a unique constraint violation.
func isConflictError(err error) bool {
	if err == nil {
		return false
	}
	errMsg := err.Error()
	return strings.Contains(errMsg, "409") ||
		strings.Contains(errMsg, "23505") ||
		strings.Contains(errMsg, "duplicate key") ||
		strings.Contains(errMsg, "unique constraint")
}

// parseContentRange parses the Content-Range header value to extract the total count.
// Format: "*/total" or "start-end/total"
func parseContentRange(header string) (int, error) {
	parts := strings.Split(header, "/")
	if len(parts) != 2 {
		return 0, fmt.Errorf("invalid content-range format: %s", header)
	}
	total, err := strconv.Atoi(parts[1])
	if err != nil {
		return 0, fmt.Errorf("invalid total in content-range: %s", parts[1])
	}
	return total, nil
}
