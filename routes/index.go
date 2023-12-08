package routes

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

// Index adalah fungsi untuk menangani route "/".
func Index(r *gin.Engine) {
	// Handler untuk HTTP GET request pada root path "/".
	r.GET("/", func(c *gin.Context) {
		// Mengirimkan response HTML dengan status OK (200).
		c.HTML(http.StatusOK, "index.html", nil)
	})
}
