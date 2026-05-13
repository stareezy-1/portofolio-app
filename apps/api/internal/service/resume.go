package service

import (
	"fmt"
	"time"

	"portfolio-platform/apps/api/internal/model"
	"portfolio-platform/apps/api/internal/repository"
	"portfolio-platform/apps/api/pkg/supabase"
)

// ResumeService defines the interface for resume business logic.
type ResumeService interface {
	GetResume() (*model.Resume, error)
	UploadResume(fileData []byte, contentType string, fileSize int64) (*model.Resume, error)
}

// resumeService implements ResumeService.
type resumeService struct {
	repo    repository.ResumeRepository
	storage *supabase.Client
	bucket  string
}

// NewResumeService creates a new ResumeService with the given repository and storage client.
func NewResumeService(repo repository.ResumeRepository, storage *supabase.Client, bucket string) ResumeService {
	return &resumeService{repo: repo, storage: storage, bucket: bucket}
}

// GetResume retrieves the current resume data.
func (s *resumeService) GetResume() (*model.Resume, error) {
	resume, err := s.repo.Get()
	if err != nil {
		return nil, err
	}
	if resume == nil {
		return nil, &ErrNotFound{Message: "resume not found"}
	}
	return resume, nil
}

// UploadResume validates the PDF, uploads it to storage, and updates resume metadata.
func (s *resumeService) UploadResume(fileData []byte, contentType string, fileSize int64) (*model.Resume, error) {
	// Validate PDF format — handler already verified, but double-check
	if contentType != "application/pdf" {
		return nil, &ErrValidation{
			Message: "file must be in PDF format",
			Fields:  map[string]string{"file": "only PDF format is accepted"},
		}
	}

	// Validate file size (10MB max)
	const maxPDFSize = 10 * 1024 * 1024
	if fileSize > maxPDFSize {
		return nil, &ErrValidation{
			Message: "PDF file exceeds maximum size of 10MB",
			Fields:  map[string]string{"file": "file exceeds 10MB limit"},
		}
	}

	// Upload to Supabase Storage — use a fixed path so we overwrite the same file
	storagePath := "resumes/resume.pdf"
	publicURL, err := s.storage.UploadFile(s.bucket, storagePath, fileData, contentType)
	if err != nil {
		return nil, fmt.Errorf("storage upload failed: %w", err)
	}

	// Add cache-busting timestamp so browsers always fetch the latest version
	publicURL = fmt.Sprintf("%s?t=%d", publicURL, time.Now().Unix())

	// Get current resume row
	resume, err := s.repo.Get()
	if err != nil {
		return nil, fmt.Errorf("failed to fetch resume record: %w", err)
	}
	if resume == nil {
		return nil, &ErrNotFound{Message: "resume record not found — run the SQL schema to create it"}
	}

	// Update the pdf_url
	resume.PdfURL = &publicURL
	resume.UpdatedAt = time.Now()

	updated, err := s.repo.Update(resume)
	if err != nil {
		return nil, fmt.Errorf("failed to save pdf_url to database: %w", err)
	}
	if updated == nil {
		// Storage succeeded — return in-memory record
		return resume, nil
	}

	return updated, nil
}
