package databases

import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// db adalah variabel global untuk menyimpan instance database GORM.
var db *gorm.DB

// InitDatabase menginisialisasi koneksi database dan melakukan migrasi otomatis.
// Ini mengembalikan instance database GORM untuk penggunaan lebih lanjut.
func InitDatabase() *gorm.DB {
	// Tentukan Data Source Name (DSN) untuk koneksi MySQL.
	dsn := "xhaeffer:#Cobacoba123@tcp(127.0.0.1:3306)/klinik"

	// Coba membuka koneksi ke database menggunakan GORM.
	var err error
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		// Jika terjadi kesalahan selama percobaan koneksi, panic dengan pesan kesalahan.
		panic("Gagal terhubung ke database")
	}

	// Lakukan migrasi otomatis untuk tabel Reservasi, ProfilDokter, dan JadwalDokter.
	db.Table(new(Reservasi).TableName()).AutoMigrate(&Reservasi{})
	db.Table(new(ProfilDokter).TableName()).AutoMigrate(&ProfilDokter{})
	db.Table(new(JadwalDokter).TableName()).AutoMigrate(&JadwalDokter{})

	// Kembalikan instance database GORM yang telah diinisialisasi.
	return db
}
