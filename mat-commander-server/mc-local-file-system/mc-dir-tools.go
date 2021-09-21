package mc_local_file_system

import (
	"log"
	"os"
	"path/filepath"
)

func SolveFile(root McRootFolder, path string) McFile {
	var file McFile

	switch root.Type {
	case "NTFS", "ext3", "ext4":
		fi, err := os.Stat(path)
		if err == nil {
			convertFileInfo2McFile(&file, fi)
		}

	default:
		log.Println("ERROR: Cannot solve path for ", root.Type)

	}

	return file
}

func convertFileInfo2McFile(file *McFile, fi os.FileInfo) {

	ext := filepath.Ext(fi.Name())
	name := fi.Name()[:len(fi.Name())-len(ext)]
	if len(ext) > 0 {
		ext = ext[1:]
	}
	file.Name = name
	file.Ext = ext
	file.Size = fi.Size()
	file.Dir = fi.IsDir()
	file.Time = fi.ModTime()
}
