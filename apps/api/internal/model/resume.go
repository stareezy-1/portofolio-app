package model

import "time"

// Resume represents the resume/CV data entity.
// JSON tags use snake_case to match Supabase/PostgREST column names for DB reads.
type Resume struct {
	ID         string          `json:"id"`
	Experience []TimelineItem  `json:"experience"`
	Education  []TimelineItem  `json:"education"`
	Skills     []SkillCategory `json:"skills"`
	PdfURL     *string         `json:"pdf_url"`
	UpdatedAt  time.Time       `json:"updated_at"`
}

// ResumeResponse is the API response shape with camelCase keys for the frontend.
type ResumeResponse struct {
	ID         string          `json:"id"`
	Experience []TimelineItem  `json:"experience"`
	Education  []TimelineItem  `json:"education"`
	Skills     []SkillCategory `json:"skills"`
	PdfURL     *string         `json:"pdfUrl"`
	UpdatedAt  time.Time       `json:"updatedAt"`
}

// ToResponse converts a Resume DB model to the API response shape.
func (r *Resume) ToResponse() *ResumeResponse {
	return &ResumeResponse{
		ID:         r.ID,
		Experience: r.Experience,
		Education:  r.Education,
		Skills:     r.Skills,
		PdfURL:     r.PdfURL,
		UpdatedAt:  r.UpdatedAt,
	}
}

// TimelineItem represents a single entry in the experience or education timeline.
type TimelineItem struct {
	ID           string   `json:"id"`
	Title        string   `json:"title"`
	Organization string   `json:"organization"`
	Location     *string  `json:"location,omitempty"`
	StartDate    string   `json:"startDate"`
	EndDate      *string  `json:"endDate,omitempty"`
	Description  string   `json:"description"`
	Highlights   []string `json:"highlights"`
}

// SkillCategory groups skills under a named category.
type SkillCategory struct {
	Category string   `json:"category"`
	Skills   []string `json:"skills"`
}
