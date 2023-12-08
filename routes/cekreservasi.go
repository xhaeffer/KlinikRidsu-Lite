package routes

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

// CekReservasi adalah fungsi untuk menangani route "/cekreservasi".
func CekReservasi(r *gin.Engine) {
	// Handler untuk HTTP GET request pada path "/cekreservasi".
	r.GET("/cekreservasi", func(c *gin.Context) {
		// Mengirimkan response HTML dengan status OK (200).
		c.HTML(http.StatusOK, "cekreservasi.html", nil)
	})
}
