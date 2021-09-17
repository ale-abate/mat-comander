package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"path/filepath"
	"strings"
	"time"
)

type McFile struct {
	Name string    `json:"name"`
	Ext  string    `json:"ext"`
	Size int64     `json:"size"`
	Dir  bool      `json:"dir"`
	Time time.Time `json:"time"`
}

type McDirFilter struct {
	Path string `json:"path"`
}

func getDirectoryList(w http.ResponseWriter, r *http.Request) {
	reqBody, _ := ioutil.ReadAll(r.Body)
	var filter McDirFilter
	json.Unmarshal(reqBody, &filter)

	result := doDirectoryList(&filter)
	json.NewEncoder(w).Encode(result)
}

func doDirectoryList(filter *McDirFilter) []McFile {
	var result []McFile

	if strings.Trim(filter.Path, " ") == "" {
		filter.Path = "."
	}

	files, err := ioutil.ReadDir(filter.Path)
	if err != nil {
		log.Println(err)
	}

	for _, f := range files {
		ext := filepath.Ext(f.Name())
		name := f.Name()[:len(f.Name())-len(ext)]
		if len(ext) > 0 {
			ext = ext[1:]
		}
		file := McFile{name, ext, f.Size(), f.IsDir(), f.ModTime()}
		result = append(result, file)
	}
	return result
}
