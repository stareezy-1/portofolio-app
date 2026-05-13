package repository

import (
	"fmt"
	"math"
	"testing"
)

func TestParseContentRange(t *testing.T) {
	tests := []struct {
		name    string
		header  string
		want    int
		wantErr bool
	}{
		{
			name:    "standard range format",
			header:  "0-9/42",
			want:    42,
			wantErr: false,
		},
		{
			name:    "empty result format",
			header:  "*/0",
			want:    0,
			wantErr: false,
		},
		{
			name:    "large total",
			header:  "0-99/1000",
			want:    1000,
			wantErr: false,
		},
		{
			name:    "invalid format no slash",
			header:  "invalid",
			wantErr: true,
		},
		{
			name:    "invalid total not a number",
			header:  "0-9/abc",
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := parseContentRange(tt.header)
			if (err != nil) != tt.wantErr {
				t.Errorf("parseContentRange() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !tt.wantErr && got != tt.want {
				t.Errorf("parseContentRange() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestPaginationMath(t *testing.T) {
	tests := []struct {
		name           string
		page           int
		limit          int
		total          int
		wantOffset     int
		wantTotalPages int
	}{
		{
			name:           "first page",
			page:           1,
			limit:          10,
			total:          42,
			wantOffset:     0,
			wantTotalPages: 5,
		},
		{
			name:           "second page",
			page:           2,
			limit:          10,
			total:          42,
			wantOffset:     10,
			wantTotalPages: 5,
		},
		{
			name:           "exact division",
			page:           1,
			limit:          10,
			total:          30,
			wantOffset:     0,
			wantTotalPages: 3,
		},
		{
			name:           "single item",
			page:           1,
			limit:          10,
			total:          1,
			wantOffset:     0,
			wantTotalPages: 1,
		},
		{
			name:           "empty result",
			page:           1,
			limit:          10,
			total:          0,
			wantOffset:     0,
			wantTotalPages: 0,
		},
		{
			name:           "custom limit",
			page:           3,
			limit:          5,
			total:          22,
			wantOffset:     10,
			wantTotalPages: 5,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			offset := (tt.page - 1) * tt.limit
			totalPages := int(math.Ceil(float64(tt.total) / float64(tt.limit)))

			if offset != tt.wantOffset {
				t.Errorf("offset = %v, want %v", offset, tt.wantOffset)
			}
			if totalPages != tt.wantTotalPages {
				t.Errorf("totalPages = %v, want %v", totalPages, tt.wantTotalPages)
			}
		})
	}
}

func TestIsConflictError(t *testing.T) {
	tests := []struct {
		name string
		err  error
		want bool
	}{
		{
			name: "nil error",
			err:  nil,
			want: false,
		},
		{
			name: "409 status code",
			err:  fmt.Errorf("supabase: request returned status 409: duplicate"),
			want: true,
		},
		{
			name: "23505 postgres code",
			err:  fmt.Errorf("ERROR: 23505 unique_violation"),
			want: true,
		},
		{
			name: "duplicate key message",
			err:  fmt.Errorf("duplicate key value violates unique constraint"),
			want: true,
		},
		{
			name: "unique constraint message",
			err:  fmt.Errorf("violates unique constraint on slug"),
			want: true,
		},
		{
			name: "unrelated error",
			err:  fmt.Errorf("connection timeout"),
			want: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := isConflictError(tt.err)
			if got != tt.want {
				t.Errorf("isConflictError() = %v, want %v", got, tt.want)
			}
		})
	}
}
