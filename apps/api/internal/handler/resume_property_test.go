package handler

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"pgregory.net/rapid"

	"portfolio-platform/apps/api/internal/model"
	"portfolio-platform/apps/api/internal/service"
	"portfolio-platform/apps/api/pkg/supabase"
)

// =============================================================================
// In-memory ResumeService for property-based testing
// =============================================================================

type inMemoryResumeService struct {
	resume  *model.Resume
	storage *supabase.Client
}

func newInMemoryResumeService(storage *supabase.Client) *inMemoryResumeService {
	return &inMemoryResumeService{
		resume: &model.Resume{
			ID:         "resume-1",
			Experience: []model.TimelineItem{},
			Education:  []model.TimelineItem{},
			Skills:     []model.SkillCategory{},
			PdfURL:     nil,
			UpdatedAt:  time.Now(),
		},
		storage: storage,
	}
}

func (s *inMemoryResumeService) GetResume() (*model.Resume, error) {
	if s.resume == nil {
		return nil, &service.ErrNotFound{Message: "resume not found"}
	}
	return s.resume, nil
}

func (s *inMemoryResumeService) UploadResume(fileData []byte, contentType string, fileSize int64) (*model.Resume, error) {
	// Validate PDF format
	if contentType != "application/pdf" {
		return nil, &service.ErrInvalidFile{
			Message: "file must be in PDF format",
		}
	}

	// Validate file size (10MB max)
	const maxPDFSize = 10 * 1024 * 1024
	if fileSize > maxPDFSize {
		return nil, &service.ErrInvalidFile{
			Message: "PDF file exceeds maximum size of 10MB",
		}
	}

	// Upload to storage
	storagePath := "resumes/resume.pdf"
	publicURL, err := s.storage.UploadFile("test-bucket", storagePath, fileData, contentType)
	if err != nil {
		return nil, err
	}

	// Update resume metadata
	s.resume.PdfURL = &publicURL
	s.resume.UpdatedAt = time.Now()

	return s.resume, nil
}

// =============================================================================
// Test helpers
// =============================================================================

func setupResumePropertyRouter() (*gin.Engine, *inMemoryResumeService) {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	// Create a mock storage server
	storageServer := mockStorageServer()
	storageClient := supabase.NewClient(storageServer.URL, "test-key")

	resumeSvc := newInMemoryResumeService(storageClient)
	resumeHandler := NewResumeHandler(resumeSvc)

	r.GET("/resume", resumeHandler.GetResume)
	r.POST("/admin/resume", resumeHandler.UploadResume)

	return r, resumeSvc
}

// resumeResponse is used to unmarshal the resume API response.
type resumeResponse struct {
	Success bool          `json:"success"`
	Data    *model.Resume `json:"data"`
	Error   *model.ApiError `json:"error,omitempty"`
}

// =============================================================================
// Property 6: Resume upload round-trip
// Feature: portfolio-platform, Property 6: Resume upload round-trip
// Validates: Requirements 4.3
// =============================================================================

func TestPropertyResumeUploadRoundTrip(t *testing.T) {
	// For any valid PDF file under 10MB uploaded via POST /admin/resume,
	// the resume metadata returned by GET /resume SHALL contain a pdfUrl
	// pointing to the uploaded file.
	rapid.Check(t, func(t *rapid.T) {
		router, _ := setupResumePropertyRouter()

		// Generate a valid PDF file size (1KB to 10MB)
		fileSize := rapid.IntRange(1024, 10*1024*1024).Draw(t, "fileSize")
		fileData := genFileData(fileSize)

		// Upload PDF via POST /admin/resume
		req, err := createMultipartRequest("/admin/resume", "file", "resume.pdf", "application/pdf", fileData)
		require.NoError(t, err)

		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)
		require.Equal(t, http.StatusOK, w.Code)

		var uploadResp resumeResponse
		err = json.Unmarshal(w.Body.Bytes(), &uploadResp)
		require.NoError(t, err)
		require.True(t, uploadResp.Success)
		require.NotNil(t, uploadResp.Data)
		require.NotNil(t, uploadResp.Data.PdfURL)

		// Fetch resume via GET /resume
		w = httptest.NewRecorder()
		req, _ = http.NewRequest("GET", "/resume", nil)
		router.ServeHTTP(w, req)
		require.Equal(t, http.StatusOK, w.Code)

		var getResp resumeResponse
		err = json.Unmarshal(w.Body.Bytes(), &getResp)
		require.NoError(t, err)
		require.True(t, getResp.Success)
		require.NotNil(t, getResp.Data)

		// The resume metadata SHALL contain a pdfUrl pointing to the uploaded file
		require.NotNil(t, getResp.Data.PdfURL, "pdfUrl must be present after upload")
		assert.NotEmpty(t, *getResp.Data.PdfURL, "pdfUrl must not be empty")

		// The pdfUrl from GET should match what was returned from the upload
		assert.Equal(t, *uploadResp.Data.PdfURL, *getResp.Data.PdfURL,
			"GET /resume pdfUrl should match the URL returned from upload")
	})
}
