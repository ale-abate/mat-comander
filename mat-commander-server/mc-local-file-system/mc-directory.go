package mc_local_file_system

import (
	"encoding/json"
	"io/fs"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
)

func GetDirectoryList(w http.ResponseWriter, r *http.Request) {
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
		if applyDirFilter(filter, f) {
			var file McFile
			convertFileInfo2McFile(&file, f)
			result = append(result, file)
		}
	}
	return result
}

func applyDirFilter(filter *McDirFilter, fi fs.FileInfo) bool {
	if filter.onlyDir && !fi.IsDir() {
		return false
	}
	return true
}
