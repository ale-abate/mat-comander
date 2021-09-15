package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"io/ioutil"
	"log"
	"net/http"
	"path"
	"path/filepath"
	"strings"
)

func main() {

	myRouter := mux.NewRouter().StrictSlash(true)
	myRouter.HandleFunc("/{!(api)}", serveTemplate)
	myRouter.HandleFunc("/api/hola", processHola)
	myRouter.HandleFunc("/api/hola/{id}", processHola)
	myRouter.HandleFunc("/api/dir", processDir)

	log.Println("Listening on :3000...")
	err := http.ListenAndServe(":3000", myRouter)
	if err != nil {
		log.Fatal(err)
	}
}

func serveTemplate(w http.ResponseWriter, r *http.Request) {
	qpath := r.URL.Path
	if !strings.HasPrefix(qpath, "/") {
		qpath = "/" + qpath
		r.URL.Path = qpath
	}
	ppath := "./static" + qpath

	dir, name := filepath.Split(ppath)
	fs := http.Dir(dir)

	f, err := fs.Open(name)
	if err != nil {
		log.Println("file cannot be opened:", name)
		ppath = "./static/index.html"
		http.ServeFile(w, r, path.Clean(ppath))
		return
	}
	defer f.Close()

	_, err = f.Stat()
	if err != nil {
		log.Println("file not found:", name)
		ppath = "./static/index.html"
		http.ServeFile(w, r, path.Clean(ppath))
		return
	}

	http.ServeFile(w, r, path.Clean(ppath))
}

type Article struct {
	Title   string `json:"Title"`
	Desc    string `json:"desc"`
	Content string `json:"content"`
}

// let's declare a global Articles array
// that we can then populate in our main function
// to simulate a database
var Articles []Article

func processHola(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	key := vars["id"]

	if key != "" {
		fmt.Fprintf(w, "Key: "+key)
	}

	Articles = []Article{
		Article{Title: "Hello", Desc: "Article Description", Content: "Article Content"},
		Article{Title: "Hello 2", Desc: "Article Description", Content: "Article Content"},
	}
	json.NewEncoder(w).Encode(Articles)
}

func processDir(w http.ResponseWriter, r *http.Request) {

	files, err := ioutil.ReadDir("c:/")
	if err != nil {
		log.Fatal(err)
	}

	var fileNames []string

	for _, f := range files {
		fmt.Println(f.Name())
		fileNames = append(fileNames, f.Name())
	}

	json.NewEncoder(w).Encode(fileNames)
}
