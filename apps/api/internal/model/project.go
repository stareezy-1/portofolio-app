package model

import "time"

// Project represents a portfolio project entity.
type Project struct {
	ID             string          `json:"id" db:"id"`
	Title          string          `json:"title" db:"title" binding:"required"`
	Slug           string          `json:"slug" db:"slug" binding:"required"`
	Description    string          `json:"description" db:"description" binding:"required"`
	Thumbnail      string          `json:"thumbnail" db:"thumbnail"`
	Gallery        []string        `json:"gallery" db:"gallery"`
	Technologies   []string        `json:"technologies" db:"technologies"`
	Type           string          `json:"type" db:"type" binding:"required,oneof=mobile web backend"`
	GithubURL      *string         `json:"githubUrl" db:"github_url"`
	LiveURL        *string         `json:"liveUrl" db:"live_url"`
	PlayStoreURL   *string         `json:"playStoreUrl" db:"play_store_url"`
	AppStoreURL    *string         `json:"appStoreUrl" db:"app_store_url"`
	DemoMode       bool            `json:"demoMode" db:"demo_mode"`
	EmulatorConfig *EmulatorConfig `json:"emulatorConfig" db:"emulator_config"`
	Featured       bool            `json:"featured" db:"featured"`
	CreatedAt      time.Time       `json:"createdAt" db:"created_at"`
	UpdatedAt      time.Time       `json:"updatedAt" db:"updated_at"`
}

// EmulatorConfig holds configuration for the mobile emulator demo view.
type EmulatorConfig struct {
	ExpoURL     string `json:"expoUrl"`
	Platform    string `json:"platform"`
	Orientation string `json:"orientation"`
	DeviceModel string `json:"deviceModel,omitempty"`
}
