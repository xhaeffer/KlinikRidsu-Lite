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

	r.PUT("/reservasi/api/byID/:id", func(c *gin.Context) {
		// Ambil parameter NoRS dari URL
		id := c.Param("id")
	
		// Ambil data yang akan diupdate dari body permintaan
		var updatedData databases.Reservasi
		if err := c.BindJSON(&updatedData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Format data tidak valid"})
			return
		}

		// Lakukan operasi update di database dengan GORM
		var existingData databases.Reservasi
		if err := db.Where("id_reservasi = ?", id).First(&existingData).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Data tidak ditemukan"})
			return
		}

		// Update data yang ditemukan
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