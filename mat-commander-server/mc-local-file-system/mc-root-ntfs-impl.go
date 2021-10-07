package mc_local_file_system

import (
	"io/fs"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"
)

type NTFS struct {
}

func (ntfs NTFS) convertPathToMcFile(path string, file *McFile) *McFile {
	fi, err := os.Stat(path)
	if err == nil {
		convertFileInfo2McFile(file, fi)
	}

	return file
}

func (ntfs *NTFS) doDirectoryList(filter *McDirFilter) []McFile {
	var result []McFile

	if strings.Trim(filter.Path, " ") == "" {
		filter.Path = "."
	}
	filter.Path = strings.ReplaceAll(filter.Path, "/", string(os.PathSeparator))

	parts := strings.Split(filter.Path, string(os.PathSeparator))
	if len(parts) > 1 {
		prev := McFile{
			Name: "..",
			Ext:  "",
			Size: 0,
			Dir:  true,
			Time: time.Time{},
		}
		result = append(result, prev)
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

func convertFileInfo2McFile(file *McFile, fi os.FileInfo) {
	file.Size = fi.Size()
	file.Dir = fi.IsDir()
	file.Time = fi.ModTime()

	if file.Dir {
		file.Name = fi.Name()
		file.Ext = ""
	} else {
		ext := filepath.Ext(fi.Name())
		name := fi.Name()[:len(fi.Name())-len(ext)]
		if len(ext) > 0 {
			ext = ext[1:]
		}

		if len(name) == 0 {
			file.Name = fi.Name()
			file.Ext = ""
		} else {
			file.Name = name
			file.Ext = ext
		}

	}
}
