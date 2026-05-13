package repository

import (
	"encoding/json"
	"fmt"

	"portfolio-platform/apps/api/internal/model"
	"portfolio-platform/apps/api/pkg/supabase"
)

// ResumeRepository defines the interface for resume data access.
type ResumeRepository interface {
	Get() (*model.Resume, error)
	Update(resume *model.Resume) (*model.Resume, error)
}

// resumeRepository implements ResumeRepository using the Supabase client.
type resumeRepository struct {
	client *supabase.Client
}

// NewResumeRepository creates a new ResumeRepository backed by Supabase.
func NewResumeRepository(client *supabase.Client) ResumeRepository {
	return &resumeRepository{client: client}
}

// Get retrieves the resume record (assumes a single row in the resume table).
func (r *resumeRepository) Get() (*model.Resume, error) {
	path := "resume?select=*&limit=1"
	data, err := r.client.Get(path)
	if err != nil {
		return nil, fmt.Errorf("repository: failed to get resume: %w", err)
	}

	var resumes []model.Resume
	if err := json.Unmarshal(data, &resumes); err != nil {
		return nil, fmt.Errorf("repository: failed to parse resume: %w", err)
	}

	if len(resumes) == 0 {
		return nil, nil
	}

	return &resumes[0], nil
}

// resumePatch is the struct used for PATCH requests — uses snake_case JSON keys
// matching Supabase/PostgreSQL column names.
type resumePatch struct {
	PdfURL    *string `json:"pdf_url"`
	UpdatedAt string  `json:"updated_at"`
}

// Update modifies the resume record's pdf_url and updated_at by ID.
func (r *resumeRepository) Update(resume *model.Resume) (*model.Resume, error) {
	// Only patch the fields we're changing — use snake_case to match DB columns
	patch := resumePatch{
		PdfURL:    resume.PdfURL,
		UpdatedAt: resume.UpdatedAt.UTC().Format("2006-01-02T15:04:05Z"),
	}

	body, err := json.Marshal(patch)
	if err != nil {
		return nil, fmt.Errorf("repository: failed to marshal resume patch: %w", err)
	}

	// Use limit=1 to ensure we only update the single resume row
	path := fmt.Sprintf("resume?id=eq.%s&limit=1", resume.ID)
	_, err = r.client.Patch(path, body)
	if err != nil {
		return nil, fmt.Errorf("repository: failed to update resume (id=%s): %w", resume.ID, err)
	}

	// Re-fetch to confirm the update was applied
	updated, err := r.Get()
	if err != nil {
		return nil, fmt.Errorf("repository: failed to re-fetch resume after update: %w", err)
	}

	// If still nil or pdf_url didn't change, return the in-memory version
	if updated == nil || (resume.PdfURL != nil && (updated.PdfURL == nil || *updated.PdfURL != *resume.PdfURL)) {
		return resume, nil
	}

	return updated, nil
}
