package mc_local_file_system

import (
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
	Path    string `json:"path"`
	onlyDir bool   `json:"onlyDir"`
}

type McRootFolder struct {
	Name      string `json:"name"`
	Type      string `json:"type"`
	Separator string `json:"separator"`
}

type McDir struct {
	Root McRootFolder `json:"rootFolder"`
	Path string       `json:"path"`
	File McFile       `json:"file"`
}

type DirectoryOperations interface {
	doDirectoryList(filter *McDirFilter) []McFile
	convertPathToMcFile(path string, result *McFile) *McFile
}
