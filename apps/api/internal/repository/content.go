package repository

import (
	"encoding/json"
	"fmt"
	"time"

	"portfolio-platform/apps/api/internal/model"
	"portfolio-platform/apps/api/pkg/supabase"
)

// ContentRepository defines the interface for portfolio content data access.
type ContentRepository interface {
	Get() (*model.PortfolioContent, error)
	Update(content *model.PortfolioContent) (*model.PortfolioContent, error)
}

type contentRepository struct {
	client *supabase.Client
}

func NewContentRepository(client *supabase.Client) ContentRepository {
	return &contentRepository{client: client}
}

// Get retrieves the single portfolio_content row.
func (r *contentRepository) Get() (*model.PortfolioContent, error) {
	path := "portfolio_content?select=*&limit=1"
	data, err := r.client.Get(path)
	if err != nil {
		return nil, fmt.Errorf("repository: failed to get content: %w", err)
	}

	// Supabase returns snake_case — use a raw map to remap
	var rows []map[string]json.RawMessage
	if err := json.Unmarshal(data, &rows); err != nil {
		return nil, fmt.Errorf("repository: failed to parse content: %w", err)
	}
	if len(rows) == 0 {
		return nil, nil
	}

	return mapRowToContent(rows[0])
}

// Update patches the portfolio_content row with only the changed fields.
func (r *contentRepository) Update(content *model.PortfolioContent) (*model.PortfolioContent, error) {
	// Build a snake_case patch map
	patch := map[string]interface{}{
		"name":                content.Name,
		"role":                content.Role,
		"tagline":             content.Tagline,
		"bio":                 content.Bio,
		"avatar_url":          content.AvatarURL,
		"years_of_experience": content.YearsOfExperience,
		"projects_built":      content.ProjectsBuilt,
		"happy_clients":       content.HappyClients,
		"email":               content.Email,
		"location":            content.Location,
		"social_links":        content.SocialLinks,
		"tech_stack":          content.TechStack,
		"work_experience":     content.WorkExperience,
		"education":           content.Education,
		"updated_at":          time.Now().UTC().Format("2006-01-02T15:04:05Z"),
	}

	body, err := json.Marshal(patch)
	if err != nil {
		return nil, fmt.Errorf("repository: failed to marshal content: %w", err)
	}

	path := fmt.Sprintf("portfolio_content?id=eq.%s", content.ID)
	_, err = r.client.Patch(path, body)
	if err != nil {
		return nil, fmt.Errorf("repository: failed to update content: %w", err)
	}

	return r.Get()
}

// mapRowToContent converts a snake_case Supabase row to PortfolioContent.
func mapRowToContent(row map[string]json.RawMessage) (*model.PortfolioContent, error) {
	c := &model.PortfolioContent{}

	unmarshalStr := func(key string, dest *string) {
		if v, ok := row[key]; ok {
			_ = json.Unmarshal(v, dest)
		}
	}
	unmarshalInt := func(key string, dest *int) {
		if v, ok := row[key]; ok {
			_ = json.Unmarshal(v, dest)
		}
	}
	unmarshalTime := func(key string, dest *time.Time) {
		if v, ok := row[key]; ok {
			var s string
			if err := json.Unmarshal(v, &s); err == nil {
				t, _ := time.Parse(time.RFC3339, s)
				*dest = t
			}
		}
	}

	unmarshalStr("id", &c.ID)
	unmarshalStr("name", &c.Name)
	unmarshalStr("role", &c.Role)
	unmarshalStr("tagline", &c.Tagline)
	unmarshalStr("bio", &c.Bio)
	unmarshalStr("email", &c.Email)
	unmarshalStr("location", &c.Location)
	unmarshalInt("years_of_experience", &c.YearsOfExperience)
	unmarshalInt("projects_built", &c.ProjectsBuilt)
	unmarshalInt("happy_clients", &c.HappyClients)
	unmarshalTime("updated_at", &c.UpdatedAt)

	if v, ok := row["avatar_url"]; ok {
		var s string
		if err := json.Unmarshal(v, &s); err == nil && s != "" {
			c.AvatarURL = &s
		}
	}
	if v, ok := row["social_links"]; ok {
		_ = json.Unmarshal(v, &c.SocialLinks)
	}
	if v, ok := row["tech_stack"]; ok {
		_ = json.Unmarshal(v, &c.TechStack)
	}
	if v, ok := row["work_experience"]; ok {
		_ = json.Unmarshal(v, &c.WorkExperience)
	}
	if v, ok := row["education"]; ok {
		_ = json.Unmarshal(v, &c.Education)
	}

	return c, nil
}
