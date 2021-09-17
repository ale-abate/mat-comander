package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
)

type McFile struct {
	Name string `json:"name"`
	Ext  string `json:"ext"`
	Size int64  `json:"size"`
	Dir  bool   `json:"dir"`
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
		file := McFile{f.Name(), "", f.Size(), true}
		result = append(result, file)
	}
	return result
}
