package service

import (
	"fmt"
	"testing"

	"portfolio-platform/apps/api/internal/model"
)

// mockProjectRepository is a test double for ProjectRepository.
type mockProjectRepository struct {
	projects    map[string]*model.Project
	slugExists  bool
	slugExistsErr error
	createErr   error
	updateErr   error
	deleteErr   error
}

func newMockRepo() *mockProjectRepository {
	return &mockProjectRepository{
		projects: make(map[string]*model.Project),
	}
}

func (m *mockProjectRepository) List(page, limit int) ([]model.Project, *model.PaginationMeta, error) {
	var results []model.Project
	for _, p := range m.projects {
		results = append(results, *p)
	}
	meta := &model.PaginationMeta{Page: page, Limit: limit, Total: len(results), TotalPages: 1}
	return results, meta, nil
}

func (m *mockProjectRepository) GetBySlug(slug string) (*model.Project, error) {
	for _, p := range m.projects {
		if p.Slug == slug {
			return p, nil
		}
	}
	return nil, nil
}

func (m *mockProjectRepository) GetByID(id string) (*model.Project, error) {
	if p, ok := m.projects[id]; ok {
		return p, nil
	}
	return nil, nil
}

func (m *mockProjectRepository) GetFeatured() ([]model.Project, error) {
	var results []model.Project
	for _, p := range m.projects {
		if p.Featured {
			results = append(results, *p)
		}
	}
	return results, nil
}

func (m *mockProjectRepository) Create(project *model.Project) (*model.Project, error) {
	if m.createErr != nil {
		return nil, m.createErr
	}
	project.ID = "generated-id"
	m.projects[project.ID] = project
	return project, nil
}

func (m *mockProjectRepository) Update(id string, project *model.Project) (*model.Project, error) {
	if m.updateErr != nil {
		return nil, m.updateErr
	}
	if _, ok := m.projects[id]; !ok {
		return nil, nil
	}
	m.projects[id] = project
	return project, nil
}

func (m *mockProjectRepository) Delete(id string) error {
	if m.deleteErr != nil {
		return m.deleteErr
	}
	delete(m.projects, id)
	return nil
}

func (m *mockProjectRepository) SlugExists(slug string) (bool, error) {
	if m.slugExistsErr != nil {
		return false, m.slugExistsErr
	}
	return m.slugExists, nil
}

func TestCreateProject_ValidationErrors(t *testing.T) {
	repo := newMockRepo()
	svc := NewProjectService(repo)

	tests := []struct {
		name           string
		input          *ProjectCreateInput
		expectedFields []string
	}{
		{
			name:           "all required fields missing",
			input:          &ProjectCreateInput{},
			expectedFields: []string{"title", "slug", "description", "type"},
		},
		{
			name: "title missing",
			input: &ProjectCreateInput{
				Slug:        "test-slug",
				Description: "desc",
				Type:        "web",
			},
			expectedFields: []string{"title"},
		},
		{
			name: "invalid type",
			input: &ProjectCreateInput{
				Title:       "Test",
				Slug:        "test-slug",
				Description: "desc",
				Type:        "invalid",
			},
			expectedFields: []string{"type"},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			_, err := svc.CreateProject(tt.input)
			if err == nil {
				t.Fatal("expected validation error, got nil")
			}

			valErr, ok := err.(*ErrValidation)
			if !ok {
				t.Fatalf("expected *ErrValidation, got %T", err)
			}

			for _, field := range tt.expectedFields {
				if _, exists := valErr.Fields[field]; !exists {
					t.Errorf("expected field error for %q, not found in %v", field, valErr.Fields)
				}
			}
		})
	}
}

func TestCreateProject_SlugConflict(t *testing.T) {
	repo := newMockRepo()
	repo.slugExists = true
	svc := NewProjectService(repo)

	input := &ProjectCreateInput{
		Title:       "Test Project",
		Slug:        "existing-slug",
		Description: "A test project",
		Type:        "web",
	}

	_, err := svc.CreateProject(input)
	if err == nil {
		t.Fatal("expected conflict error, got nil")
	}

	_, ok := err.(*ErrConflict)
	if !ok {
		t.Fatalf("expected *ErrConflict, got %T: %v", err, err)
	}
}

func TestCreateProject_Success(t *testing.T) {
	repo := newMockRepo()
	svc := NewProjectService(repo)

	input := &ProjectCreateInput{
		Title:       "My Project",
		Slug:        "my-project",
		Description: "A great project",
		Type:        "web",
	}

	project, err := svc.CreateProject(input)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if project.Title != input.Title {
		t.Errorf("expected title %q, got %q", input.Title, project.Title)
	}
	if project.Slug != input.Slug {
		t.Errorf("expected slug %q, got %q", input.Slug, project.Slug)
	}
}

func TestGetProject_NotFound(t *testing.T) {
	repo := newMockRepo()
	svc := NewProjectService(repo)

	_, err := svc.GetProject("nonexistent")
	if err == nil {
		t.Fatal("expected not found error, got nil")
	}

	_, ok := err.(*ErrNotFound)
	if !ok {
		t.Fatalf("expected *ErrNotFound, got %T: %v", err, err)
	}
}

func TestGetProject_Success(t *testing.T) {
	repo := newMockRepo()
	repo.projects["id-1"] = &model.Project{
		ID:          "id-1",
		Title:       "Found Project",
		Slug:        "found-project",
		Description: "desc",
		Type:        "web",
	}
	svc := NewProjectService(repo)

	project, err := svc.GetProject("found-project")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if project.Title != "Found Project" {
		t.Errorf("expected title %q, got %q", "Found Project", project.Title)
	}
}

func TestUpdateProject_ValidationErrors(t *testing.T) {
	repo := newMockRepo()
	svc := NewProjectService(repo)

	emptyStr := ""
	input := &ProjectUpdateInput{
		Title: &emptyStr,
	}

	_, err := svc.UpdateProject("some-id", input)
	if err == nil {
		t.Fatal("expected validation error, got nil")
	}

	valErr, ok := err.(*ErrValidation)
	if !ok {
		t.Fatalf("expected *ErrValidation, got %T", err)
	}
	if _, exists := valErr.Fields["title"]; !exists {
		t.Error("expected field error for 'title'")
	}
}

func TestUpdateProject_SlugConflict(t *testing.T) {
	repo := newMockRepo()
	// Seed a DIFFERENT project that already owns "taken-slug"
	repo.projects["id-1"] = &model.Project{ID: "id-1", Slug: "old-slug"}
	repo.projects["id-2"] = &model.Project{ID: "id-2", Slug: "taken-slug"}
	svc := NewProjectService(repo)

	newSlug := "taken-slug"
	input := &ProjectUpdateInput{
		Slug: &newSlug,
	}

	// Updating id-1 to use "taken-slug" (owned by id-2) should conflict
	_, err := svc.UpdateProject("id-1", input)
	if err == nil {
		t.Fatal("expected conflict error, got nil")
	}

	_, ok := err.(*ErrConflict)
	if !ok {
		t.Fatalf("expected *ErrConflict, got %T: %v", err, err)
	}
}

func TestDeleteProject_Success(t *testing.T) {
	repo := newMockRepo()
	repo.projects["id-1"] = &model.Project{ID: "id-1"}
	svc := NewProjectService(repo)

	err := svc.DeleteProject("id-1")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
}

func TestDeleteProject_Error(t *testing.T) {
	repo := newMockRepo()
	repo.deleteErr = fmt.Errorf("database error")
	svc := NewProjectService(repo)

	err := svc.DeleteProject("id-1")
	if err == nil {
		t.Fatal("expected error, got nil")
	}
}
