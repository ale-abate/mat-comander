package mc_local_file_system

import (
	"encoding/json"
	"github.com/shirou/gopsutil/disk"
	"net/http"
)

func GetRootFolderList(w http.ResponseWriter, _ *http.Request) {
	folders := findAllRoots()
	json.NewEncoder(w).Encode(folders)
}

var defaultRoot *McRootFolder

func GetDefaultRoot() *McRootFolder {
	if defaultRoot == nil {
		defaultRoot = &findAllRoots()[0]
	}
	return defaultRoot
}

func findAllRoots() []McRootFolder {
	var folders []McRootFolder
	partitions, _ := disk.Partitions(false)
	for ix, partition := range partitions {
		if partition.Fstype != "squashfs" {
			println("Partition -> ", ix, partition.Fstype, partition.Device, partition.Mountpoint, partition.Opts)
			folders = append(folders, McRootFolder{partition.Mountpoint, partition.Fstype})
		}
	}
	return folders
}
