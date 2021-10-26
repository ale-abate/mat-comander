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
	LeftDir                 mc_local_file_system.McDir `json:"left_dir"`
	RightDir                mc_local_file_system.McDir `json:"right_dir"`
	RememberLastUsedFolders bool                       `json:"rememberLastUsedFolders"`

	KeyCommandBinding map[string]string `json:"keyCommand"`
}

func GetConfigPreferences(w http.ResponseWriter, _ *http.Request) {
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

		defRoot := mc_local_file_system.McRootFolder{Name: defaultRF.Mountpoint, Type: defaultRF.Fstype, Separator: string(os.PathSeparator)}
		defDir := mc_local_file_system.McDir{
			Root: defRoot,
			Path: home,
			File: mc_local_file_system.MapStringPathToMcFile(defRoot, home),
		}

		conf := Configuration{
			LeftDir:                 defDir,
			RightDir:                defDir,
			RememberLastUsedFolders: true,
			KeyCommandBinding:       createDefaultKeyMap(),
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(conf)
	} else {
		defer jsonFile.Close()

		conf := Configuration{}
		content, _ := ioutil.ReadAll(jsonFile)
		json.Unmarshal(content, &conf)

		conf.LeftDir.File = mc_local_file_system.MapStringPathToMcFile(conf.LeftDir.Root, conf.LeftDir.Path)
		conf.RightDir.File = mc_local_file_system.MapStringPathToMcFile(conf.RightDir.Root, conf.RightDir.Path)

		if conf.KeyCommandBinding == nil || len(conf.KeyCommandBinding) == 0 {
			conf.KeyCommandBinding = createDefaultKeyMap()
		}

		w.Header().Set("Content-Type", "application/json")
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
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(conf)
}

func createDefaultKeyMap() map[string]string {
	keys := make(map[string]string)

	keys["F3"] = "view"
	keys["F4"] = "edit"
	keys["F5"] = "copy"
	keys["F6"] = "move"
	keys["F7"] = "make_dir"

	keys["Insert"] = "toggle_selection"
	keys["ArrowUp"] = "select_up"
	keys["ArrowDown"] = "select_down"
	keys["Tab"] = "switch_panel"

	return keys
}
