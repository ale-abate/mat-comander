package mc_local_file_system

import (
	"encoding/json"
	"github.com/shirou/gopsutil/disk"
	"net/http"
)

type McRootFolder struct {
	Name string `json:"name"`
	Type string `json:"type"`
}

func GetRootFolderList(w http.ResponseWriter, r *http.Request) {

	var folders []McRootFolder

	partitions, _ := disk.Partitions(false)
	for _, partition := range partitions {
		folders = append(folders, McRootFolder{partition.Mountpoint, partition.Fstype})
	}

	json.NewEncoder(w).Encode(folders)
}
