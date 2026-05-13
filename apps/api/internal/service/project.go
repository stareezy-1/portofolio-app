package service

import (
	"fmt"

	"portfolio-platform/apps/api/internal/model"
	"portfolio-platform/apps/api/internal/repository"
)

// Custom error types for the service layer.

// ErrValidation is returned when input validation fails.
type ErrValidation struct {
	Message string
	Fields  map[string]string
}

func (e *ErrValidation) Error() string {
	return e.Message
}

// ErrNotFound is returned when a requested resource does not exist.
type ErrNotFound struct {
	Message string
}

func (e *ErrNotFound) Error() string {
	return e.Message
}

// ErrConflict is returned when a resource conflicts with an existing one (e.g., duplicate slug).
type ErrConflict struct {
	Message string
}

func (e *ErrConflict) Error() string {
	return e.Message
}

// ErrInvalidFile is returned when an uploaded file fails validation.
type ErrInvalidFile struct {
	Message string
}

func (e *ErrInvalidFile) Error() string {
	return e.Message
}

// ProjectCreateInput holds validated input for creating a project.
type ProjectCreateInput struct {
	Title          string
	Slug           string
	Description    string
	Type           string
	Thumbnail      string
	Gallery        []string
	Technologies   []string
	GithubURL      *string
	LiveURL        *string
	PlayStoreURL   *string
	AppStoreURL    *string
	DemoMode       bool
	EmulatorConfig *model.EmulatorConfig
	Featured       bool
}

// ProjectUpdateInput holds validated input for updating a project.
type ProjectUpdateInput struct {
	Title          *string
	Slug           *string
	Description    *string
	Type           *string
	Thumbnail      *string
	Gallery        []string
	Technologies   []string
	GithubURL      *string
	LiveURL        *string
	PlayStoreURL   *string
	AppStoreURL    *string
	DemoMode       *bool
	EmulatorConfig *model.EmulatorConfig
	Featured       *bool
}

// ProjectService defines the interface for project business logic.
type ProjectService interface {
	ListProjects(page, limit int) ([]model.Project, *model.PaginationMeta, error)
	GetProject(slug string) (*model.Project, error)
	GetProjectByID(id string) (*model.Project, error)
	GetFeaturedProjects() ([]model.Project, error)
	CreateProject(input *ProjectCreateInput) (*model.Project, error)
	UpdateProject(id string, input *ProjectUpdateInput) (*model.Project, error)
	DeleteProject(id string) error
}

// projectService implements ProjectService.
type projectService struct {
	repo repository.ProjectRepository
}

// NewProjectService creates a new ProjectService with the given repository.
func NewProjectService(repo repository.ProjectRepository) ProjectService {
	return &projectService{repo: repo}
}

// ListProjects retrieves a paginated list of projects.
func (s *projectService) ListProjects(page, limit int) ([]model.Project, *model.PaginationMeta, error) {
	return s.repo.List(page, limit)
}

// GetProject retrieves a single project by slug.
func (s *projectService) GetProject(slug string) (*model.Project, error) {
	project, err := s.repo.GetBySlug(slug)
	if err != nil {
		return nil, err
	}
	if project == nil {
		return nil, &ErrNotFound{Message: fmt.Sprintf("project with slug %q not found", slug)}
	}
	return project, nil
}

// GetProjectByID retrieves a single project by its UUID.
func (s *projectService) GetProjectByID(id string) (*model.Project, error) {
	project, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}
	if project == nil {
		return nil, &ErrNotFound{Message: fmt.Sprintf("project with id %q not found", id)}
	}
	return project, nil
}

// GetFeaturedProjects retrieves all featured projects.
func (s *projectService) GetFeaturedProjects() ([]model.Project, error) {
	return s.repo.GetFeatured()
}

// CreateProject validates input, checks slug uniqueness, and creates a project.
func (s *projectService) CreateProject(input *ProjectCreateInput) (*model.Project, error) {
	if err := validateCreateInput(input); err != nil {
		return nil, err
	}

	// Check slug uniqueness
	exists, err := s.repo.SlugExists(input.Slug)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, &ErrConflict{Message: fmt.Sprintf("project with slug %q already exists", input.Slug)}
	}

	project := &model.Project{
		Title:          input.Title,
		Slug:           input.Slug,
		Description:    input.Description,
		Type:           input.Type,
		Thumbnail:      input.Thumbnail,
		Gallery:        input.Gallery,
		Technologies:   input.Technologies,
		GithubURL:      input.GithubURL,
		LiveURL:        input.LiveURL,
		PlayStoreURL:   input.PlayStoreURL,
		AppStoreURL:    input.AppStoreURL,
		DemoMode:       input.DemoMode,
		EmulatorConfig: input.EmulatorConfig,
		Featured:       input.Featured,
	}

	return s.repo.Create(project)
}

// UpdateProject validates input and updates an existing project.
func (s *projectService) UpdateProject(id string, input *ProjectUpdateInput) (*model.Project, error) {
	if err := validateUpdateInput(input); err != nil {
		return nil, err
	}

	// If slug is being updated, check it doesn't conflict with a DIFFERENT project
	if input.Slug != nil {
		existing, err := s.repo.GetBySlug(*input.Slug)
		if err != nil {
			return nil, err
		}
		// Conflict only if the slug belongs to a different project
		if existing != nil && existing.ID != id {
			return nil, &ErrConflict{Message: fmt.Sprintf("project with slug %q already exists", *input.Slug)}
		}
	}

	project := &model.Project{}
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

	updated, err := s.repo.Update(id, project)
	if err != nil {
		if err == repository.ErrSlugConflict {
			return nil, &ErrConflict{Message: fmt.Sprintf("project with slug %q already exists", *input.Slug)}
		}
		return nil, err
	}
	if updated == nil {
		return nil, &ErrNotFound{Message: fmt.Sprintf("project with id %q not found", id)}
	}

	return updated, nil
}

// DeleteProject removes a project by ID.
func (s *projectService) DeleteProject(id string) error {
	return s.repo.Delete(id)
}

// validateCreateInput checks that all required fields are present for project creation.
func validateCreateInput(input *ProjectCreateInput) error {
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
		return &ErrValidation{
			Message: "validation failed",
			Fields:  fields,
		}
	}

	return nil
}

// validateUpdateInput checks that any provided fields have valid values.
func validateUpdateInput(input *ProjectUpdateInput) error {
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
		return &ErrValidation{
			Message: "validation failed",
			Fields:  fields,
		}
	}

	return nil
}
