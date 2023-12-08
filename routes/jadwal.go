package routes

import (
	"encoding/base64"
	"net/http"
	"strconv"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"projek1/databases"
)

// Jadwal adalah fungsi untuk menangani route terkait jadwal dokter.
func Jadwal(r *gin.Engine, db *gorm.DB) {
	// Handler untuk HTTP GET request pada path "/jadwal".
	r.GET("/jadwal", func(c *gin.Context) {
		// Mengambil data dokter beserta jadwal praktek dari database.
		var data []databases.ProfilDokter
		if err := db.Preload("JadwalDokter").Find(&data).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data dari database"})
			return
		}
		// Mengubah gambar dokter menjadi base64 untuk disertakan dalam response HTML.
		for i := range data {
			encodedImage := base64.StdEncoding.EncodeToString(data[i].Gambar)
			data[i].EncodedGambar = encodedImage
		}
		// Mengirimkan response HTML dengan data dokter dan jadwal praktek.
		c.HTML(http.StatusOK, "jadwal.html", gin.H{"data": data})
	})

	// Handler untuk HTTP GET request pada path "/jadwal/api/byID/:id".
	r.GET("/jadwal/api/byID/:id", func(c *gin.Context) {
		// Mengambil parameter ID dari path.
		start := c.Param("id")
		var data []databases.ProfilDokter
		startID, _ := strconv.Atoi(start)

		// Mengambil data dokter beserta jadwal praktek berdasarkan ID dokter.
		if err := db.Preload("JadwalDokter").Where("id_dokter = ?", startID).Find(&data).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data dari database"})
			return
		}

		// Menangani situasi ketika data dokter tidak ditemukan.
		if len(data) == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "Data tidak ditemukan"})
			return
		}

		// Mengirimkan response JSON dengan data dokter dan jadwal praktek.
		c.JSON(http.StatusOK, data)
	})

	// Handler untuk HTTP GET request pada path "/jadwal/api/byPoli/:poli".
	r.GET("/jadwal/api/byPoli/:poli", func(c *gin.Context) {
		// Mengambil parameter poli dari path.
		poli := c.Param("poli")
		var data []databases.ProfilDokter

		// Mengambil data dokter beserta jadwal praktek berdasarkan poli.
		if err := db.Preload("JadwalDokter").Where("poli = ?", poli).Find(&data).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data dari database"})
			return
		}

		// Mengirimkan response JSON dengan data dokter dan jadwal praktek berdasarkan poli.
		c.JSON(http.StatusOK, data)
	})

	// Handler untuk HTTP GET request pada path "/jadwal/api/getPoli".
	r.GET("/jadwal/api/getPoli", func(c *gin.Context) {
		var poliList []string

		// Mengambil daftar poli yang tersedia dari data dokter.
		if err := db.Model(&databases.ProfilDokter{}).Distinct("poli").Pluck("poli", &poliList).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data poli dari database"})
			return
		}

		// Mengirimkan response JSON dengan daftar poli yang tersedia.
		c.JSON(http.StatusOK, poliList)
	})
}
