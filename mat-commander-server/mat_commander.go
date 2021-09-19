package main

import (
	"github.com/gorilla/mux"
	"log"
	"mat-commander/mc-configuration"
	mc_http_server "mat-commander/mc-http-server"
	"mat-commander/mc-local-file-system"
	"net/http"
)

func main() {

	myRouter := mux.NewRouter().StrictSlash(true)
	myRouter.HandleFunc("/", mc_http_server.ServeTemplate)
	myRouter.HandleFunc("/{!(api)}", mc_http_server.ServeTemplate)
	myRouter.HandleFunc("/api/dir", mc_local_file_system.GetDirectoryList)
	myRouter.HandleFunc("/api/root", mc_local_file_system.GetRootFolderList)
	myRouter.HandleFunc("/api/config/preferences", mc_configuration.UpdateConfigPreferences).Methods("POST")
	myRouter.HandleFunc("/api/config/preferences", mc_configuration.GetConfigPreferences).Methods("GET")

	log.Println("Listening on :3000...")
	err := http.ListenAndServe(":3000", myRouter)
	if err != nil {
		log.Fatal(err)
	}
}
