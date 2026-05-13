package handler

import (
	"fmt"
	"net/http"
	"net/smtp"
	"os"
	"strings"

	"github.com/gin-gonic/gin"

	"portfolio-platform/apps/api/internal/model"
	"portfolio-platform/apps/api/internal/service"
)

// ContentHandler handles portfolio content endpoints.
type ContentHandler struct {
	svc service.ContentService
}

func NewContentHandler(svc service.ContentService) *ContentHandler {
	return &ContentHandler{svc: svc}
}

// GetContent handles GET /content — public endpoint.
func (h *ContentHandler) GetContent(c *gin.Context) {
	content, err := h.svc.GetContent()
	if err != nil {
		writeServiceError(c, err)
		return
	}
	c.JSON(http.StatusOK, model.ApiResponse{Success: true, Data: content})
}

// UpdateContent handles PUT /admin/content — admin endpoint.
func (h *ContentHandler) UpdateContent(c *gin.Context) {
	var input model.PortfolioContent
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, model.ApiResponse{
			Success: false, Data: nil,
			Error: &model.ApiError{Code: "VALIDATION_ERROR", Message: "invalid request body"},
		})
		return
	}

	// Preserve the existing ID
	existing, err := h.svc.GetContent()
	if err != nil {
		writeServiceError(c, err)
		return
	}
	input.ID = existing.ID

	updated, err := h.svc.UpdateContent(&input)
	if err != nil {
		writeServiceError(c, err)
		return
	}
	c.JSON(http.StatusOK, model.ApiResponse{Success: true, Data: updated})
}

// SendContact handles POST /contact — sends an email or logs the message.
func SendContact(c *gin.Context) {
	var msg model.ContactMessage
	if err := c.ShouldBindJSON(&msg); err != nil {
		c.JSON(http.StatusBadRequest, model.ApiResponse{
			Success: false, Data: nil,
			Error: &model.ApiError{Code: "VALIDATION_ERROR", Message: "name, email, and message are required"},
		})
		return
	}

	smtpHost := os.Getenv("SMTP_HOST")
	if smtpHost != "" {
		if err := sendContactEmail(msg); err != nil {
			// Don't fail the request — log and continue
			fmt.Printf("[CONTACT] Email send failed: %v\n", err)
		}
	}

	// Always log the message
	fmt.Printf("[CONTACT] From: %s <%s>\n%s\n", msg.Name, msg.Email, msg.Message)

	c.JSON(http.StatusOK, model.ApiResponse{
		Success: true,
		Data:    map[string]string{"message": "Message received! I'll get back to you soon."},
	})
}

// sendContactEmail sends a contact form message via SMTP.
// Configure via env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL
func sendContactEmail(msg model.ContactMessage) error {
	host := os.Getenv("SMTP_HOST")
	port := os.Getenv("SMTP_PORT")
	user := os.Getenv("SMTP_USER")
	pass := os.Getenv("SMTP_PASS")
	to := os.Getenv("CONTACT_TO_EMAIL")

	if port == "" {
		port = "587"
	}
	if to == "" {
		to = user
	}

	auth := smtp.PlainAuth("", user, pass, host)

	subject := fmt.Sprintf("Portfolio Contact: %s", msg.Name)
	body := fmt.Sprintf("From: %s <%s>\n\n%s", msg.Name, msg.Email, msg.Message)
	emailBody := fmt.Sprintf("To: %s\r\nSubject: %s\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n%s", to, subject, body)

	recipients := strings.Split(to, ",")
	return smtp.SendMail(host+":"+port, auth, user, recipients, []byte(emailBody))
}
