package routes

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"projek1/databases"
)

// Reservasi adalah fungsi untuk menangani route terkait reservasi.
func Reservasi(r *gin.Engine, db *gorm.DB) {
	// Handler untuk HTTP GET request pada path "/reservasi".
	r.GET("/reservasi", func(c *gin.Context) {
		// Mengirimkan response HTML dengan status OK (200).
		c.HTML(http.StatusOK, "reservasi.html", nil)
	})

	// Handler untuk HTTP POST request pada path "/reservasi".
	r.POST("/reservasi", func(c *gin.Context) {
		// Membaca data reservasi dari JSON request.
		var data databases.Reservasi
		if err := c.Bind(&data); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	
		// Menyimpan data reservasi ke database.
		if err := db.Create(&data).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan data ke database"})
			return
		}
	
		// Mengirimkan response JSON dengan data reservasi yang telah disimpan.
		c.HTML(http.StatusOK, "reservasi.html", nil)
	})

	// Handler untuk HTTP GET request pada path "/reservasi/api/byID/:id".
	r.GET("/reservasi/api/byID/:id", func(c *gin.Context) {
		// Mengambil parameter ID dari path.
		id := c.Param("id")

		// Mengambil data reservasi berdasarkan ID dari database.
		var data []databases.Reservasi
		if err := db.Model(&databases.Reservasi{}).Where("id_reservasi = ?", id).Find(&data).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data dari database"})
			return
		}		
		// Mengirimkan response JSON dengan data reservasi yang sesuai dengan ID.
		c.JSON(http.StatusOK, data)
	})

	// Handler untuk HTTP PUT request pada path "/reservasi/api/byID/:id".
	r.PUT("/reservasi/api/byID/:id", func(c *gin.Context) {
		// Mengambil parameter ID dari path.
		id := c.Param("id")
	
		// Membaca data reservasi yang akan diupdate dari request.
		var updatedData databases.Reservasi
		if err := c.Bind(&updatedData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Format data tidak valid"})
			return
		}

		// Mengambil data reservasi yang akan diupdate dari database.
		var existingData databases.Reservasi
		if err := db.Where("id_reservasi = ?", id).First(&existingData).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Data tidak ditemukan"})
			return
		}

		// Melakukan update data reservasi di database.
		if err := db.Model(&existingData).Updates(updatedData).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal melakukan update"})
			return
		}
	
		// Mengirimkan response JSON sebagai konfirmasi update berhasil.
		c.JSON(http.StatusOK, gin.H{"message": "Data berhasil diupdate"})
	})

	// Handler untuk HTTP DELETE request pada path "/reservasi/api/byID/:id".
	r.DELETE("/reservasi/api/byID/:id", func(c *gin.Context) {
		// Mengambil parameter ID dari path.
		id := c.Param("id")
	
		// Menghapus data reservasi dari database berdasarkan ID.
		var reservasi databases.Reservasi
		if err := db.Where("id_reservasi = ?", id).Delete(&reservasi).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghapus data dari database"})
			return
		}
	
		// Mengirimkan response JSON sebagai konfirmasi penghapusan berhasil.
		c.JSON(http.StatusOK, gin.H{"message": "Data berhasil dihapus"})
	})

	// Handler untuk HTTP GET request pada path "/reservasi/api/byNoRS/:param".
	r.GET("/reservasi/api/byNoRS/:param", func(c *gin.Context) {
		// Mengambil parameter nomor RS dari path.
		no_rs := c.Param("param")

		// Mengambil data reservasi berdasarkan nomor RS dari database.
		var data []databases.Reservasi
		if err := db.Model(&databases.Reservasi{}).Where("no_rs = ?", no_rs).Find(&data).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data dari database"})
			return
		}		
		// Mengirimkan response JSON dengan data reservasi yang sesuai dengan nomor RS.
		c.JSON(http.StatusOK, data)
	})
}
