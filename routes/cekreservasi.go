package routes

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

func CekReservasi (r *gin.Engine) {
	r.GET("/cekreservasi", func(c *gin.Context) {
		c.HTML(http.StatusOK, "cekreservasi.html", nil)
	})
}
