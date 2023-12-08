package main

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"projek1/databases"
	"projek1/routes"
)

func init() {
	// Mengatur mode debug untuk Gin
	gin.SetMode(gin.DebugMode)
}

// Routes menginisialisasi dan menyiapkan rute untuk aplikasi
func Routes(r *gin.Engine, db *gorm.DB) {
	// Menyiapkan rute untuk fungsionalitas yang berbeda
	routes.Index(r)
	routes.Jadwal(r, db)
	routes.Reservasi(r, db)
	routes.CekReservasi(r)
}

func main() {
	// Menginisialisasi koneksi database
	db := databases.InitDatabase()

	// Membuat router Gin baru
	r := gin.Default()
	r.Use(gin.Recovery())

	// Memuat template HTML dari direktori "templates"
	r.LoadHTMLGlob("templates/*.html")

	// Menyajikan file statis dari direktori "templates"
	r.Static("/templates", "./templates")

	// Menyiapkan rute
	Routes(r, db)

	// Menjalankan aplikasi Gin pada port default (0.0.0.0:8080)
	r.Run()
}
