package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

type Configuration struct {
	LeftFolder              string `json:"leftFolder"`
	RightFolder             string `json:"rightFolder"`
	RememberLastUsedFolders bool   `json:"rememberLastUsedFolders"`
}

func getConfigPreferences(w http.ResponseWriter, r *http.Request) {
	home, err := os.UserHomeDir()
	if err != nil {
		home = "."
	}
	home += "/mat-commander"
	os.MkdirAll(home, os.ModePerm)
	jsonFile, err := os.Open(home + "/preferences.json")

	if err != nil {
		conf := Configuration{LeftFolder: home, RightFolder: home}
		json.NewEncoder(w).Encode(conf)
	} else {
		defer jsonFile.Close()

		conf := Configuration{}
		content, _ := ioutil.ReadAll(jsonFile)
		json.Unmarshal(content, &conf)
		json.NewEncoder(w).Encode(conf)
	}
}

func updateConfigPreferences(w http.ResponseWriter, r *http.Request) {
	reqBody, _ := ioutil.ReadAll(r.Body)
	var conf Configuration
	json.Unmarshal(reqBody, &conf)

	home, err := os.UserHomeDir()
	if err != nil {
		home = "."
	}
	home += "/mat-commander"
	os.MkdirAll(home, os.ModePerm)

	data, _ := json.MarshalIndent(conf, "", " ")
	err = ioutil.WriteFile(home+"/preferences.json", data, 0644)

	if err != nil {
		log.Println("Error saving configuration", err)
	}

	json.NewEncoder(w).Encode(conf)
}
