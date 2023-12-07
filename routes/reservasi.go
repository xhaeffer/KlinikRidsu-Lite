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

		if err := c.BindJSON(&data); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	
		if err := db.Create(&data).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan data ke database"})
			return
		}
	
		c.JSON(http.StatusOK, data)
	})

	r.GET("/reservasi/api/byID/:id", func(c *gin.Context) {
		id := c.Param("id")

		var data []databases.Reservasi

		if err := db.Model(&databases.Reservasi{}).Where("id_reservasi = ?", id).Find(&data).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data dari database"})
			return
		}		
		c.JSON(http.StatusOK, data)
	})

	r.PUT("/reservasi/api/byID/:id", func(c *gin.Context) {
		id := c.Param("id")
	
		var updatedData databases.Reservasi
		if err := c.Bind(&updatedData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Format data tidak valid"})
			return
		}

		var existingData databases.Reservasi
		if err := db.Where("id_reservasi = ?", id).First(&existingData).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Data tidak ditemukan"})
			return
		}

		if err := db.Model(&existingData).Updates(updatedData).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal melakukan update"})
			return
		}
	
		c.JSON(http.StatusOK, gin.H{"message": "Data berhasil diupdate"})
	})

	r.DELETE("/reservasi/api/byID/:id", func(c *gin.Context) {
		id := c.Param("id")
	
		var reservasi databases.Reservasi
		if err := db.Where("id_reservasi = ?", id).Delete(&reservasi).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghapus data dari database"})
			return
		}
	
		c.JSON(http.StatusOK, gin.H{"message": "Data berhasil dihapus"})
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