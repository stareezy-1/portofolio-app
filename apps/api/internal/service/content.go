package service

import (
	"fmt"

	"portfolio-platform/apps/api/internal/model"
	"portfolio-platform/apps/api/internal/repository"
)

// ContentService defines the interface for portfolio content business logic.
type ContentService interface {
	GetContent() (*model.PortfolioContent, error)
	UpdateContent(input *model.PortfolioContent) (*model.PortfolioContent, error)
}

type contentService struct {
	repo repository.ContentRepository
}

func NewContentService(repo repository.ContentRepository) ContentService {
	return &contentService{repo: repo}
}

func (s *contentService) GetContent() (*model.PortfolioContent, error) {
	content, err := s.repo.Get()
	if err != nil {
		return nil, err
	}
	if content == nil {
		return nil, &ErrNotFound{Message: "portfolio content not found — run the SQL schema"}
	}
	return content, nil
}

func (s *contentService) UpdateContent(input *model.PortfolioContent) (*model.PortfolioContent, error) {
	if input.Name == "" {
		return nil, &ErrValidation{Message: "name is required", Fields: map[string]string{"name": "name is required"}}
	}
	if input.Role == "" {
		return nil, &ErrValidation{Message: "role is required", Fields: map[string]string{"role": "role is required"}}
	}

	updated, err := s.repo.Update(input)
	if err != nil {
		return nil, fmt.Errorf("failed to update content: %w", err)
	}
	return updated, nil
}
