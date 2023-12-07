package routes

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"projek1/databases"
)

func Reservasi (r *gin.Engine, db *gorm.DB) {
	r.GET("/reservasi", func(c *gin.Context) {
		c.HTML(http.StatusOK, "reservasi.html", nil)
	})

	r.POST("/reservasi", func(c *gin.Context) {
		var data databases.Reservasi

		// Bind data dari formulir HTML ke struct
		if err := c.Bind(&data); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Simpan data ke dalam database
		if err := db.Create(&data).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan data ke database"})
			return
		} else {
			c.HTML(http.StatusOK, "reservasi.html", gin.H{"message": "Reservasi berhasil disimpan", "data": data})
		}
	})

	r.GET("/reservasi/api/byNoRS/:param", func(c *gin.Context) {
		no_rs := c.Param("param")

		var data []databases.Reservasi

		if err := db.Model(&databases.Reservasi{}).Where("no_rs = ?", no_rs).Find(&data).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data dari database"})
			return
		}		
		c.JSON(http.StatusOK, data)
	})
}