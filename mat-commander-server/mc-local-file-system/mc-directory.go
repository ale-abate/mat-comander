package mc_local_file_system

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
)

func GetDirectoryList(w http.ResponseWriter, r *http.Request) {
	reqBody, _ := ioutil.ReadAll(r.Body)
	var filter McDirFilter
	json.Unmarshal(reqBody, &filter)

	dr := GetDefaultRoot()
	result := AccessOperationsFor(dr).doDirectoryList(&filter)

	log.Print("Listing: ", &filter)

	json.NewEncoder(w).Encode(result)
}
