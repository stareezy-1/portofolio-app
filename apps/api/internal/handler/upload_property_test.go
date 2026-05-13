package handler

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"pgregory.net/rapid"

	"portfolio-platform/apps/api/internal/model"
	"portfolio-platform/apps/api/internal/service"
	"portfolio-platform/apps/api/pkg/supabase"
)

// =============================================================================
// Mock Supabase client for upload tests
// =============================================================================

// mockStorageServer creates a test HTTP server that simulates Supabase Storage.
func mockStorageServer() *httptest.Server {
	return httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Simulate successful upload
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"Key":"test"}`))
	}))
}

// =============================================================================
// Mock ResumeService for resume upload tests
// =============================================================================

type mockResumeService struct {
	resume *model.Resume
}

func newMockResumeService() *mockResumeService {
	pdfURL := "https://storage.example.com/resumes/resume.pdf"
	return &mockResumeService{
		resume: &model.Resume{
			ID:         "resume-1",
			Experience: []model.TimelineItem{},
			Education:  []model.TimelineItem{},
			Skills:     []model.SkillCategory{},
			PdfURL:     &pdfURL,
		},
	}
}

func (m *mockResumeService) GetResume() (*model.Resume, error) {
	if m.resume == nil {
		return nil, &service.ErrNotFound{Message: "resume not found"}
	}
	return m.resume, nil
}

func (m *mockResumeService) UploadResume(fileData []byte, contentType string, fileSize int64) (*model.Resume, error) {
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

	// Simulate successful upload
	url := fmt.Sprintf("https://storage.example.com/resumes/resume-%d.pdf", len(fileData))
	m.resume.PdfURL = &url
	return m.resume, nil
}

// =============================================================================
// Test helpers
// =============================================================================

func setupUploadRouter() (*gin.Engine, *mockResumeService) {
	gin.SetMode(gin.TestMode)
	r := gin.New()

	// Create a mock storage server
	storageServer := mockStorageServer()
	storageClient := supabase.NewClient(storageServer.URL, "test-key")

	uploadHandler := NewUploadHandler(storageClient, "test-bucket")
	resumeSvc := newMockResumeService()
	resumeHandler := NewResumeHandler(resumeSvc)

	r.POST("/admin/upload", uploadHandler.Upload)
	r.POST("/admin/resume", resumeHandler.UploadResume)

	return r, resumeSvc
}

// createMultipartRequest creates a multipart form request with a file.
func createMultipartRequest(url, fieldName, filename, contentType string, fileData []byte) (*http.Request, error) {
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	part, err := writer.CreatePart(createFormFileHeader(fieldName, filename, contentType))
	if err != nil {
		return nil, err
	}
	if _, err := io.Copy(part, bytes.NewReader(fileData)); err != nil {
		return nil, err
	}
	writer.Close()

	req, err := http.NewRequest("POST", url, body)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", writer.FormDataContentType())
	return req, nil
}

// createFormFileHeader creates a MIME header for a form file part.
func createFormFileHeader(fieldName, filename, contentType string) map[string][]string {
	return map[string][]string{
		"Content-Disposition": {fmt.Sprintf(`form-data; name="%s"; filename="%s"`, fieldName, filename)},
		"Content-Type":       {contentType},
	}
}

// =============================================================================
// Generators
// =============================================================================

var validImageTypes = []string{"image/jpeg", "image/png", "image/webp"}
var validAllTypes = []string{"image/jpeg", "image/png", "image/webp", "application/pdf"}
var invalidTypes = []string{
	"text/plain", "text/html", "application/json", "application/xml",
	"image/gif", "image/bmp", "image/svg+xml", "application/zip",
	"video/mp4", "audio/mpeg", "application/octet-stream",
}

func genInvalidContentType() *rapid.Generator[string] {
	return rapid.Custom(func(t *rapid.T) string {
		idx := rapid.IntRange(0, len(invalidTypes)-1).Draw(t, "invalidTypeIdx")
		return invalidTypes[idx]
	})
}

func genValidImageType() *rapid.Generator[string] {
	return rapid.Custom(func(t *rapid.T) string {
		idx := rapid.IntRange(0, len(validImageTypes)-1).Draw(t, "imageTypeIdx")
		return validImageTypes[idx]
	})
}

func genValidFileType() *rapid.Generator[string] {
	return rapid.Custom(func(t *rapid.T) string {
		idx := rapid.IntRange(0, len(validAllTypes)-1).Draw(t, "fileTypeIdx")
		return validAllTypes[idx]
	})
}

// genFileData generates file data of a specific size (in bytes).
func genFileData(size int) []byte {
	data := make([]byte, size)
	for i := range data {
		data[i] = byte(i % 256)
	}
	return data
}

// =============================================================================
// Property 7: File upload type and size validation
// Feature: portfolio-platform, Property 7: File upload type and size validation
// Validates: Requirements 4.4, 6.4, 10.1, 10.4
// =============================================================================

func TestPropertyFileUploadTypeValidation(t *testing.T) {
	// For any file uploaded via POST /admin/upload: if the file type is not in
	// [PDF, JPG, PNG, WEBP] the response SHALL be 400.
	rapid.Check(t, func(t *rapid.T) {
		router, _ := setupUploadRouter()

		invalidType := genInvalidContentType().Draw(t, "contentType")
		fileData := genFileData(1024) // 1KB file

		req, err := createMultipartRequest("/admin/upload", "file", "test.bin", invalidType, fileData)
		require.NoError(t, err)

		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusBadRequest, w.Code)

		var resp errorResponse
		err = json.Unmarshal(w.Body.Bytes(), &resp)
		require.NoError(t, err)
		assert.False(t, resp.Success)
		require.NotNil(t, resp.Error)
		assert.Equal(t, "INVALID_FILE", resp.Error.Code)
	})
}

func TestPropertyFileUploadImageSizeValidation(t *testing.T) {
	// If an image file exceeds 5MB the response SHALL be 400.
	rapid.Check(t, func(t *rapid.T) {
		router, _ := setupUploadRouter()

		imageType := genValidImageType().Draw(t, "imageType")
		// Generate a size that exceeds 5MB (5*1024*1024 + 1 to 6*1024*1024)
		oversizeBytes := rapid.IntRange(5*1024*1024+1, 6*1024*1024).Draw(t, "fileSize")
		fileData := genFileData(oversizeBytes)

		req, err := createMultipartRequest("/admin/upload", "file", "large-image.jpg", imageType, fileData)
		require.NoError(t, err)

		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusBadRequest, w.Code)

		var resp errorResponse
		err = json.Unmarshal(w.Body.Bytes(), &resp)
		require.NoError(t, err)
		assert.False(t, resp.Success)
		require.NotNil(t, resp.Error)
		assert.Equal(t, "INVALID_FILE", resp.Error.Code)
	})
}

func TestPropertyFileUploadPDFSizeValidation(t *testing.T) {
	// If a PDF file exceeds 10MB the response SHALL be 400.
	rapid.Check(t, func(t *rapid.T) {
		router, _ := setupUploadRouter()

		// Generate a size that exceeds 10MB (10*1024*1024 + 1 to 11*1024*1024)
		oversizeBytes := rapid.IntRange(10*1024*1024+1, 11*1024*1024).Draw(t, "fileSize")
		fileData := genFileData(oversizeBytes)

		req, err := createMultipartRequest("/admin/upload", "file", "large.pdf", "application/pdf", fileData)
		require.NoError(t, err)

		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusBadRequest, w.Code)

		var resp errorResponse
		err = json.Unmarshal(w.Body.Bytes(), &resp)
		require.NoError(t, err)
		assert.False(t, resp.Success)
		require.NotNil(t, resp.Error)
		assert.Equal(t, "INVALID_FILE", resp.Error.Code)
	})
}

func TestPropertyFileUploadValidFilesAccepted(t *testing.T) {
	// Only files passing both type and size checks SHALL be accepted.
	rapid.Check(t, func(t *rapid.T) {
		router, _ := setupUploadRouter()

		fileType := genValidFileType().Draw(t, "fileType")

		// Generate a valid size based on type
		var maxSize int
		if fileType == "application/pdf" {
			maxSize = 10 * 1024 * 1024
		} else {
			maxSize = 5 * 1024 * 1024
		}
		// Use a size between 1KB and the max allowed
		fileSize := rapid.IntRange(1024, maxSize).Draw(t, "fileSize")
		fileData := genFileData(fileSize)

		ext := ".bin"
		switch fileType {
		case "image/jpeg":
			ext = ".jpg"
		case "image/png":
			ext = ".png"
		case "image/webp":
			ext = ".webp"
		case "application/pdf":
			ext = ".pdf"
		}

		req, err := createMultipartRequest("/admin/upload", "file", "test"+ext, fileType, fileData)
		require.NoError(t, err)

		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		// Valid files SHALL be accepted (200 OK)
		assert.Equal(t, http.StatusOK, w.Code)

		var resp model.ApiResponse
		err = json.Unmarshal(w.Body.Bytes(), &resp)
		require.NoError(t, err)
		assert.True(t, resp.Success)
	})
}

func TestPropertyResumeUploadTypeValidation(t *testing.T) {
	// For POST /admin/resume: if the file type is not PDF the response SHALL be 400.
	rapid.Check(t, func(t *rapid.T) {
		router, _ := setupUploadRouter()

		// Use non-PDF types (including valid image types which are not valid for resume)
		nonPDFTypes := append(invalidTypes, validImageTypes...)
		idx := rapid.IntRange(0, len(nonPDFTypes)-1).Draw(t, "typeIdx")
		invalidType := nonPDFTypes[idx]

		fileData := genFileData(1024)

		req, err := createMultipartRequest("/admin/resume", "file", "resume.txt", invalidType, fileData)
		require.NoError(t, err)

		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusBadRequest, w.Code)

		var resp errorResponse
		err = json.Unmarshal(w.Body.Bytes(), &resp)
		require.NoError(t, err)
		assert.False(t, resp.Success)
		require.NotNil(t, resp.Error)
		assert.Equal(t, "INVALID_FILE", resp.Error.Code)
	})
}

func TestPropertyResumeUploadPDFSizeValidation(t *testing.T) {
	// For POST /admin/resume: if a PDF file exceeds 10MB the response SHALL be 400.
	rapid.Check(t, func(t *rapid.T) {
		router, _ := setupUploadRouter()

		oversizeBytes := rapid.IntRange(10*1024*1024+1, 11*1024*1024).Draw(t, "fileSize")
		fileData := genFileData(oversizeBytes)

		req, err := createMultipartRequest("/admin/resume", "file", "resume.pdf", "application/pdf", fileData)
		require.NoError(t, err)

		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusBadRequest, w.Code)

		var resp errorResponse
		err = json.Unmarshal(w.Body.Bytes(), &resp)
		require.NoError(t, err)
		assert.False(t, resp.Success)
		require.NotNil(t, resp.Error)
		assert.Equal(t, "INVALID_FILE", resp.Error.Code)
	})
}
