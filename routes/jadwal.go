package routes

import (
	"encoding/base64"
	"net/http"
	"strconv"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"projek1/databases"
)

func Jadwal (r *gin.Engine, db *gorm.DB) {
	r.GET("/jadwal", func(c *gin.Context) {
		var data []databases.ProfilDokter
		if err := db.Preload("JadwalDokter").Find(&data).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data dari database"})
			return
		}
		for i := range data {
			encodedImage := base64.StdEncoding.EncodeToString(data[i].Gambar)
			data[i].EncodedGambar = encodedImage
		}
		c.HTML(http.StatusOK, "jadwal.html", gin.H{"data": data})
	})

	r.GET("/jadwal/api/byID/:id", func(c *gin.Context) {
		start := c.Param("id")

		var data []databases.ProfilDokter
		startID, _ := strconv.Atoi(start)

		if err := db.Preload("JadwalDokter").Where("id_dokter = ?", startID).Find(&data).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data dari database"})
			return
		}
	
		if len(data) == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "Data tidak ditemukan"})
			return
		}
	
		c.JSON(http.StatusOK, data)
	})

	r.GET("/jadwal/api/byPoli/:poli", func(c *gin.Context) {
		poli := c.Param("poli")
		
		var data []databases.ProfilDokter
		if err := db.Preload("JadwalDokter").Where("poli = ?", poli).Find(&data).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data dari database"})
			return
		}
		
		c.JSON(http.StatusOK, data)
	})

	r.GET("/jadwal/api/getPoli", func(c *gin.Context) {
		var poliList []string
	
		if err := db.Model(&databases.ProfilDokter{}).Distinct("poli").Pluck("poli", &poliList).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data poli dari database"})
			return
		}
	
		c.JSON(http.StatusOK, poliList)
	})
}