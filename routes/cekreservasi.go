package routes

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func CekReservasi (r *gin.Engine, db *gorm.DB) {
	r.GET("/cekreservasi", func(c *gin.Context) {
		c.HTML(http.StatusOK, "cekreservasi.html", nil)
	})
}