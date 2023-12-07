package databases

import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var db *gorm.DB

func InitDatabase() *gorm.DB {
	dsn := "xhaeffer:#Cobacoba123@tcp(127.0.0.1:3306)/klinik"
	var err error
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("Gagal terhubung ke database")
	}

	db.Table(new(Reservasi).TableName()).AutoMigrate(&Reservasi{})
	db.Table(new(ProfilDokter).TableName()).AutoMigrate(&ProfilDokter{})
	db.Table(new(JadwalDokter).TableName()).AutoMigrate(&JadwalDokter{})

	return db
}
