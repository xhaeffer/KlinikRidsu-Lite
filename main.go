package main

import (
	"net/http"
	"strconv"
	"encoding/base64"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	//"fmt"
)

var db *gorm.DB

type Reservasi struct {
	IdReservasi  int    `gorm:"primaryKey;autoIncrement" json:"id_reservasi"`
	TglKunjungan string `gorm:"column:tgl_kunjungan" json:"tgl_kunjungan"`
	Nama         string `gorm:"column:nama" json:"nama"`
	NoRS         int    `gorm:"column:no_rs" json:"no_rs"`
	Pembayaran   string `gorm:"column:pembayaran" json:"pembayaran"`
	NIK          int    `gorm:"column:nik" json:"nik"`
	TglLahir     string `gorm:"column:tgl_lahir" json:"tgl_lahir"`
	Email        string `gorm:"column:email" json:"email"`
	JenisKelamin string `gorm:"column:jenis_kelamin" json:"jenis_kelamin"`
	NoTelp       string `gorm:"column:no_telp" json:"no_telp"`
}

type ProfilDokter struct {
	IdDokter		int				`gorm:"primaryKey" json:"id_dokter"`
	Nama			string  		`gorm:"column:nama_dokter" json:"nama_dokter"`
	Spesialisasi	string 			`gorm:"column:spesialisasi" json:"spesialisasi"`
	Gambar      	[]byte  		`gorm:"column:foto_dokter" json:"-"`
	EncodedGambar 	string 			
	JadwalDokter 	[]JadwalDokter	`gorm:"foreignKey:IdDokter"`
}

type JadwalDokter struct {
	IdJadwal     	string	`gorm:"primaryKey" json:"id_jadwal"`
	IdDokter		int		`gorm:"column:id_dokter" json:"id_dokter"`
	Hari_Praktek    string	`gorm:"column:hari_praktek" json:"hari"`
	JamMulai  	 	string	`gorm:"column:jam_mulai" json:"jam_mulai"`
	JamSelesai	 	string	`gorm:"column:jam_selesai" json:"jam_selesai"`
}

func (Reservasi) TableName() string {
    return "reservasi"
}

func (ProfilDokter) TableName() string {
	return "profil_dokter"
}

func (JadwalDokter) TableName() string {
	return "jadwal_dokter"
}

func init() {
	gin.SetMode(gin.DebugMode)

	dsn := "xhaeffer:#Cobacoba123@tcp(127.0.0.1:3306)/klinik"
	var err error
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("Gagal terhubung ke database")
	}

	db.Table(new(Reservasi).TableName()).AutoMigrate(&Reservasi{})
	db.Table(new(ProfilDokter).TableName()).AutoMigrate(&ProfilDokter{})
	db.Table(new(JadwalDokter).TableName()).AutoMigrate(&JadwalDokter{})

}

func main() {
	r := gin.Default()
	r.Use(gin.Recovery())
	r.LoadHTMLGlob("templates/*.html")
	r.Static("/templates", "./templates")

	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)

	})

	r.GET("/reservasi", func(c *gin.Context) {
		c.HTML(http.StatusOK, "reservasi.html", nil)
	})

	r.POST("/reservasi", func(c *gin.Context) {
		var data Reservasi

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

	r.GET("/reservasi/:start/:end", func(c *gin.Context) {
		start := c.Param("start")
		end := c.Param("end")
		var data []Reservasi
	
		startID, _:= strconv.Atoi(start)
		endID, _ := strconv.Atoi(end)
	
		for i := startID; i <= endID; i++ {
			var item Reservasi
			if err := db.First(&item, i).Error; err == nil {
				data = append(data, item)
			}
		}
	
		if len(data) == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "Data tidak ditemukan"})
			return
		}
	
		c.JSON(http.StatusOK, data)
	})

	r.GET("/jadwal", func(c *gin.Context) {
		var data []ProfilDokter
		if err := db.Preload("JadwalDokter").Find(&data).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data dari database"})
			return
		}
		for i := range data {
			encodedImage := base64.StdEncoding.EncodeToString(data[i].Gambar)
			data[i].EncodedGambar = encodedImage
		}
		c.HTML(http.StatusOK, "jadwal2.html", gin.H{"data": data})
	})

	r.POST("/jadwal", func(c *gin.Context) {
		c.HTML(http.StatusOK, "jadwal2.html", nil)
	})

	r.GET("/jadwal/:start/:end", func(c *gin.Context) {
		start := c.Param("start")
		end := c.Param("end")
		var data []ProfilDokter
	
		startID, _:= strconv.Atoi(start)
		endID, _ := strconv.Atoi(end)
	
		for i := startID; i <= endID; i++ {
			var item ProfilDokter
			if err := db.First(&item, i).Error; err == nil {
				data = append(data, item)
			}
		}
	
		if len(data) == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "Data tidak ditemukan"})
			return
		}
	
		c.JSON(http.StatusOK, data)
	})

	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
