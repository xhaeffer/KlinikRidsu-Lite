package main
import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"projek1/databases"
	"projek1/routes"
)

func init() {
	gin.SetMode(gin.DebugMode)
}

func Routes(r *gin.Engine, db *gorm.DB) {
	routes.Index(r)
	routes.Jadwal(r, db)
	routes.Reservasi(r, db)
	routes.CekReservasi(r)
}

func main() {
	db := databases.InitDatabase()
	r := gin.Default()
	r.Use(gin.Recovery())
	r.LoadHTMLGlob("templates/*.html")
	r.Static("/templates", "./templates")
	Routes(r, db)
	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}	
