package model

import "time"

// SocialLink represents a social media link.
type SocialLink struct {
	Platform string `json:"platform"`
	URL      string `json:"url"`
}

// TechCategory represents a category of technologies.
type TechCategory struct {
	Category string   `json:"category"`
	Icon     string   `json:"icon"`
	Skills   []string `json:"skills"`
}

// WorkExperience represents a work experience entry.
type WorkExperience struct {
	ID           string   `json:"id"`
	Title        string   `json:"title"`
	Organization string   `json:"organization"`
	Location     string   `json:"location,omitempty"`
	StartDate    string   `json:"startDate"`
	EndDate      string   `json:"endDate,omitempty"`
	Description  string   `json:"description"`
	Highlights   []string `json:"highlights"`
}

// Education represents an education entry.
type Education struct {
	ID           string   `json:"id"`
	Title        string   `json:"title"`
	Organization string   `json:"organization"`
	Location     string   `json:"location,omitempty"`
	StartDate    string   `json:"startDate"`
	EndDate      string   `json:"endDate,omitempty"`
	Description  string   `json:"description"`
	Highlights   []string `json:"highlights"`
}

// PortfolioContent holds all dynamic public page content.
type PortfolioContent struct {
	ID                 string           `json:"id"`
	Name               string           `json:"name"`
	Role               string           `json:"role"`
	Tagline            string           `json:"tagline"`
	Bio                string           `json:"bio"`
	AvatarURL          *string          `json:"avatarUrl"`
	YearsOfExperience  int              `json:"yearsOfExperience"`
	ProjectsBuilt      int              `json:"projectsBuilt"`
	HappyClients       int              `json:"happyClients"`
	Email              string           `json:"email"`
	Location           string           `json:"location"`
	SocialLinks        []SocialLink     `json:"socialLinks"`
	TechStack          []TechCategory   `json:"techStack"`
	WorkExperience     []WorkExperience `json:"workExperience"`
	Education          []Education      `json:"education"`
	UpdatedAt          time.Time        `json:"updatedAt"`
}

// ContactMessage represents an inbound contact form submission.
type ContactMessage struct {
	Name    string `json:"name" binding:"required"`
	Email   string `json:"email" binding:"required,email"`
	Message string `json:"message" binding:"required"`
}
