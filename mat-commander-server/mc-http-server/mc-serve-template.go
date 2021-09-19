package mc_http_server

import (
	"log"
	"net/http"
	"path"
	"path/filepath"
	"strings"
)

func ServeTemplate(w http.ResponseWriter, r *http.Request) {
	reqPath := r.URL.Path
	if !strings.HasPrefix(reqPath, "/") {
		reqPath = "/" + reqPath
		r.URL.Path = reqPath
	}
	templatePath := "./static" + reqPath

	dir, name := filepath.Split(templatePath)
	fs := http.Dir(dir)

	f, err := fs.Open(name)
	if err != nil {
		log.Println("file cannot be opened:", name)
		templatePath = "./static/index.html"
		http.ServeFile(w, r, path.Clean(templatePath))
		return
	}
	defer f.Close()

	_, err = f.Stat()
	if err != nil {
		log.Println("file not found:", name)
		templatePath = "./static/index.html"
		http.ServeFile(w, r, path.Clean(templatePath))
		return
	}
	http.ServeFile(w, r, path.Clean(templatePath))
}
