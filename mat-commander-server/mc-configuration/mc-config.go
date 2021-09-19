package mc_configuration

import (
	"encoding/json"
	"github.com/shirou/gopsutil/disk"
	"io/ioutil"
	"log"
	mc_local_file_system "mat-commander/mc-local-file-system"
	"net/http"
	"os"
	"strings"
)

type Configuration struct {
	LeftRootFolder          mc_local_file_system.McRootFolder `json:"leftRootFolder"`
	LeftFolder              string                            `json:"leftFolder"`
	RightRootFolder         mc_local_file_system.McRootFolder `json:"rightRootFolder"`
	RightFolder             string                            `json:"rightFolder"`
	RememberLastUsedFolders bool                              `json:"rememberLastUsedFolders"`
}

func GetConfigPreferences(w http.ResponseWriter, r *http.Request) {
	home, err := os.UserHomeDir()
	if err != nil {
		home = "."
	}

	jsonFile, err := os.Open(home + "/.mat-commander/preferences.json")

	if err != nil {
		partitions, _ := disk.Partitions(false)
		defaultRF := partitions[0]

		for _, partition := range partitions {
			if strings.HasPrefix(home, partition.Mountpoint) {
				defaultRF = partition
				break
			}
		}

		conf := Configuration{
			LeftFolder:              home,
			RightFolder:             home,
			RememberLastUsedFolders: true,
			LeftRootFolder:          mc_local_file_system.McRootFolder{Name: defaultRF.Mountpoint, Type: defaultRF.Fstype},
			RightRootFolder:         mc_local_file_system.McRootFolder{Name: defaultRF.Mountpoint, Type: defaultRF.Fstype},
		}

		json.NewEncoder(w).Encode(conf)
	} else {
		defer jsonFile.Close()

		conf := Configuration{}
		content, _ := ioutil.ReadAll(jsonFile)
		json.Unmarshal(content, &conf)
		json.NewEncoder(w).Encode(conf)
	}
}

func UpdateConfigPreferences(w http.ResponseWriter, r *http.Request) {
	reqBody, _ := ioutil.ReadAll(r.Body)
	var conf Configuration
	json.Unmarshal(reqBody, &conf)

	home, err := os.UserHomeDir()
	if err != nil {
		home = "."
	}
	home += "/.mat-commander"
	os.MkdirAll(home, os.ModePerm)

	data, _ := json.MarshalIndent(conf, "", " ")
	err = ioutil.WriteFile(home+"/preferences.json", data, 0644)

	if err != nil {
		log.Println("Error saving configuration", err)
	}

	json.NewEncoder(w).Encode(conf)
}
